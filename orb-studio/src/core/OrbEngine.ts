import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import type { OrbConfigInternal } from './OrbConfig';
import { orbVert } from './shader/orb.vert.glsl';
import { orbFrag } from './shader/orb.frag.glsl';
import { updateOrbUniforms, type OrbUniforms } from './mapping/configToUniforms';

export class OrbEngine {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private composer: EffectComposer;
  private bloomPass: UnrealBloomPass;
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
    
    // Post-processing setup
    this.composer = new EffectComposer(this.renderer);
    
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(canvas.width, canvas.height),
      1.5, 0.4, 0.85
    );
    this.composer.addPass(this.bloomPass);

    const outputPass = new OutputPass();
    this.composer.addPass(outputPass);

    this.initOrb();
    this.animate();
  }

  private initOrb() {
    const geometry = new THREE.SphereGeometry(1, 128, 128);

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

    this.uniforms = dummyUniforms as unknown as OrbUniforms;

    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: orbVert,
      fragmentShader: orbFrag
    });

    this.orbMesh = new THREE.Mesh(geometry, this.material);
    this.scene.add(this.orbMesh);
  }

  public setConfig(config: OrbConfigInternal) {
    if (!this.material || !this.orbMesh) {
        return;
    }

    if (this.uniforms) {
        updateOrbUniforms(this.uniforms, config);
    }

    this.orbMesh.scale.setScalar(config.baseRadius * 2);
    this.renderer.setClearColor(config.colors.background);

    if (config.bloom) {
        this.bloomPass.enabled = config.bloom.enabled;
        this.bloomPass.strength = config.bloom.strength;
        this.bloomPass.radius = config.bloom.radius;
        this.bloomPass.threshold = config.bloom.threshold;
    }

    this.rotationSpeed = config.rotation;
  }

  private rotationSpeed = { xSpeed: 0, ySpeed: 0 };

  public resize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.composer.setSize(width, height);
  }

  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate);

    if (this.uniforms) {
        this.uniforms.u_time.value = performance.now() / 1000;
    }

    if (this.orbMesh) {
       this.orbMesh.rotation.y += this.rotationSpeed.ySpeed * 0.05;
       this.orbMesh.rotation.x += this.rotationSpeed.xSpeed * 0.05;
    }

    this.composer.render();
  };

  public dispose() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.renderer.dispose();
    this.composer.dispose();
    this.material?.dispose();
    this.orbMesh?.geometry.dispose();
  }
}
