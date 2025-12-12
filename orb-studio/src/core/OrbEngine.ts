import * as THREE from 'three';
import type { OrbConfig } from './OrbConfig';
import { orbVert } from './shader/orb.vert.glsl';
import { orbFrag } from './shader/orb.frag.glsl';
import { updateOrbUniforms, type OrbUniforms } from './mapping/configToUniforms';

export class OrbEngine {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private orbMesh: THREE.Mesh | null = null;
  private material: THREE.ShaderMaterial | null = null;
  private animationId: number | null = null;
  private uniforms: OrbUniforms | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
    this.camera.position.z = 2;

    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    this.renderer.setSize(canvas.width, canvas.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // We can't initOrb fully here without config, but we can set up the mesh later or use a default config first?
    // The renderer calls setConfig right after creation.
    // So let's initialize with default config logic inside setConfig if not initialized,
    // or just initialize with empty/default uniforms here.
    // For now, let's create a placeholder initialization.
    this.initOrb();
    this.animate();
  }

  private initOrb() {
    const geometry = new THREE.SphereGeometry(1, 128, 128); // Increased segments for better noise detail

    // We need some initial uniforms to avoid crash if render happens before setConfig
    // But since we use createOrbUniforms, we need a config.
    // Let's postpone material creation to setConfig or use dummy values.
    // Using dummy values:
    const dummyUniforms = {
      u_time: { value: 0 },
      u_baseRadius: { value: 0.5 },
      u_colorInner: { value: new THREE.Color(0xff0000) },
      u_colorOuter: { value: new THREE.Color(0x0000ff) },
      u_gradientBias: { value: 0.5 },
      u_noiseScale: { value: 1.0 },
      u_noiseIntensity: { value: 0.0 },
      u_noiseSpeed: { value: 0.0 },
      u_noiseDetail: { value: 0.0 },
      u_glowIntensity: { value: 0.0 },
      u_glowRadius: { value: 0.0 },
      u_glowThreshold: { value: 0.0 },
      u_bandCount: { value: 0.0 },
      u_bandSharpness: { value: 0.0 },
      u_particleDensity: { value: 0.0 },
    };

    // Cast to OrbUniforms to make TS happy, though createOrbUniforms would be better if we had config.
    this.uniforms = dummyUniforms as unknown as OrbUniforms;

    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: orbVert,
      fragmentShader: orbFrag
    });

    this.orbMesh = new THREE.Mesh(geometry, this.material);
    this.scene.add(this.orbMesh);
  }

  public setConfig(config: OrbConfig) {
    if (!this.material || !this.orbMesh) {
        // Should not happen if initOrb is called in constructor
        return;
    }

    // If uniforms were just dummy, we might want to replace them properly or just update them.
    // Since we assigned `this.uniforms` to `this.material.uniforms`, updating `this.uniforms` properties works if they are the same objects.
    // But updateOrbUniforms updates the .value properties.

    // If we want to use `createOrbUniforms` properly, we should probably do it once or just update values.
    // Let's use updateOrbUniforms.

    // However, if we didn't use createOrbUniforms in init, we must ensure the structure is correct.
    // The safest way is to use createOrbUniforms on first real config set if we want to be clean,
    // but THREE.ShaderMaterial holds references to the uniforms object.
    // So replacing the entire uniforms object on the material requires creating a new material or manually re-linking which is messy.
    // So better to just update values.

    if (this.uniforms) {
        updateOrbUniforms(this.uniforms, config);
    }

    this.orbMesh.scale.setScalar(config.baseRadius * 2);
    this.renderer.setClearColor(config.colors.background);

    // Rotation logic if we want to do it in JS
    // For now we just store it? Or maybe we can't easily pass it to animate loop without storing config.
    // Let's store rotation speed in the class.
    this.rotationSpeed = config.rotation;
  }

  private rotationSpeed = { xSpeed: 0, ySpeed: 0 };

  public resize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate);

    if (this.uniforms) {
        this.uniforms.u_time.value = performance.now() / 1000;
    }

    if (this.orbMesh) {
       this.orbMesh.rotation.y += this.rotationSpeed.ySpeed * 0.05; // Scaling down a bit for sanity
       this.orbMesh.rotation.x += this.rotationSpeed.xSpeed * 0.05;
    }

    this.renderer.render(this.scene, this.camera);
  };

  public dispose() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.renderer.dispose();
    this.material?.dispose();
    this.orbMesh?.geometry.dispose();
  }
}
