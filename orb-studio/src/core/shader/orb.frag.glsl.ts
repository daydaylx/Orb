export const orbFrag = `
uniform float u_time;
uniform vec3 u_colorInner;
uniform vec3 u_colorOuter;
uniform vec3 u_colorAccent;
uniform float u_gradientBias;

// Glow
uniform float u_glowIntensity;
uniform float u_glowThreshold;
uniform float u_glowRadius;

// Details
uniform float u_bandCount;
uniform float u_bandSharpness;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying float vNoise;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(cameraPosition - vPosition);

  // 1. Basic Fresnel / Gradient
  float fresnel = dot(normal, viewDir);
  fresnel = clamp(fresnel, 0.0, 1.0);
  float invFresnel = 1.0 - fresnel;

  // Bias controls how much "inner" vs "outer" is visible
  float mixFactor = smoothstep(u_gradientBias - 0.2, u_gradientBias + 0.2, invFresnel);
  vec3 baseColor = mix(u_colorInner, u_colorOuter, mixFactor);

  // 2. Glow Effect (Rim Lighting)
  // Higher glowRadius makes the rim wider
  float glow = pow(invFresnel, max(0.1, (1.0 - u_glowRadius) * 4.0));
  // Apply threshold
  glow = smoothstep(u_glowThreshold, 1.0, glow);

  // Add glow to base color
  vec3 finalColor = baseColor + (u_colorAccent * glow * u_glowIntensity);

  // 3. Bands / Details
  // Use y-position and noise to create bands
  if (u_bandCount > 0.0) {
     float bandPos = vPosition.y * u_bandCount + vNoise;
     float band = sin(bandPos * 3.14159 * 2.0);
     // Sharpen bands
     band = smoothstep(0.5 - u_bandSharpness * 0.5, 0.5 + u_bandSharpness * 0.5, abs(band));

     // Mix band color (using accent)
     finalColor = mix(finalColor, u_colorAccent, band * 0.3); // 0.3 factor to not overpower
  }

  // 4. Noise Influence on Color
  // subtle variation based on noise
  finalColor += vNoise * 0.05;

  gl_FragColor = vec4(finalColor, 1.0);
}
`;
