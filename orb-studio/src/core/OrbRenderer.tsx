import React, { useEffect, useRef } from 'react';
import type { OrbConfigInternal } from './OrbConfig';
import { OrbEngine } from './OrbEngine';

interface OrbRendererProps {
  config: OrbConfigInternal;
  className?: string;
}

export const OrbRenderer: React.FC<OrbRendererProps> = ({ config, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<OrbEngine | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    engineRef.current = new OrbEngine(canvasRef.current);
    engineRef.current.setConfig(config);

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
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setConfig(config);
    }
  }, [config]);

  return <canvas ref={canvasRef} className={className} style={{ width: '100%', height: '100%', display: 'block' }} />;
};
