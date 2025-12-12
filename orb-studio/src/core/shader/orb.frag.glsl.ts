export const orbFrag = `
uniform float u_time;
uniform vec3 u_colorInner;
uniform vec3 u_colorOuter;
uniform float u_gradientBias;

// Glow
uniform float u_glowIntensity;
uniform float u_glowRadius;
uniform float u_glowThreshold;

// Details
uniform float u_bandCount;
uniform float u_bandSharpness;
uniform float u_particleDensity; // unused for now in this simple shader, or could use for sparkles

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying float vNoise;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(cameraPosition - vPosition);

  // Fresnel effect for glow/gradient
  float fresnel = dot(normal, viewDir);
  fresnel = clamp(fresnel, 0.0, 1.0);

  // Inverse fresnel implies edge
  float edgeFactor = 1.0 - fresnel;

  // Base Gradient
  // Adjust mix factor based on bias and noise
  float noisePerturbation = vNoise * 0.1; // subtle noise influence on color mix
  float mixFactor = smoothstep(u_gradientBias - 0.2, u_gradientBias + 0.2, edgeFactor + noisePerturbation);
  vec3 color = mix(u_colorInner, u_colorOuter, mixFactor);

  // Glow
  // Simple glow by adding color on edges
  float glow = pow(edgeFactor, 1.0 / (u_glowRadius + 0.001)); // Avoid div by zero
  glow = smoothstep(u_glowThreshold, 1.0, glow);
  color += u_colorOuter * glow * u_glowIntensity;

  // Bands
  if (u_bandCount > 0.0) {
      // Create bands based on Y position or noise
      // Let's use position.y + noise
      float bandPos = vPosition.y * 2.0 + vNoise * 0.5;
      float bands = sin(bandPos * u_bandCount);
      // Sharpness
      bands = smoothstep(0.5 - u_bandSharpness * 0.5, 0.5 + u_bandSharpness * 0.5, bands);
      // Mix bands (darken or lighten)
      color = mix(color, color * 1.2, bands * 0.3);
  }

  // Particle/Sparkle effect (simple)
  if (u_particleDensity > 0.0) {
      // High frequency noise for sparkles
      // Use logic similar to 'noise' but much higher frequency
      // Since we don't have a separate noise function here, reuse vNoise logic but we need access to position again or compute high freq here.
      // But for simplicity, let's just assume we want some variation.
      // Actually we need a rand function or similar.
      // Let's skip complex sparkles to keep shader simple as requested.
  }

  gl_FragColor = vec4(color, 1.0);
}
`;
