# Integration Guide: Orb Config

Dieses Dokument skizziert, wie externe Projekte (z. B. Disa) die von Orb-Studio erzeugten Konfigurationen laden und nutzen können.

## 1. Grundprinzip

**Orb-Studio** ist ein reines Autorentool. Es erzeugt keine React-Komponenten für andere Projekte, sondern reine **Daten** (`OrbConfigExternalV1` JSON).

*   **Producer:** Orb-Studio (erstellt JSON).
*   **Consumer:** Externe App (lädt JSON, rendert visuelle Darstellung).

Die externe App ist dafür verantwortlich, einen Renderer zu implementieren, der die Parameter (Farben, Noise, Glow) visuell ähnlich umsetzt. Da es sich um Shader-Effekte handelt, ist eine 1:1 Pixel-Gleichheit oft nicht notwendig, solange der "Charakter" der Orb erhalten bleibt.

## 2. Generisches Integrations-Beispiel (Pseudo-Code)

Hier ist ein Beispiel, wie ein Consumer die Daten verarbeiten könnte. Angenommen, der Consumer nutzt ebenfalls Three.js.

### Schritt A: Config laden

```typescript
// Typ-Definition (kann aus der Spec kopiert oder generiert werden)
interface OrbConfigExternalV1 {
  version: 1;
  rendering: {
    baseRadius: number;
    colors: { inner: string; outer: string; /* ... */ };
    // ...
  };
}

async function loadOrbConfig(url: string): Promise<OrbConfigExternalV1> {
  const response = await fetch(url);
  const data = await response.json();

  if (data.version !== 1) {
    console.warn("Unknown config version, rendering might be incorrect.");
  }

  return data;
}
```

### Schritt B: Mapping auf eigenen Shader

Der Consumer hat vermutlich seinen eigenen Shader, der vielleicht anders heißt, aber ähnliche Uniforms erwartet.

```typescript
function mapConfigToMyShaderUniforms(config: OrbConfigExternalV1) {
  const { rendering } = config;

  return {
    u_radius: rendering.baseRadius,
    u_innerColor: new THREE.Color(rendering.colors.inner),
    u_outerColor: new THREE.Color(rendering.colors.outer),

    // Noise mapping
    u_distortionStrength: rendering.noise?.intensity ?? 0.5,
    u_distortionScale: rendering.noise?.scale ?? 1.0,

    // Glow mapping
    u_rimPower: 4.0 * (1.0 - (rendering.glow?.radius ?? 0.5)),
    u_rimColor: new THREE.Color(rendering.colors.accent),
  };
}
```

### Schritt C: React-Komponente (Beispiel)

```tsx
function MyOrbRenderer({ configUrl }: { configUrl: string }) {
  const [uniforms, setUniforms] = useState(null);

  useEffect(() => {
    loadOrbConfig(configUrl).then(config => {
      setUniforms(mapConfigToMyShaderUniforms(config));
    });
  }, [configUrl]);

  if (!uniforms) return <mesh>...</mesh>; // Placeholder

  return (
    <mesh>
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={MY_VERTEX_SHADER}
        fragmentShader={MY_FRAGMENT_SHADER}
      />
    </mesh>
  );
}
```

## 3. Versionierung

Das Feld `version: 1` im JSON dient der Zukunftssicherheit.

*   **Version 1 (aktuell):** Basis-Set an Parametern (Farben, Noise, Glow, Details).
*   **Version 2 (hypothetisch):** Könnte z. B. Textur-Support oder Post-Processing-Settings hinzufügen.

**Empfehlung für Consumer:**
Prüfe beim Laden `config.version`.
*   Ist die Version bekannt? -> Alles gut.
*   Ist die Version höher als bekannt? -> Warnung loggen, aber versuchen zu rendern (ignoriere neue Felder).
*   Ist die Version niedriger? -> Ggf. Migrations-Logik anwenden (oder einfach rendern, da meist abwärtskompatibel).
