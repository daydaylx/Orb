# Orb Integration Guide

Dieses Dokument beschreibt, wie du die mit **Orb Studio** erstellten JSON-Konfigurationen in deine eigene Anwendung (z. B. eine Website, Disa, oder ein Spiel) integrierst.

## Konzept

*   **Orb Studio** ist das **Autorenwerkzeug**. Hier erstellst du visuell Orbs und exportierst sie als reine Daten (`.json`).
*   **Deine App** ist der **Konsument**. Sie lädt diese Daten und nutzt sie, um den Orb zu rendern. Deine App benötigt **keinen** Code aus Orb Studio, nur eine kompatible Rendering-Logik (Shader).

## Workflow

1.  **Design**: Erstelle deinen Orb in Orb Studio.
2.  **Export**: Klicke auf "Export" -> "Download JSON" (oder Copy).
3.  **Import**: Speichere die JSON-Datei in deinem Projekt (z. B. `assets/orbs/my-orb.json`).
4.  **Load**: Lade die JSON-Datei zur Laufzeit und füttere damit deinen Shader.

## Implementierung (Three.js Beispiel)

Du benötigst einen Shader, der die Parameter aus der Config versteht. Die Struktur der `OrbConfigExternalV1` ist so gewählt, dass sie sich leicht auf Uniforms abbilden lässt.

### 1. Uniform-Mapping

Hier ist ein generisches Beispiel, wie du eine Config in Three.js Uniforms umwandelst:

```typescript
import * as THREE from 'three';

// Typ-Definition (kann aus docs/spec/orb-config-spec.md abgeleitet werden)
interface OrbConfig {
  rendering: {
    baseRadius: number;
    colors: { inner: string; outer: string; /* ... */ };
    noise: { scale: number; intensity: number; /* ... */ };
    // ...
  };
}

export function createUniformsFromConfig(config: OrbConfig) {
  const r = config.rendering;
  
  return {
    u_baseRadius: { value: r.baseRadius },
    
    // Farben (Three.js Color Konvertierung)
    u_colorInner: { value: new THREE.Color(r.colors.inner) },
    u_colorOuter: { value: new THREE.Color(r.colors.outer) },
    u_gradientBias: { value: r.colors.gradientBias },
    
    // Noise
    u_noiseScale: { value: r.noise?.scale ?? 1.0 }, // Fallbacks nutzen!
    u_noiseIntensity: { value: r.noise?.intensity ?? 0.0 },
    
    // ... weitere Mappings für Glow, Details etc.
    
    // Laufzeit-Uniforms (müssen im Loop aktualisiert werden)
    u_time: { value: 0 },
  };
}
```

### 2. Shader

Dein Fragment-Shader sollte die entsprechenden Uniforms erwarten. Ein minimales Beispiel:

```glsl
uniform vec3 u_colorInner;
uniform vec3 u_colorOuter;
uniform float u_gradientBias;
uniform float u_noiseIntensity;
// ...

void main() {
  // Deine Shader-Logik hier, die diese Werte nutzt.
  // Sie muss NICHT 1:1 identisch mit Orb Studio sein,
  // solange sie die Parameter sinnvoll interpretiert.
}
```

## React Integration (Skizze)

Wenn du React verwendest, kannst du eine simple `OrbViewer`-Komponente bauen:

```tsx
import { useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import myOrbConfig from './assets/my-orb.json';

function OrbMesh({ config }) {
  const uniforms = useMemo(() => createUniformsFromConfig(config), [config]);
  
  // Update u_time im Loop (useFrame)
  // ...

  return (
    <mesh>
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial 
        uniforms={uniforms} 
        vertexShader={...} 
        fragmentShader={...} 
      />
    </mesh>
  );
}

export function App() {
  return (
    <Canvas>
      <OrbMesh config={myOrbConfig} />
    </Canvas>
  );
}
```

## Versionierung

Die Config hat ein Feld `version: 1`.
*   **Version 1**: Basis-Implementierung (Farben, Noise, Glow).
*   Sollte es in Zukunft `version: 2` geben (z. B. für volumetrisches Rendering), sollte dein Import-Code die Version prüfen und ggf. Warnungen ausgeben oder Defaults anpassen.

## Best Practices

*   **Loose Coupling**: Importiere keine Typen direkt aus dem `orb-studio`-Repo, wenn es sich vermeiden lässt. Kopiere lieber die `OrbConfig`-Definition oder nutze `any` beim Laden, validiere aber zur Laufzeit (z. B. mit Zod).
*   **Performance**: Orb Studio nutzt High-Res Geometrie und komplexe Shader. Für mobile Games oder Hintergründe kannst du die Geometrie reduzieren oder Shader vereinfachen, während du trotzdem dieselben Farb-/Noise-Parameter nutzt.
