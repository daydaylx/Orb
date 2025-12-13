export function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGL2RenderingContext && canvas.getContext('webgl2'));
  } catch {
    return false;
  }
}

export function getWebGLErrorMessage(): string {
  return window.WebGL2RenderingContext
    ? 'Your graphics card does not seem to support WebGL 2.'
    : 'Your browser does not support WebGL 2.';
}
