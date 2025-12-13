/**
 * Check if WebGL is available in the current browser
 * @returns true if WebGL or WebGL2 is available
 */
export function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');

    if (!gl) return false;

    // Cleanup - lose the context to free resources
    if (gl instanceof WebGLRenderingContext || gl instanceof WebGL2RenderingContext) {
      const loseContext = gl.getExtension('WEBGL_lose_context');
      if (loseContext) loseContext.loseContext();
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Get a user-friendly error message for WebGL not being available
 * @returns error message string
 */
export function getWebGLErrorMessage(): string {
  const ua = navigator.userAgent.toLowerCase();

  if (ua.includes('trident') || ua.includes('msie')) {
    return 'WebGL is not supported in Internet Explorer. Please use a modern browser like Chrome, Firefox, or Edge.';
  }

  if (ua.includes('mobile') || ua.includes('android')) {
    return 'WebGL may not be available on your mobile device. Try enabling hardware acceleration in your browser settings.';
  }

  return 'WebGL is not supported or not enabled in your browser. Please check your browser settings and ensure hardware acceleration is enabled.';
}

/**
 * WebGLNotSupportedError - Custom error for WebGL not being available
 */
export class WebGLNotSupportedError extends Error {
  constructor() {
    super('WebGL is not supported in this browser');
    this.name = 'WebGLNotSupportedError';
  }
}
