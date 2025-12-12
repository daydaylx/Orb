export const filmGrainShader = {
  uniforms: {
    tDiffuse: { value: null },
    u_time: { value: 0 },
    u_intensity: { value: 0.1 },
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
    uniform float u_time;
    uniform float u_intensity;
    varying vec2 vUv;

    // Simple hash for grain
    float random(vec2 co){
      return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
    }

    void main() {
      vec4 base = texture2D(tDiffuse, vUv);
      float grain = random(vUv * (u_time * 0.5 + 1.0));
      float g = (grain - 0.5) * u_intensity;
      base.rgb += g;
      gl_FragColor = base;
    }
  `,
};
