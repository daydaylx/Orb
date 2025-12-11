import * as THREE from 'three';
import type { OrbConfig } from './OrbConfig';
import { orbVert } from './shader/orb.vert.glsl';
import { orbFrag } from './shader/orb.frag.glsl';

export class OrbEngine {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private orbMesh: THREE.Mesh | null = null;
  private material: THREE.ShaderMaterial | null = null;
  private animationId: number | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
    this.camera.position.z = 2;

    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    this.renderer.setSize(canvas.width, canvas.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.initOrb();
    this.animate();
  }

  private initOrb() {
    const geometry = new THREE.SphereGeometry(1, 64, 64);

    // Placeholder shader material
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        u_time: { value: 0 },
        u_colorInner: { value: new THREE.Color(0xff0000) },
        u_colorOuter: { value: new THREE.Color(0x0000ff) },
        u_gradientBias: { value: 0.5 }
      },
      vertexShader: orbVert,
      fragmentShader: orbFrag
    });

    this.orbMesh = new THREE.Mesh(geometry, this.material);
    this.scene.add(this.orbMesh);
  }

  public setConfig(config: OrbConfig) {
    if (!this.material || !this.orbMesh) return;

    this.orbMesh.scale.setScalar(config.baseRadius * 2); // Base radius logic

    this.material.uniforms.u_colorInner.value.set(config.colors.inner);
    this.material.uniforms.u_colorOuter.value.set(config.colors.outer);
    this.material.uniforms.u_gradientBias.value = config.colors.gradientBias;

    // Background color handling could be on the renderer or a background plane
    this.renderer.setClearColor(config.colors.background);
  }

  public resize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate);

    if (this.material) {
        this.material.uniforms.u_time.value = performance.now() / 1000;
    }

    // Basic rotation for now, should come from config
    if (this.orbMesh) {
       // this.orbMesh.rotation.y += 0.01;
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
