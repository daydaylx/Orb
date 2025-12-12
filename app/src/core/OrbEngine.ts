import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import type { OrbConfigInternal } from './OrbConfig';
import { orbVert } from './shader/orb.vert.glsl.ts';
import { orbFrag } from './shader/orb.frag.glsl.ts';
import { updateOrbUniforms, type OrbUniforms } from './mapping/configToUniforms';
import { chromaticVignetteShader } from './postprocessing/chromaticVignetteShader';
import { filmGrainShader } from './postprocessing/filmGrainShader';

export class OrbEngine {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private composer: EffectComposer;
  private bloomPass: UnrealBloomPass;
  private chromaPass: ShaderPass;
  private grainPass: ShaderPass;
  private dofPass: BokehPass;
  private orbMesh: THREE.Mesh | null = null;
  private material: THREE.ShaderMaterial | null = null;
  private animationId: number | null = null;
  private uniforms: OrbUniforms | null = null;
  private loopSeconds = 10;
  private playbackMode: 'live' | 'scrub' = 'live';
  private scrubT = 0;
  private easing: 'linear' | 'easeInOut' | 'elastic' | 'bounce' = 'linear';
  private quality: 'high' | 'medium' | 'low' = 'high';
  private bloomStrengthBase = 1;

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

    // Subtle chromatic aberration + vignette
    this.chromaPass = new ShaderPass(chromaticVignetteShader);
    this.chromaPass.material.uniforms.u_resolution.value = new THREE.Vector2(canvas.width, canvas.height);
    this.composer.addPass(this.chromaPass);

    // Film grain (toggleable)
    this.grainPass = new ShaderPass(filmGrainShader);
    this.composer.addPass(this.grainPass);

    // Depth of field (can be heavy, disabled by default)
    this.dofPass = new BokehPass(this.scene, this.camera, {
      focus: 1.0,
      aperture: 0.0002,
      maxblur: 0.01,
      width: canvas.width,
      height: canvas.height,
    });
    this.dofPass.enabled = false;
    this.composer.addPass(this.dofPass);

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
      u_colorAccent: { value: new THREE.Color(0xffff00) },
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
    this.loopSeconds = config.animation.loopSeconds || 10;
    this.easing = config.animation.easing || 'linear';

    if (config.bloom) {
        this.bloomPass.enabled = config.bloom.enabled;
        this.bloomStrengthBase = config.bloom.strength;
        this.applyQualityToBloom();
        this.bloomPass.radius = config.bloom.radius;
        this.bloomPass.threshold = config.bloom.threshold;
    }

    // Post-processing toggles
    if (config.post) {
      this.chromaPass.enabled = config.post.chromaticAberration;
      this.chromaPass.material.uniforms.u_aberration.value = config.post.chromaticAmount;
      this.chromaPass.material.uniforms.u_vignette.value = config.post.vignette;

      this.grainPass.enabled = config.post.filmGrain.enabled;
      this.grainPass.material.uniforms.u_intensity.value = config.post.filmGrain.intensity;

      this.dofPass.enabled = config.post.dof.enabled;
      this.dofPass.materialBokeh.uniforms['focus'].value = config.post.dof.focus;
      this.dofPass.materialBokeh.uniforms['aperture'].value = config.post.dof.aperture;
      this.dofPass.materialBokeh.uniforms['maxblur'].value = config.post.dof.maxBlur;
    }

    this.rotationSpeed = config.rotation;
  }

  private rotationSpeed = { xSpeed: 0, ySpeed: 0 };

  public setQuality(level: 'high' | 'medium' | 'low') {
    this.quality = level;
    const pixelRatio = level === 'low' ? 1 : level === 'medium' ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2);
    this.renderer.setPixelRatio(pixelRatio);
    this.applyQualityToBloom();
  }

  private applyQualityToBloom() {
    const multiplier = this.quality === 'low' ? 0.75 : this.quality === 'medium' ? 0.9 : 1;
    this.bloomPass.strength = this.bloomStrengthBase * multiplier;
  }

  public resize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.composer.setSize(width, height);
    this.chromaPass.material.uniforms.u_resolution.value.set(width, height);
    this.dofPass.setSize(width, height);
  }

  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate);

    const rawTime = performance.now() / 1000;

    if (this.uniforms) {
        const loop = Math.max(this.loopSeconds, 0.0001);
        const tNorm = this.playbackMode === 'scrub'
          ? this.scrubT
          : (rawTime % loop) / loop;

        const eased = this.applyEasing(tNorm);
        this.uniforms.u_time.value = eased * loop;
    }

    // Drive grain animation even when orb time is overridden later
    if (this.grainPass?.material?.uniforms?.u_time) {
      this.grainPass.material.uniforms.u_time.value = rawTime;
    }

    if (this.orbMesh) {
       this.orbMesh.rotation.y += this.rotationSpeed.ySpeed * 0.05;
       this.orbMesh.rotation.x += this.rotationSpeed.xSpeed * 0.05;
    }

    this.composer.render();
  };

  private applyEasing(t: number) {
    const clamped = Math.min(Math.max(t, 0), 1);
    switch (this.easing) {
      case 'easeInOut':
        return clamped < 0.5 ? 2 * clamped * clamped : -1 + (4 - 2 * clamped) * clamped;
      case 'elastic':
        return Math.sin(-13.0 * (clamped + 1.0) * Math.PI / 2) * Math.pow(2.0, -10.0 * clamped) + 1.0;
      case 'bounce': {
        const n1 = 7.5625;
        const d1 = 2.75;
        let x = clamped;
        if (x < 1 / d1) {
          return n1 * x * x;
        } else if (x < 2 / d1) {
          x -= 1.5 / d1;
          return n1 * x * x + 0.75;
        } else if (x < 2.5 / d1) {
          x -= 2.25 / d1;
          return n1 * x * x + 0.9375;
        } else {
          x -= 2.625 / d1;
          return n1 * x * x + 0.984375;
        }
      }
      default:
        return clamped;
    }
  }

  public setPlayback(mode: 'live' | 'scrub', scrubT: number = 0) {
    this.playbackMode = mode;
    this.scrubT = scrubT;
  }

  public dispose() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.renderer.dispose();
    this.composer.dispose();
    this.material?.dispose();
    this.orbMesh?.geometry.dispose();
  }
}
