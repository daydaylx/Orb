import React, { useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { useOrbStore } from '../../state/useOrbStore';
import { exportOrbConfigToJson, toExternalConfig, importOrbConfig } from '../../core/OrbConfig';
import type { OrbConfigInternal } from '../../core/OrbConfig';

export const ExportPanel: React.FC = () => {
  const activeOrb = useOrbStore((state) => state.orbs.find((orb) => orb.id === state.activeOrbId));
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [previewConfig, setPreviewConfig] = useState<OrbConfigInternal | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const createOrb = useOrbStore((state) => state.createOrb);
  const setActiveOrb = useOrbStore((state) => state.setActiveOrb);

  if (!activeOrb) return null;

  const processFile = (file: File) => {
    setImportError(null);
    setPreviewConfig(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = e.target?.result as string;
        const config = importOrbConfig(json);
        setPreviewConfig(config);
      } catch (error: any) {
        console.error('Import failed:', error);
        setImportError(error.message || 'Failed to import JSON');
      }
    };
    reader.readAsText(file);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    processFile(file);
    event.target.value = '';
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.name.endsWith('.json')) {
      processFile(file);
    } else if (file) {
      setImportError('Please drop a valid .json file');
    }
  }, []);

  const confirmImport = () => {
    if (previewConfig) {
      createOrb(previewConfig);
      setActiveOrb(previewConfig.id);
      setPreviewConfig(null);
    }
  };

  const cancelImport = () => {
    setPreviewConfig(null);
    setImportError(null);
  };

  const handleCopy = async () => {
    try {
      const json = exportOrbConfigToJson(activeOrb);
      await navigator.clipboard.writeText(json);
      setCopyFeedback('Copied!');
      setTimeout(() => setCopyFeedback(null), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
      setCopyFeedback('Error copying');
    }
  };

  const handleShareLink = async () => {
    try {
      const payload = btoa(encodeURIComponent(JSON.stringify(toExternalConfig(activeOrb))));
      const url = `${window.location.origin}${window.location.pathname}?orb=${payload}`;
      await navigator.clipboard.writeText(url);
      setShareFeedback('Link copied');
      setTimeout(() => setShareFeedback(null), 2000);
    } catch (err) {
      console.error('share link failed', err);
      setShareFeedback('Error');
    }
  };

  const handleDownload = () => {
    const json = exportOrbConfigToJson(activeOrb);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orb-${activeOrb.id || 'config'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleGltf = () => {
    // lightweight scene approximation (standard material, no custom shader)
    const scene = new THREE.Scene();
    const geometry = new THREE.SphereGeometry(activeOrb.baseRadius, 64, 64);
    const gradient = new THREE.Color(activeOrb.colors.outer);
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(activeOrb.colors.inner),
      emissive: new THREE.Color(activeOrb.colors.accent).multiplyScalar(activeOrb.glow.intensity),
      metalness: 0.1,
      roughness: 0.4,
      envMapIntensity: 0.2,
    });
    // @ts-expect-error gradientMap is not in the type definition but supported by Three.js
    mat.gradientMap = null;
    const mesh = new THREE.Mesh(geometry, mat);
    scene.add(mesh);

    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
    const point = new THREE.PointLight(gradient, 1, 10);
    point.position.set(2, 2, 2);
    scene.add(hemi, point);

    const exporter = new GLTFExporter();
    exporter.parse(
      scene,
      (gltf) => {
        const data = gltf as ArrayBuffer | string;
        const blob = typeof data === 'string' ? new Blob([data], { type: 'application/json' }) : new Blob([data], { type: 'model/gltf-binary' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `orb-${activeOrb.id || 'scene'}.${typeof data === 'string' ? 'gltf' : 'glb'}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      },
      (error) => console.error('GLTF export error', error),
      { binary: true }
    );
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Export</h3>
        <div className="space-y-3">
          <button
            onClick={handleCopy}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium transition-colors flex justify-center items-center"
          >
            {copyFeedback || 'Copy JSON'}
          </button>
          <button
            onClick={handleDownload}
            className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded font-medium transition-colors border border-gray-600"
          >
            Download JSON
          </button>
          <button
            onClick={handleShareLink}
            className="w-full px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded font-medium transition-colors"
          >
            {shareFeedback || 'Copy Share Link'}
          </button>
          <button
            onClick={handleGltf}
            className="w-full px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded font-medium transition-colors"
          >
            Download GLB (preview)
          </button>
        </div>
        <div className="mt-4 text-xs text-gray-500">
            Export format: OrbConfigExternalV1
        </div>
      </div>

      <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Import</h3>
        <div className="space-y-3">
            {!previewConfig ? (
              <div
                className={`relative border-2 border-dashed rounded-lg p-6 transition-colors text-center ${
                  dragOver ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="space-y-2 pointer-events-none">
                  <div className="text-gray-400 text-sm">
                    {dragOver ? 'Drop file to import' : 'Drag & Drop JSON file here'}
                  </div>
                  <div className="text-gray-600 text-xs">or click to browse</div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-900/50 p-3 rounded border border-gray-600 space-y-3">
                <div className="text-sm font-medium text-gray-300">Preview Import</div>
                <div className="text-xs text-gray-400 space-y-1">
                  <div>Name: <span className="text-white">{previewConfig.label}</span></div>
                  <div>ID: <span className="font-mono text-gray-500">{previewConfig.id.slice(0, 8)}...</span></div>
                  <div className="flex items-center gap-2">
                    Colors:
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: previewConfig.colors.inner }} />
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: previewConfig.colors.outer }} />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={confirmImport}
                    className="flex-1 px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-xs rounded font-medium transition-colors"
                  >
                    Confirm Import
                  </button>
                  <button
                    onClick={cancelImport}
                    className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {importError && (
                <div className="text-xs text-red-400 bg-red-900/20 p-2 rounded border border-red-900/50">
                    {importError}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
