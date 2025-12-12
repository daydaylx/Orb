Okay, „Best Practice“-Plan, ohne Schnickschnack, ohne Code.


---

1. Ziel und Rahmenbedingungen

Ziel:
Eigenständiges „Orb Studio“, mit dem du interaktiv Orb-Configs erstellst, speicherst und exportierst.
In deiner PWA verwendest du später nur:

OrbConfig-Objekte

einen schlanken <OrbRenderer config={...} />


Nicht-Ziele (bewusst NICHT tun):

Kein universeller VFX-Editor

Kein Video-/GIF-Export als Pflicht (höchstens später)

Keine Integration in Disa-AI-Repo in V1



---

2. Tech-Stack (Best Practice für deine Situation)

Language: TypeScript

UI: React

Build: Vite

3D: Three.js (WebGL)

State: React + ggf. Zustand (leichtgewichtig, simpel)

Lint/Format: ESLint + Prettier


Alles Standard, dokumentiert, wartbar.


---

3. Projektstruktur

Empfohlene Struktur:

orb-studio/
  package.json
  vite.config.ts
  tsconfig.json
  src/
    main.tsx
    App.tsx

    core/
      OrbConfig.ts           # Typdefinition + Defaults
      OrbEngine.ts           # Schnittstelle zum Renderer
      OrbRenderer.tsx        # React-Wrapper um Three.js
      shader/
        orb.vert.glsl
        orb.frag.glsl
      mapping/
        configToUniforms.ts  # OrbConfig → Shader-Uniforms

    ui/
      layout/
        Shell.tsx            # Gesamtlayout: Sidebar + Viewport
        HeaderBar.tsx
      controls/
        LookPanel.tsx        # Farben / Glow
        MotionPanel.tsx      # Rotation / Noise
        DetailsPanel.tsx     # Bänder / Partikel
        AnimationPanel.tsx   # Loop etc.
        PresetPanel.tsx
      common/
        Slider.tsx
        ColorPicker.tsx
        Toggle.tsx

    state/
      useOrbStore.ts         # aktuelles OrbConfig / Auswahl
      usePresetStore.ts      # Presets laden/speichern

    presets/
      defaultPresets.ts      # vordefinierte Presets
      presetSchema.ts        # Zod/TS-Validation beim Import

    utils/
      storage.ts             # localStorage-Handling
      export.ts              # JSON/TS-Export
      validation.ts

    styles/
      globals.css
      theme.css

Ziel: klare Trennung von

Rendering (Three.js + Shader)

UI (React)

Datenmodell (OrbConfig)

Storage/Export



---

4. OrbConfig als zentrale Wahrheit

Bevor du irgendwas baust, definierst du die Config sauber. Beispiel-Struktur (anpassbar, aber stabil halten):

// core/OrbConfig.ts
export type OrbConfig = {
  id: string;
  label: string;

  baseRadius: number; // 0.1–1.0

  rotation: {
    xSpeed: number; // rad/s
    ySpeed: number;
  };

  noise: {
    scale: number;
    intensity: number; // 0–1
    speed: number;     // 0–?
    detail: number;    // 0–1
  };

  colors: {
    inner: string;      // "#RRGGBB"
    outer: string;
    accent: string;
    background: string;
    gradientBias: number; // 0–1 (wie stark nach außen gezogen)
  };

  glow: {
    intensity: number;  // 0–1
    threshold: number;  // 0–1
    radius: number;     // 0–1
  };

  details: {
    bandCount: number;      // 0 = keine
    bandSharpness: number;  // 0–1
    particleDensity: number;// 0–1
  };

  animation: {
    loopSeconds: number;    // 2, 3, 5, 10…
  };

  version: 1;               // für spätere Shader-Änderungen
};

Alle Slider, Color-Picker etc. bedienen am Ende nur diese Struktur.
Der Renderer kennt nur OrbConfig → Uniforms.


---

5. Rendering-Architektur (Three.js/Shader)

Best Practice:

1. OrbRenderer-Komponente (React)

erhält config: OrbConfig

initialisiert Three.js nur einmal (Scene, Camera, Renderer, Composer)

hält Referenzen auf Uniforms

im useEffect/useLayoutEffect werden Config-Änderungen auf Uniforms gemappt



2. OrbEngine/Core

Kapselt reines Three.js (kein React drin)

API z. B.:

class OrbEngine {
  constructor(canvas: HTMLCanvasElement);
  setConfig(config: OrbConfig): void;
  resize(width: number, height: number): void;
  dispose(): void;
}

Damit kannst du den Renderer später theoretisch auch außerhalb von React verwenden.



3. Shader-Design

Fragment-Shader:

Kugelkoordinaten → 2D/3D Noise

2 Noise-Layer (smooth + bands)

Farbverlauf aus inner/outer/gradientBias

Zeit-Uniform u_time für Animation


Uniforms:

u_time, u_baseRadius

u_noiseScale, u_noiseIntensity, …

u_colorInner, u_colorOuter, u_colorAccent, …


Looping:

u_time modulo loopSeconds

Optional „ping-pong“-Effect per sin/cos




4. Post-Processing

EffectComposer + UnrealBloomPass

