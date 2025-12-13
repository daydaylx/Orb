import React, { useState } from 'react';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { useOrbStore } from '../../state/useOrbStore';
import { exportOrbConfigToJson, toExternalConfig, importOrbConfig } from '../../core/OrbConfig';

export const ExportPanel: React.FC = () => {
  const activeOrb = useOrbStore((state) => state.orbs.find((orb) => orb.id === state.activeOrbId));
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const createOrb = useOrbStore((state) => state.createOrb);
  const setActiveOrb = useOrbStore((state) => state.setActiveOrb);

  if (!activeOrb) return null;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = e.target?.result as string;
        const config = importOrbConfig(json);
        createOrb(config);
        setActiveOrb(config.id);
      } catch (error: any) {
        console.error('Import failed:', error);
        setImportError(error.message || 'Failed to import JSON');
      }
    };
    reader.readAsText(file);
    // Reset input
    event.target.value = '';
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
            <div className="relative">
                <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <button className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded font-medium transition-colors border border-gray-600 border-dashed">
                    Upload JSON Config
                </button>
            </div>
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
