export const orbFrag = `
uniform float u_time;
uniform vec3 u_colorInner;
uniform vec3 u_colorOuter;
uniform float u_gradientBias;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(cameraPosition - vPosition);

  float fresnel = dot(normal, viewDir);
  fresnel = clamp(fresnel, 0.0, 1.0);

  float mixFactor = smoothstep(u_gradientBias - 0.2, u_gradientBias + 0.2, 1.0 - fresnel);

  vec3 color = mix(u_colorInner, u_colorOuter, mixFactor);

  gl_FragColor = vec4(color, 1.0);
}
`;
