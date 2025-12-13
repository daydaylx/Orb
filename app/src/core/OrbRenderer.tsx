import React, { useEffect, useRef, useState } from 'react';
import type { OrbConfigInternal } from './OrbConfig';
import { isWebGLAvailable, getWebGLErrorMessage } from '../utils/webgl';

// Lazy load the engine
const loadEngine = () => import('./OrbEngine').then(m => m.OrbEngine);

interface OrbRendererProps {
  config: OrbConfigInternal;
  className?: string;
  quality: 'high' | 'medium' | 'low';
  playbackMode: 'live' | 'scrub';
  scrubT: number;
  onFps?: (fps: number) => void;
}

export const OrbRenderer: React.FC<OrbRendererProps> = ({ config, className, quality, playbackMode, scrubT, onFps }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<any | null>(null);
  const fpsSamples = useRef<number[]>([]);
  const fpsRaf = useRef<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (!isWebGLAvailable()) {
      setError(getWebGLErrorMessage());
      setLoading(false);
      return;
    }

    // Dispose old engine if it exists
    if (engineRef.current) {
      engineRef.current.dispose();
      engineRef.current = null;
    }

    let isMounted = true;

    // Async load engine
    loadEngine().then((OrbEngineClass) => {
        if (!isMounted || !canvasRef.current) return;

        try {
            engineRef.current = new OrbEngineClass(canvasRef.current);
            engineRef.current.setConfig(config);
            setLoading(false);

             // Handle resize after engine init
             if (canvasRef.current.parentElement) {
                 engineRef.current.resize(canvasRef.current.parentElement.clientWidth, canvasRef.current.parentElement.clientHeight);
             }
        } catch (e: any) {
            console.error("Failed to initialize OrbEngine:", e);
            setError(e.message || "Failed to initialize WebGL context.");
        }
    }).catch(e => {
        console.error("Failed to load OrbEngine code:", e);
        setError("Failed to load 3D Engine.");
    });


    const handleResize = () => {
      if (canvasRef.current && engineRef.current) {
        const parent = canvasRef.current.parentElement;
        if (parent) {
             engineRef.current.resize(parent.clientWidth, parent.clientHeight);
        }
      }
    };

    window.addEventListener('resize', handleResize);

    // ResizeObserver for container resize
    const resizeObserver = new ResizeObserver(() => handleResize());
    if (canvasRef.current.parentElement) {
        resizeObserver.observe(canvasRef.current.parentElement);
    }

    return () => {
      isMounted = false;
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      engineRef.current?.dispose();
      engineRef.current = null;
      if (fpsRaf.current) cancelAnimationFrame(fpsRaf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.id]); // Re-create engine if config ID changes

  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setConfig(config);
    }
  }, [config]);

  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setQuality(quality);
    }
  }, [quality]);

  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setPlayback(playbackMode, scrubT);
    }
  }, [playbackMode, scrubT]);

  // Drag & drop environment maps (jpg/png/hdr)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      if (!engineRef.current || !e.dataTransfer?.files?.length) return;
      const file = e.dataTransfer.files[0];
      const url = URL.createObjectURL(file);
      const isHdr = file.name.toLowerCase().endsWith('.hdr');
      engineRef.current.setEnvironment(url, isHdr).finally(() => URL.revokeObjectURL(url));
    };

    canvas.addEventListener('dragover', handleDragOver);
    canvas.addEventListener('drop', handleDrop);
    return () => {
      canvas.removeEventListener('dragover', handleDragOver);
      canvas.removeEventListener('drop', handleDrop);
    };
  }, []);

  // Lightweight FPS sampler (averages last 20 frames)
  useEffect(() => {
    if (error) return; 

    let last = performance.now();
    const tick = () => {
      const now = performance.now();
      const delta = now - last;
      last = now;
      if (delta > 0) {
        fpsSamples.current.push(1000 / delta);
        if (fpsSamples.current.length >= 20) {
          const avg = fpsSamples.current.reduce((a, b) => a + b, 0) / fpsSamples.current.length;
          onFps?.(avg);
          fpsSamples.current = [];
        }
      }
      fpsRaf.current = requestAnimationFrame(tick);
    };
    fpsRaf.current = requestAnimationFrame(tick);
    return () => {
      if (fpsRaf.current) cancelAnimationFrame(fpsRaf.current);
    };
  }, [onFps, error]);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-900 text-red-400 p-4 text-center ${className}`} style={{ width: '100%', height: '100%' }}>
        <div>
          <h3 className="font-bold text-lg mb-2">WebGL Error</h3>
          <p>{error}</p>
          <p className="text-sm text-gray-500 mt-2">Please check if hardware acceleration is enabled in your browser.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ width: '100%', height: '100%' }}>
      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 z-10">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
};