Bloom-Parameter direkt aus config.glow




So trennst du Shader-Logik sauber von UI und machst späteres Refactoring einfacher.


---

6. UI- und State-Architektur

UI-Prinzip:
Keine Magie – simple Panels, jedes Panel bearbeitet einen Teil von OrbConfig.

LookPanel  → config.colors + config.glow

MotionPanel→ config.rotation + config.noise.speed

DetailsPanel→ config.details + evtl. Flags

AnimationPanel→ config.animation


State:

useOrbStore (Zustand oder reine React-Context-Lösung):

currentConfig

setConfig(partial)

resetToDefault()

applyPreset(id)


usePresetStore:

presets: OrbConfig[]

addPreset(config)

updatePreset(id, config)

deletePreset(id)

loadFromStorage() / saveToStorage()



Best Practice:
Immer immutable Updates ({ ...old, rotation: { ...old.rotation, xSpeed: newVal } }), sonst Debug-Hölle.


---

7. Presets, Storage und Export

Presets

presets/defaultPresets.ts mit 5–10 handgebauten Presets:

„Purple Energy“

„Blue Plasma“

„Orange Ember“

„Eye of Void“ etc.



Storage

utils/storage.ts

loadPresets(): OrbConfig[] | null

savePresets(presets: OrbConfig[]): void


Speicherung in localStorage mit Versionierung:

Key z. B. orb-studio-presets-v1

Beim Laden Schema-Validation (Zod/TypeScript-Narrowing), damit dir kein kaputter JSON alles sprengt.



Export

utils/export.ts

exportAsJSON(config: OrbConfig): string
→ minimales JSON ohne Kommentare

exportAsTypeScript(config: OrbConfig, constName: string): string
→ erstellt direkt

export const HERO_ORB: OrbConfig = { ... };


UI:

Button „Copy JSON“

Button „Copy TypeScript“

Optional „Download .orb.json“



Damit kannst du später in deiner PWA stumpf copy-pasten.


---

8. Entwicklungs-Workflow

Best Practice, damit es nicht in Spaghetti endet:

1. Phase 0 – Setup

Vite + React + TS scaffolding

ESLint + Prettier einrichten

OrbConfig + Defaults definieren

Basic Layout (Viewport-Box + Sidebar) ohne Funktion



2. Phase 1 – Rendering-Prototyp

Nur Three.js + Shader, hart codierte Config

Sicherstellen:

läuft flüssig (60 FPS am Desktop)

Orb sieht nicht nach Kindermalerei aus


Zeit nehmen für Shaderqualität – das ist die eigentliche „Magie“.



3. Phase 2 – Config → Uniforms

configToUniforms.ts implementieren

setConfig im OrbEngine bauen

Mit 2–3 Configs testen (verschiedene Farben/Intensitäten)



4. Phase 3 – UI-Bindung

useOrbStore + LookPanel, MotionPanel, etc.

Slider/ColorPicker → currentConfig → Renderer

Live-Update ohne „Apply“-Button



5. Phase 4 – Presets & Export

Preset-Liste, Save/Update/Delete

localStorage-Speicherung

Export-Funktionen (Copy JSON / TS)



6. Phase 5 – Feinschliff

Basic Themen:

clamped Wertebereiche (kein „Intensity = 999“)

einfache Undo/Redo (History-Array mit max 20 Einträgen)

kleine FPS-Anzeige


minimalistische Styles, kein Tailwind-Overkill nötig



7. Phase 6 – Integration in PWA

Separat in DisaAI:

OrbConfig.ts kopieren/synchron halten

OrbRenderer-Light-Version mit gleichen Uniforms

orbPresets.ts mit exportierten Configs






---

9. Qualität und Wartbarkeit

Best Practice-Punkte, die du nicht ignorieren solltest:

Versionierung in OrbConfig
Falls du Shader später änderst, kannst du alte Presets migrieren oder ablehnen.

Schema-Validation beim Import
Kein blindes JSON.parse → UI schützen.

Trennung von Config und Rendering
Nie direkt im UI-Panel auf Three.js-Objekte zugreifen. Immer über config → OrbEngine.

Keine magischen Zahlen verstreut
Parameterbereiche zentral definieren, z. B.:

export const ORB_LIMITS = {
  rotationSpeed: { min: -2, max: 2 },
  noiseIntensity: { min: 0, max: 1 },
  // …
};



---

10. Später mögliche Erweiterungen (bewusst nach hinten schieben)

Multi-Orb-Szenen (zwei/drei Orbs gleichzeitig)

Time-Timeline (Keyframes, statt rein prozeduralem Loop)

Video-/GIF-Export per MediaRecorder

„Style-Presets“ (Eye, Plasma, Dust) mit unterschiedlichen Shader-Pfaden


Alles nett, aber erst, wenn die Basis sauber steht.


---

Wenn du willst, ist der nächste konkrete Schritt:

OrbConfig final festzurren (Felder + Limits),

daraus einen Agent-Prompt bauen („bau mir Orb Studio nach dieser Struktur“).


Code generiere ich erst, wenn du sagst: „Go, jetzt Code“. Bis dahin bleibt es „brain only“.
