import React, { useEffect, useRef, useState } from 'react';
import type { OrbConfigInternal } from './OrbConfig';
import { OrbEngine } from './OrbEngine';

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
  const engineRef = useRef<OrbEngine | null>(null);
  const fpsSamples = useRef<number[]>([]);
  const fpsRaf = useRef<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    try {
      engineRef.current = new OrbEngine(canvasRef.current);
      engineRef.current.setConfig(config);
    } catch (e: any) {
      console.error("Failed to initialize OrbEngine:", e);
      setError(e.message || "Failed to initialize WebGL context.");
      return;
    }

    const handleResize = () => {
      if (canvasRef.current && engineRef.current) {
        const parent = canvasRef.current.parentElement;
        if (parent) {
             engineRef.current.resize(parent.clientWidth, parent.clientHeight);
        }
      }
    };

    // Initial resize to fit container
    handleResize();

    window.addEventListener('resize', handleResize);

    // ResizeObserver for container resize
    const resizeObserver = new ResizeObserver(() => handleResize());
    if (canvasRef.current.parentElement) {
        resizeObserver.observe(canvasRef.current.parentElement);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      engineRef.current?.dispose();
      engineRef.current = null;
      if (fpsRaf.current) cancelAnimationFrame(fpsRaf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

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

  return <canvas ref={canvasRef} className={className} style={{ width: '100%', height: '100%', display: 'block' }} />;
};
