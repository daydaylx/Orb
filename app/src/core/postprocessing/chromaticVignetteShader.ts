// Simple, low-cost chromatic aberration + vignette shader.
// Based on screen-space UV distortion; keeps settings conservative for performance.
export const chromaticVignetteShader = {
  uniforms: {
    tDiffuse: { value: null },
    u_resolution: { value: { x: 1, y: 1 } },
    u_aberration: { value: 0.0018 }, // radius of channel offset
    u_vignette: { value: 0.28 },     // vignette strength
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform vec2 u_resolution;
    uniform float u_aberration;
    uniform float u_vignette;
    varying vec2 vUv;

    void main() {
      // Normalize to -1..1 for vignette
      vec2 centered = vUv * 2.0 - 1.0;
      float radius = length(centered);

      // Chromatic aberration: radial UV offset per channel
      vec2 dir = normalize(centered) * u_aberration;
      vec2 uvR = vUv + dir;
      vec2 uvB = vUv - dir;
      vec4 col;
      col.r = texture2D(tDiffuse, uvR).r;
      col.g = texture2D(tDiffuse, vUv).g;
      col.b = texture2D(tDiffuse, uvB).b;
      col.a = 1.0;

      // Vignette (smooth falloff)
      float vig = smoothstep(1.0, u_vignette, radius);
      col.rgb *= mix(1.0, 0.0, vig);

      gl_FragColor = col;
    }
  `,
};
