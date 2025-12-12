# Aufgabenplan - Orb Studio Fixes & Features

**Stand:** 2025-12-12
**Ziel:** Produktionsreife erreichen
**Geschätzter Gesamtaufwand:** 100 Stunden

> **Anleitung:** Kopiere den jeweiligen Prompt und füge ihn in Claude ein. Die Prompts enthalten alle notwendigen Kontextinformationen und Acceptance-Criteria.

---

## 🚨 Sprint 1: Kritische Stabilität (Woche 1) - 9h

### Aufgabe 1.1: Memory Leak in OrbRenderer fixen

**Priorität:** 🔴 P0 - Kritisch
**Aufwand:** 2h
**Dateien:** `app/src/core/OrbRenderer.tsx`, `app/src/core/OrbEngine.ts`

#### Prompt:

```
Fixe den Memory Leak in app/src/core/OrbRenderer.tsx:

Problem:
- Bei jedem Config-Update wird eine neue OrbEngine-Instanz erstellt
- Die alte Engine wird nicht korrekt disposed
- Three.js Objekte (Geometrien, Materialien, Texturen, Renderer) bleiben im Speicher
- Nach mehreren Config-Änderungen steigt die Speichernutzung massiv

Anforderungen:
1. Implementiere eine `dispose()` Methode in OrbEngine.ts, die ALLE Three.js Ressourcen freigibt:
   - Geometrien (geometry.dispose())
   - Materialien (material.dispose())
   - Texturen (texture.dispose())
   - Renderer (renderer.dispose())
   - Scene-Cleanup
   - Post-Processing-Pässe

2. Rufe `dispose()` auf der alten Engine auf, BEVOR eine neue erstellt wird

3. Verwende useRef für die Engine-Instanz statt useState, um Re-Renders zu vermeiden

4. Implementiere cleanup im useEffect return

Code-Struktur:
// OrbEngine.ts
public dispose(): void {
  // Cleanup all resources
}

// OrbRenderer.tsx
useEffect(() => {
  return () => {
    if (engineRef.current) {
      engineRef.current.dispose();
    }
  };
}, []);

Acceptance Criteria:
✅ Engine.dispose() gibt alle Three.js Ressourcen frei
✅ Alte Engine wird disposed bevor neue erstellt wird
✅ Memory-Profiling zeigt keine Speicher-Leaks mehr
✅ Keine Warnings in der Browser-Konsole
✅ Performance bleibt stabil auch nach vielen Config-Änderungen

Testing:
- Öffne Chrome DevTools -> Memory Tab
- Mache 10x Config-Updates
- Erstelle Heap-Snapshot
- Verifiziere: Keine akkumulierten Three.js Objekte
```

---

### Aufgabe 1.2: WebGL-Verfügbarkeits-Check implementieren

**Priorität:** 🔴 P0 - Kritisch
**Aufwand:** 1h
**Dateien:** `app/src/core/OrbEngine.ts`, `app/src/core/OrbRenderer.tsx`

#### Prompt:

```
Implementiere WebGL-Verfügbarkeits-Prüfung in OrbEngine:

Problem:
- App crasht auf Geräten ohne WebGL-Support
- Keine Fehlermeldung für den Nutzer
- Kein Fallback-UI

Anforderungen:
1. Erstelle Utility-Funktion `isWebGLAvailable()` die prüft:
   - WebGL-Kontext kann erstellt werden
   - WebGL ist nicht disabled
   - Mindestens WebGL 1.0 verfügbar

2. Prüfe Verfügbarkeit VOR OrbEngine-Initialisierung

3. Zeige benutzerfreundliche Fehlermeldung wenn WebGL nicht verfügbar

4. Optional: Zeige System-Informationen (Browser, OS) für Troubleshooting

Code-Struktur:
// app/src/utils/webgl.ts
export function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch (e) {
    return false;
  }
}

export function getWebGLErrorMessage(): string {
  // Return user-friendly error message
}

// app/src/core/OrbRenderer.tsx
if (!isWebGLAvailable()) {
  return <WebGLErrorFallback message={getWebGLErrorMessage()} />;
}

Acceptance Criteria:
✅ WebGL-Check vor Engine-Initialisierung
✅ Benutzerfreundliche Fehlermeldung bei fehlender WebGL-Unterstützung
✅ Fallback-UI mit Hilfe-Links (caniuse.com/webgl)
✅ Keine Crashes auf Geräten ohne WebGL
✅ Konsole zeigt detaillierte Debug-Infos

Testing:
- Deaktiviere WebGL in Chrome: chrome://settings/
- Teste in verschiedenen Browsern
- Teste auf älteren Mobile-Devices
```

---

### Aufgabe 1.3: React Error Boundaries implementieren

**Priorität:** 🔴 P0 - Kritisch
**Aufwand:** 2h
**Dateien:** `app/src/ui/common/ErrorBoundary.tsx` (neu), `app/src/App.tsx`

#### Prompt:

```
Implementiere React Error Boundaries für robuste Fehlerbehandlung:

Problem:
- Jeder Fehler in einer Komponente crasht die gesamte App
- Keine Recovery-Möglichkeit für Nutzer
- Keine Error-Logging

Anforderungen:
1. Erstelle `ErrorBoundary.tsx` Komponente mit:
   - componentDidCatch() für Error-Handling
   - Fallback-UI mit Fehlermeldung
   - Reset-Button zum Recovery
   - Optional: Error-Details (dev mode only)

2. Wrappe kritische Teile der App:
   - OrbRenderer (3D-Rendering)
   - Control-Panels (UI-Logik)
   - Gesamte App (Root-Level)

3. Implementiere Error-Logging (console.error + localStorage)

4. Zeige benutzerfreundliche Fehlermeldungen

Code-Struktur:
// app/src/ui/common/ErrorBoundary.tsx
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // Implementierung
}

// app/src/App.tsx
<ErrorBoundary>
  <Shell>
    <ErrorBoundary fallback={<RendererErrorFallback />}>
      <OrbRenderer />
    </ErrorBoundary>
    <ErrorBoundary fallback={<ControlsErrorFallback />}>
      <Controls />
    </ErrorBoundary>
  </Shell>
</ErrorBoundary>

Acceptance Criteria:
✅ Error Boundary fängt alle React-Fehler ab
✅ App crasht nicht mehr komplett bei Fehlern
✅ Fallback-UI mit hilfreichen Informationen
✅ Reset-Button erlaubt Recovery ohne Page-Reload
✅ Fehler werden geloggt (console + localStorage)
✅ Dev-Mode zeigt Error-Stack-Trace
✅ Production-Mode zeigt generische Fehlermeldung

Testing:
- Werfe absichtlichen Error in Komponente
- Verifiziere Fallback-UI wird angezeigt
- Teste Reset-Funktionalität
- Prüfe Error-Logging
```

---

### Aufgabe 1.4: JSON Import implementieren

**Priorität:** 🔴 P0 - Kritisch (Feature)
**Aufwand:** 4h
**Dateien:** `app/src/ui/controls/ExportPanel.tsx`, `app/src/core/OrbConfig.ts`

#### Prompt:

```
Implementiere JSON-Import-Funktionalität für Orb-Konfigurationen:

Problem:
- Nur Export vorhanden, kein Import
- Nutzer können gespeicherte Configs nicht zurückladen
- Nur Share-Links funktionieren

Anforderungen:
1. Füge File-Upload-Dialog zu ExportPanel hinzu
2. Implementiere JSON-Parsing und Validierung
3. Konvertiere External -> Internal Format
4. Handle Fehler (invalide JSON, falsches Schema, alte Versionen)
5. Zeige Vorschau vor Import
6. Optional: Drag & Drop für JSON-Dateien

Code-Struktur:
// app/src/ui/controls/ExportPanel.tsx
function ImportSection() {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        const validated = validateOrbConfig(json);
        const internal = fromExternalConfig(validated);
        // Import in store
      } catch (error) {
        // Show error message
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <input type="file" accept=".json" onChange={handleFileUpload} />
      {/* Preview UI */}
    </div>
  );
}

// app/src/core/OrbConfig.ts
export function validateOrbConfig(json: unknown): OrbConfigExternal {
  // Runtime-Validierung (verwende zod oder manuell)
  if (!json || typeof json !== 'object') {
    throw new Error('Invalid JSON structure');
  }
  // ... weitere Validierung
  return json as OrbConfigExternal;
}

Acceptance Criteria:
✅ File-Upload-Dialog für .json Dateien
✅ JSON wird geparst und validiert
✅ Fehlerhafte JSONs zeigen hilfreiche Fehlermeldung
✅ Alte Config-Versionen werden automatisch migriert
✅ Vorschau zeigt Config-Details vor Import
✅ Imported Config wird in aktiven Orb geladen
✅ Drag & Drop funktioniert (optional)
✅ Unterstützt multiple Configs in einer Datei (Array)

Testing:
- Exportiere Config als JSON
- Importiere die Datei wieder
- Teste mit invalidem JSON
- Teste mit alter Config-Version (V0)
- Teste mit korrupten Daten
```

---

## ⚡ Sprint 2: Core Features (Woche 2) - 12h

### Aufgabe 2.1: Undo/Redo System implementieren

**Priorität:** 🟡 P1 - Hoch
**Aufwand:** 6h
**Dateien:** `app/src/state/useOrbStore.ts`, `app/src/hooks/useKeyboard.ts` (neu)

#### Prompt:

```
Implementiere vollständiges Undo/Redo-System für Orb-Konfigurationen:

Problem:
- Keine Möglichkeit Änderungen rückgängig zu machen
- Kritisch für Editor-UX
- Keine Keyboard-Shortcuts

Anforderungen:
1. Erweitere Zustand-Store um History-Management:
   - Past-Stack für Undo
   - Future-Stack für Redo
   - Maximal 50 History-Einträge (configurable)

2. Implementiere Actions:
   - undo() - letzten State wiederherstellen
   - redo() - Undo rückgängig machen
   - pushHistory() - neuen State in History

3. Keyboard-Shortcuts:
   - Ctrl+Z / Cmd+Z für Undo
   - Ctrl+Y / Cmd+Shift+Z für Redo

4. UI-Buttons in HeaderBar

5. Zeige History-Status (can undo/redo)

Code-Struktur:
// app/src/state/useOrbStore.ts
interface OrbStoreState {
  // ... existing
  history: {
    past: OrbConfigInternal[];
    future: OrbConfigInternal[];
  };
  canUndo: () => boolean;
  canRedo: () => boolean;
  undo: () => void;
  redo: () => void;
}

export const useOrbStore = create<OrbStoreState>()(
  persist(
    (set, get) => ({
      history: { past: [], future: [] },

      updateActiveOrb: (updates) => {
        const current = get().getActiveOrb();
        if (!current) return;

        // Push to history
        set((state) => ({
          history: {
            past: [...state.history.past, current.config].slice(-50),
            future: []
          }
        }));

        // Apply update
        // ...
      },

      undo: () => {
        const { history } = get();
        if (history.past.length === 0) return;

        const previous = history.past[history.past.length - 1];
        const current = get().getActiveOrb()?.config;

        set((state) => ({
          history: {
            past: state.history.past.slice(0, -1),
            future: [current!, ...state.history.future]
          },
          orbs: state.orbs.map(o =>
            o.id === state.activeOrbId ? { ...o, config: previous } : o
          )
        }));
      },

      redo: () => {
        // Similar to undo
      },

      canUndo: () => get().history.past.length > 0,
      canRedo: () => get().history.future.length > 0,
    }),
    { name: 'orb-store' }
  )
);

// app/src/hooks/useKeyboard.ts
export function useKeyboard() {
  const { undo, redo, canUndo, canRedo } = useOrbStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo()) undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        if (canRedo()) redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, canUndo, canRedo]);
}

Acceptance Criteria:
✅ Undo/Redo funktioniert für alle Config-Änderungen
✅ History-Limit von 50 Einträgen wird eingehalten
✅ Ctrl+Z / Cmd+Z für Undo funktioniert
✅ Ctrl+Y / Cmd+Shift+Z für Redo funktioniert
✅ UI-Buttons zeigen Enabled/Disabled State
✅ History überlebt Page-Reload (localStorage)
✅ History ist pro Orb (nicht global)
✅ Keine Performance-Probleme bei großen Histories

Testing:
- Ändere Config-Werte
- Drücke Ctrl+Z mehrfach
- Drücke Ctrl+Y mehrfach
- Teste mit 100+ Änderungen
- Reload Page und verifiziere History
```

---

### Aufgabe 2.2: FPS Timer Race Condition fixen

**Priorität:** 🟡 P1 - Mittel
**Aufwand:** 1h
**Dateien:** `app/src/core/OrbRenderer.tsx`

#### Prompt:

```
Fixe Race Condition im FPS-Timer von OrbRenderer:

Problem:
- lowFpsTimer ref wird nicht korrekt aufgeräumt
- Timer läuft nach Unmount weiter
- Potentieller Memory Leak bei schnellen Re-Renders

Anforderungen:
1. Cleanup Timer in useEffect return
2. Clear Timer bei Config-Änderungen
3. Defensive Checks vor setState

Code-Struktur:
// app/src/core/OrbRenderer.tsx
const lowFpsTimer = useRef<NodeJS.Timeout | null>(null);

const checkFps = useCallback(() => {
  const currentFps = engineRef.current?.getCurrentFps() || 0;

  if (currentFps < 30) {
    // Clear existing timer
    if (lowFpsTimer.current) {
      clearTimeout(lowFpsTimer.current);
    }

    lowFpsTimer.current = setTimeout(() => {
      // Defensive check: only update if still mounted
      if (engineRef.current) {
        engineRef.current.degradeQuality();
      }
    }, 2000);
  }
}, []);

useEffect(() => {
  // Cleanup on unmount
  return () => {
    if (lowFpsTimer.current) {
      clearTimeout(lowFpsTimer.current);
      lowFpsTimer.current = null;
    }
  };
}, []);

Acceptance Criteria:
✅ Timer wird bei Unmount gestoppt
✅ Timer wird bei Config-Wechsel gestoppt
✅ Keine setState-Calls nach Unmount
✅ Keine Timer-Leaks in Memory-Profile
✅ Keine Warnings in Console

Testing:
- Schnell zwischen Orbs wechseln (10x)
- Memory-Profile prüfen
- Console auf Warnings checken
```

---

### Aufgabe 2.3: Bundle Size reduzieren

**Priorität:** 🟡 P1 - Mittel
**Aufwand:** 5h
**Dateien:** `vite.config.ts`, Komponentenstruktur

#### Prompt:

```
Reduziere Bundle-Size von 734 KB auf ~400 KB:

Problem:
- Bundle zu groß für schnelle Ladezeiten
- Three.js Examples komplett gebundled
- Kein Code-Splitting
- Keine Lazy-Loading

Anforderungen:
1. Konfiguriere Vite für Optimierung:
   - Manual Chunks für Three.js
   - Tree-Shaking für unused Exports
   - Minification + Compression

2. Implementiere Code-Splitting:
   - Lazy-Load Preset-Bibliothek
   - Lazy-Load Export-Panel
   - Lazy-Load Post-Processing-Shader

3. Dynamische Imports für große Dependencies

4. Analyse Bundle mit Rollup-Plugin-Visualizer

Code-Struktur:
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'three-core': ['three'],
          'three-postprocessing': [
            'three/examples/jsm/postprocessing/EffectComposer',
            'three/examples/jsm/postprocessing/RenderPass',
            'three/examples/jsm/postprocessing/UnrealBloomPass',
          ],
          'react-vendor': ['react', 'react-dom'],
          'state': ['zustand'],
        },
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});

// app/src/ui/controls/PresetPanel.tsx
const PresetLibrary = lazy(() => import('./PresetLibrary'));

function PresetPanel() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PresetLibrary />
    </Suspense>
  );
}

Acceptance Criteria:
✅ Bundle-Size < 450 KB (Gzip)
✅ Initial Load < 200 KB
✅ Three.js in separatem Chunk
✅ Lazy-Loading für Presets funktioniert
✅ Build-Analyse zeigt Chunk-Sizes
✅ Keine Tree-Shaking-Probleme
✅ Production-Build funktioniert einwandfrei

Testing:
- npm run build
- Prüfe dist/ Ordner Sizes
- Teste in Production-Mode
- Lighthouse-Score > 90
```

---

## 🔧 Sprint 3: Code Quality (Woche 3-4) - 25h

### Aufgabe 3.1: Input-Validierung mit Zod

**Priorität:** 🟠 P2 - Mittel
**Aufwand:** 4h
**Dateien:** Alle Control-Komponenten, `app/src/core/OrbConfig.ts`

#### Prompt:

```
Implementiere Runtime-Validierung für alle Inputs mit Zod:

Problem:
- Keine Validierung von Slider-Werten
- Hex-Colors nicht validiert
- Config kann invalide Werte enthalten

Anforderungen:
1. Installiere Zod: `npm install zod`

2. Definiere Zod-Schemas für OrbConfig

3. Validiere Inputs in Control-Komponenten

4. Zeige Validierungs-Fehler im UI

5. Verhindere Speichern invalider Configs

Code-Struktur:
// app/src/core/OrbConfig.schema.ts
import { z } from 'zod';

export const OrbConfigSchema = z.object({
  version: z.literal('1'),
  look: z.object({
    colorInner: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    colorOuter: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    gradientBias: z.number().min(0).max(1),
    glowIntensity: z.number().min(0).max(2),
    // ... alle Felder
  }),
  motion: z.object({
    rotationSpeed: z.tuple([
      z.number().min(-5).max(5),
      z.number().min(-5).max(5)
    ]),
    // ...
  }),
  // ...
});

export type OrbConfigValidated = z.infer<typeof OrbConfigSchema>;

// app/src/ui/common/Slider.tsx
interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  validation?: z.ZodNumber;
}

function Slider({ value, onChange, validation }: SliderProps) {
  const [error, setError] = useState<string | null>(null);

  const handleChange = (newValue: number) => {
    if (validation) {
      const result = validation.safeParse(newValue);
      if (!result.success) {
        setError(result.error.errors[0].message);
        return;
      }
    }
    setError(null);
    onChange(newValue);
  };

  return (
    <div>
      <input type="range" value={value} onChange={e => handleChange(Number(e.target.value))} />
      {error && <span className="text-red-500">{error}</span>}
    </div>
  );
}

Acceptance Criteria:
✅ Alle Config-Felder haben Zod-Schema
✅ Slider zeigen Fehler bei invaliden Werten
✅ ColorPicker validiert Hex-Codes
✅ Import validiert JSON vor Akzeptierung
✅ Store speichert nur validierte Configs
✅ Hilfreiche Fehlermeldungen
✅ Type-Safety durch Zod-Inference

Testing:
- Versuche invaliden Hex-Code einzugeben
- Setze Slider außerhalb Range
- Importiere invalide JSON
- Prüfe Type-Safety in IDE
```

---

### Aufgabe 3.2: LookPanel aufteilen

**Priorität:** 🟠 P2 - Niedrig
**Aufwand:** 3h
**Dateien:** `app/src/ui/controls/LookPanel.tsx` -> mehrere Sub-Komponenten

#### Prompt:

```
Teile LookPanel (310 Zeilen) in kleinere Sub-Komponenten auf:

Problem:
- LookPanel ist zu groß (310 Zeilen)
- Zu viele Verantwortlichkeiten
- Schwierige Wartbarkeit

Anforderungen:
1. Extrahiere Sub-Komponenten:
   - ColorControls.tsx - Inner/Outer/Accent/BG Colors
   - GradientControls.tsx - Gradient Bias
   - GlowControls.tsx - Intensity/Threshold/Radius
   - ColorHarmonies.tsx - Harmonies + Randomizer

2. Shared Props via Interface

3. Behalte State in LookPanel (props drilling)

Code-Struktur:
// app/src/ui/controls/look/ColorControls.tsx
interface ColorControlsProps {
  colorInner: string;
  colorOuter: string;
  colorAccent: string;
  backgroundColor: string;
  onChange: (field: string, value: string) => void;
}

export function ColorControls({ colorInner, colorOuter, onChange }: ColorControlsProps) {
  return (
    <div className="space-y-4">
      <ColorPicker
        label="Inner Color"
        value={colorInner}
        onChange={(c) => onChange('colorInner', c)}
      />
      {/* ... */}
    </div>
  );
}

// app/src/ui/controls/LookPanel.tsx
export function LookPanel() {
  const { updateActiveOrb, getActiveOrb } = useOrbStore();
  const orb = getActiveOrb();

  if (!orb) return null;

  const handleUpdate = (field: string, value: any) => {
    updateActiveOrb({ look: { ...orb.config.look, [field]: value } });
  };

  return (
    <div>
      <ColorControls
        colorInner={orb.config.look.colorInner}
        colorOuter={orb.config.look.colorOuter}
        onChange={handleUpdate}
      />
      <GradientControls {...} />
      <GlowControls {...} />
      <ColorHarmonies {...} />
    </div>
  );
}

Acceptance Criteria:
✅ LookPanel < 100 Zeilen
✅ 4 neue Sub-Komponenten erstellt
✅ Props korrekt typisiert
✅ Keine Funktionalitäts-Regression
✅ State-Management unverändert
✅ Styling konsistent

Testing:
- Alle Controls funktionieren wie vorher
- Keine Console-Errors
- Props-Typen korrekt
```

---

### Aufgabe 3.3: LocalStorage-Quota-Management

**Priorität:** 🟠 P2 - Mittel
**Aufwand:** 2h
**Dateien:** `app/src/state/useOrbStore.ts`, `app/src/utils/storage.ts` (neu)

#### Prompt:

```
Implementiere LocalStorage-Quota-Management und Cleanup:

Problem:
- Keine Begrenzung gespeicherter Orbs
- Kein Cleanup alter States
- QuotaExceededError möglich

Anforderungen:
1. Prüfe verfügbaren LocalStorage-Space

2. Limitiere auf max 100 Orbs

3. Auto-Cleanup bei Quota-Problemen

4. Kompression mit LZ-String (optional)

5. Warning-UI bei nahem Quota-Limit

Code-Struktur:
// app/src/utils/storage.ts
export function getStorageQuota(): { used: number; total: number } {
  try {
    const total = 5 * 1024 * 1024; // ~5MB
    let used = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length + key.length;
      }
    }
    return { used, total };
  } catch {
    return { used: 0, total: 0 };
  }
}

export function isQuotaNearLimit(): boolean {
  const { used, total } = getStorageQuota();
  return used / total > 0.8; // 80% verwendet
}

// app/src/state/useOrbStore.ts
const MAX_ORBS = 100;

export const useOrbStore = create<OrbStoreState>()(
  persist(
    (set, get) => ({
      createOrb: (config) => {
        const orbs = get().orbs;

        if (orbs.length >= MAX_ORBS) {
          console.warn('Max orb limit reached. Removing oldest orb.');
          set({ orbs: orbs.slice(1) }); // Remove oldest
        }

        try {
          const newOrb = { id: uuid(), config };
          set({ orbs: [...get().orbs, newOrb] });
        } catch (error) {
          if (error instanceof DOMException && error.name === 'QuotaExceededError') {
            // Emergency cleanup
            const essential = get().orbs.slice(-10); // Keep last 10
            set({ orbs: essential });
            alert('Storage quota exceeded. Old orbs were removed.');
          }
        }
      },
    }),
    {
      name: 'orb-store',
      onRehydrateStorage: () => (state) => {
        if (state && isQuotaNearLimit()) {
          console.warn('Storage quota near limit');
          // Show warning toast
        }
      }
    }
  )
);

Acceptance Criteria:
✅ Max 100 Orbs Limit
✅ Auto-Cleanup bei Quota-Problemen
✅ Warning bei 80% Quota-Nutzung
✅ Graceful Error-Handling
✅ Keine Datenverluste
✅ Performance OK auch bei 100 Orbs

Testing:
- Erstelle 150 Orbs
- Verifiziere max 100 bleiben
- Teste QuotaExceededError-Handling
- Prüfe Warning-UI
```

---

### Aufgabe 3.4: Shader-Compilation-Caching

**Priorität:** 🟠 P2 - Mittel
**Aufwand:** 4h
**Dateien:** `app/src/core/OrbEngine.ts`

#### Prompt:

```
Optimiere Shader-Compilation mit Material-Caching:

Problem:
- Material wird bei jedem Config-Update neu kompiliert
- Shader-Code ändert sich nie, nur Uniforms
- Unnötige Performance-Kosten

Anforderungen:
1. Erstelle Material nur einmal

2. Update nur Uniforms bei Config-Änderung

3. Recompile nur bei Quality-Änderung

4. Cache Shader-Programme

Code-Struktur:
// app/src/core/OrbEngine.ts
export class OrbEngine {
  private cachedMaterial: THREE.ShaderMaterial | null = null;
  private currentQuality: 'high' | 'medium' | 'low' = 'high';

  private createMaterial(): THREE.ShaderMaterial {
    if (this.cachedMaterial) {
      return this.cachedMaterial;
    }

    this.cachedMaterial = new THREE.ShaderMaterial({
      vertexShader: orbVertexShader,
      fragmentShader: orbFragmentShader,
      uniforms: this.createUniforms(),
      transparent: true,
      side: THREE.DoubleSide,
    });

    return this.cachedMaterial;
  }

  public updateConfig(config: OrbConfigInternal): void {
    if (!this.orbMesh) return;

    // Update nur Uniforms, kein Material-Recompile
    const uniforms = configToUniforms(config);
    Object.keys(uniforms).forEach(key => {
      if (this.orbMesh!.material.uniforms[key]) {
        this.orbMesh!.material.uniforms[key].value = uniforms[key];
      }
    });

    this.orbMesh.material.needsUpdate = false; // Kein Recompile
  }

  public setQuality(quality: 'high' | 'medium' | 'low'): void {
    if (quality === this.currentQuality) return;

    this.currentQuality = quality;

    // Nur bei Quality-Änderung Recompile
    this.cachedMaterial?.dispose();
    this.cachedMaterial = null;
    this.orbMesh.material = this.createMaterial();
  }

  public dispose(): void {
    this.cachedMaterial?.dispose();
    this.cachedMaterial = null;
  }
}

Acceptance Criteria:
✅ Material wird nur einmal kompiliert
✅ Config-Updates ändern nur Uniforms
✅ Recompile nur bei Quality-Änderung
✅ Performance-Verbesserung messbar
✅ Keine visuellen Regressionen
✅ Memory-Usage stabil

Testing:
- Ändere Config 100x schnell
- Prüfe DevTools: Shader-Compilations
- Messe Frame-Time vorher/nachher
- Verifiziere visuelle Korrektheit
```

---

### Aufgabe 3.5: Performance-Monitoring-Dashboard

**Priorität:** 🟠 P2 - Niedrig
**Aufwand:** 6h
**Dateien:** `app/src/ui/layout/PerformancePanel.tsx` (neu), `app/src/utils/metrics.ts` (neu)

#### Prompt:

```
Implementiere Performance-Monitoring-Dashboard:

Problem:
- FPS-Tracking existiert, aber keine Metriken-Export
- Keine historischen Performance-Daten
- Kein Debugging-Tool

Anforderungen:
1. Erweitere FPS-Tracking um:
   - Frame-Time
   - Memory-Usage
   - Draw-Calls
   - Triangles/Frame

2. Erstelle Performance-Panel mit Charts

3. Export als JSON/CSV

4. Optional: Web Vitals Integration

Code-Struktur:
// app/src/utils/metrics.ts
export interface PerformanceMetrics {
  timestamp: number;
  fps: number;
  frameTime: number;
  memoryUsed: number;
  drawCalls: number;
  triangles: number;
}

export class MetricsCollector {
  private history: PerformanceMetrics[] = [];
  private maxHistory = 300; // 5min bei 60fps

  public collect(renderer: THREE.WebGLRenderer, scene: THREE.Scene): void {
    const metrics: PerformanceMetrics = {
      timestamp: Date.now(),
      fps: this.calculateFPS(),
      frameTime: this.getFrameTime(),
      memoryUsed: (performance as any).memory?.usedJSHeapSize || 0,
      drawCalls: renderer.info.render.calls,
      triangles: renderer.info.render.triangles,
    };

    this.history.push(metrics);
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
  }

  public export(): PerformanceMetrics[] {
    return [...this.history];
  }

  public getAverages(): { avgFps: number; avgFrameTime: number } {
    // Calculate averages
  }
}

// app/src/ui/layout/PerformancePanel.tsx
export function PerformancePanel() {
  const metrics = usePerformanceMetrics();

  return (
    <div className="performance-panel">
      <h3>Performance Metrics</h3>

      <div className="charts">
        <LineChart data={metrics} dataKey="fps" title="FPS" />
        <LineChart data={metrics} dataKey="frameTime" title="Frame Time (ms)" />
        <LineChart data={metrics} dataKey="memoryUsed" title="Memory (MB)" />
      </div>

      <div className="stats">
        <StatCard label="Avg FPS" value={calculateAvg(metrics, 'fps')} />
        <StatCard label="Draw Calls" value={metrics[metrics.length - 1]?.drawCalls} />
      </div>

      <div className="actions">
        <button onClick={() => exportMetrics(metrics, 'json')}>Export JSON</button>
        <button onClick={() => exportMetrics(metrics, 'csv')}>Export CSV</button>
      </div>
    </div>
  );
}

Acceptance Criteria:
✅ FPS, Frame-Time, Memory werden getracked
✅ Historische Daten in Charts visualisiert
✅ Export als JSON und CSV funktioniert
✅ Panel kann ein-/ausgeblendet werden
✅ Minimal Performance-Impact
✅ Max 5min History (auto-cleanup)

Testing:
- Öffne Performance-Panel
- Lasse 5min laufen
- Exportiere Daten
- Verifiziere CSV-Format
- Prüfe Memory-Overhead < 10MB
```

---

## 🎨 Sprint 4: Nice-to-Haves (Monat 2+) - 54h

### Aufgabe 4.1: Comprehensive Test Suite

**Priorität:** 🔵 P3 - Mittel (langfristig kritisch)
**Aufwand:** 20h
**Dateien:** Setup + Tests für alle Komponenten

#### Prompt:

```
Implementiere umfassende Test-Suite mit Vitest + React Testing Library:

Problem:
- 0% Test-Coverage
- Keine Regression-Sicherheit
- Fehleranfällige Entwicklung

Anforderungen:
1. Setup Vitest + React Testing Library

2. Unit Tests für:
   - OrbConfig Conversion
   - Zustand Stores
   - Utility Functions

3. Component Tests für:
   - Controls (Slider, ColorPicker)
   - Panels (LookPanel, MotionPanel)
   - OrbRenderer

4. Integration Tests für:
   - Undo/Redo Flow
   - Import/Export Flow

5. Target: 80% Coverage

Code-Struktur:
// package.json
{
  "devDependencies": {
    "vitest": "^2.0.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.5.0",
    "@vitest/ui": "^2.0.0"
  },
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}

// app/src/core/__tests__/OrbConfig.test.ts
import { describe, it, expect } from 'vitest';
import { toExternalConfig, fromExternalConfig } from '../OrbConfig';

describe('OrbConfig', () => {
  it('converts internal to external format', () => {
    const internal = { /* ... */ };
    const external = toExternalConfig(internal);
    expect(external.version).toBe('1');
  });

  it('converts external to internal format', () => {
    const external = { version: '1', /* ... */ };
    const internal = fromExternalConfig(external);
    expect(internal.look.colorInner).toBeDefined();
  });
});

// app/src/ui/common/__tests__/Slider.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Slider } from '../Slider';

describe('Slider', () => {
  it('renders with correct value', () => {
    render(<Slider value={50} onChange={() => {}} min={0} max={100} />);
    expect(screen.getByRole('slider')).toHaveValue('50');
  });

  it('calls onChange when value changes', async () => {
    const onChange = vi.fn();
    render(<Slider value={50} onChange={onChange} min={0} max={100} />);

    await userEvent.type(screen.getByRole('slider'), '75');
    expect(onChange).toHaveBeenCalled();
  });
});

Acceptance Criteria:
✅ Vitest konfiguriert und läuft
✅ 80% Code-Coverage erreicht
✅ Unit Tests für Core-Logic
✅ Component Tests für UI
✅ Integration Tests für Flows
✅ CI läuft Tests automatisch
✅ Test-Reports generiert

Estimated Breakdown:
- Setup (2h)
- Core Tests (4h)
- Component Tests (8h)
- Integration Tests (4h)
- CI Integration (2h)
```

---

### Aufgabe 4.2: Keyboard Shortcuts

**Priorität:** 🔵 P3 - Mittel
**Aufwand:** 3h
**Dateien:** `app/src/hooks/useKeyboard.ts`, `app/src/ui/layout/ShortcutsHelp.tsx` (neu)

#### Prompt:

```
Implementiere umfassende Keyboard-Shortcuts:

Anforderungen:
1. Shortcuts für alle häufigen Aktionen
2. Help-Overlay mit Shortcuts-Liste
3. Configurierbare Shortcuts (optional)

Shortcuts:
- Ctrl+Z / Cmd+Z: Undo
- Ctrl+Y / Cmd+Shift+Z: Redo
- Ctrl+D / Cmd+D: Duplicate Orb
- Ctrl+S / Cmd+S: Export JSON
- Ctrl+N / Cmd+N: New Orb
- Delete: Delete Active Orb
- Space: Toggle Playback
- Ctrl+/: Show Shortcuts-Help
- Arrow Keys: Navigate Orbs

Code-Struktur:
// app/src/hooks/useKeyboard.ts
export function useKeyboard() {
  const store = useOrbStore();
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMod = e.ctrlKey || e.metaKey;

      // Undo
      if (isMod && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (store.canUndo()) store.undo();
      }

      // Redo
      if (isMod && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        if (store.canRedo()) store.redo();
      }

      // Duplicate
      if (isMod && e.key === 'd') {
        e.preventDefault();
        store.duplicateActiveOrb();
      }

      // Help
      if (isMod && e.key === '/') {
        e.preventDefault();
        setShowHelp(prev => !prev);
      }

      // ... weitere Shortcuts
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [store]);

  return { showHelp, setShowHelp };
}

// app/src/ui/layout/ShortcutsHelp.tsx
export function ShortcutsHelp({ show, onClose }: ShortcutsHelpProps) {
  if (!show) return null;

  const shortcuts = [
    { key: 'Ctrl+Z', action: 'Undo' },
    { key: 'Ctrl+Y', action: 'Redo' },
    { key: 'Ctrl+D', action: 'Duplicate Orb' },
    // ...
  ];

  return (
    <div className="shortcuts-overlay">
      <h2>Keyboard Shortcuts</h2>
      <table>
        {shortcuts.map(({ key, action }) => (
          <tr key={key}>
            <td><kbd>{key}</kbd></td>
            <td>{action}</td>
          </tr>
        ))}
      </table>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

Acceptance Criteria:
✅ Alle Shortcuts funktionieren
✅ Help-Overlay zeigt alle Shortcuts
✅ Ctrl+/ öffnet/schließt Help
✅ Shortcuts auf Mac (Cmd) + Windows (Ctrl)
✅ Keine Konflikte mit Browser-Shortcuts
✅ Visual Feedback bei Shortcut-Nutzung
```

---

### Aufgabe 4.3: JSDoc-Dokumentation

**Priorität:** 🔵 P3 - Niedrig
**Aufwand:** 8h
**Dateien:** Alle TypeScript-Dateien

#### Prompt:

```
Füge JSDoc-Kommentare zu allen Public APIs hinzu:

Anforderungen:
1. JSDoc für alle exportierten Funktionen
2. JSDoc für alle Component-Props
3. Beispiele in Kommentaren
4. Generiere Docs mit TypeDoc (optional)

Code-Struktur:
// app/src/core/OrbEngine.ts
/**
 * Main Three.js rendering engine for Orb visualization.
 *
 * Manages scene, camera, renderer, and post-processing pipeline.
 * Supports quality degradation for low-FPS scenarios.
 *
 * @example
 * ```typescript
 * const engine = new OrbEngine(canvas, config);
 * engine.start();
 *
 * // Update config
 * engine.updateConfig(newConfig);
 *
 * // Cleanup
 * engine.dispose();
 * ```
 */
export class OrbEngine {
  /**
   * Creates a new OrbEngine instance.
   *
   * @param canvas - HTML canvas element for rendering
   * @param config - Initial Orb configuration
   * @throws {Error} If WebGL is not available
   */
  constructor(canvas: HTMLCanvasElement, config: OrbConfigInternal) {
    // ...
  }

  /**
   * Updates the Orb configuration and re-renders.
   *
   * Only updates uniforms, does not recompile shaders.
   *
   * @param config - New configuration
   */
  public updateConfig(config: OrbConfigInternal): void {
    // ...
  }
}

// app/src/ui/common/Slider.tsx
/**
 * Props for the Slider component.
 */
export interface SliderProps {
  /** Current value */
  value: number;
  /** Callback when value changes */
  onChange: (value: number) => void;
  /** Minimum value */
  min: number;
  /** Maximum value */
  max: number;
  /** Step size (default: 0.01) */
  step?: number;
  /** Optional label */
  label?: string;
}

/**
 * Range slider input component with label.
 *
 * @example
 * ```tsx
 * <Slider
 *   label="Intensity"
 *   value={0.5}
 *   min={0}
 *   max={1}
 *   onChange={(v) => console.log(v)}
 * />
 * ```
 */
export function Slider({ value, onChange, min, max, label }: SliderProps) {
  // ...
}

Acceptance Criteria:
✅ Alle Public APIs dokumentiert
✅ Component Props dokumentiert
✅ Beispiele in komplexen Funktionen
✅ IDE zeigt Docs beim Hovern
✅ Optional: TypeDoc generiert HTML-Docs
```

---

## 📊 Zusammenfassung & Tracking

### Sprint-Übersicht

| Sprint | Fokus | Aufgaben | Aufwand | Priorität |
|--------|-------|----------|---------|-----------|
| **Sprint 1** | Kritische Stabilität | 4 | 9h | P0 |
| **Sprint 2** | Core Features | 3 | 12h | P1 |
| **Sprint 3** | Code Quality | 5 | 25h | P2 |
| **Sprint 4** | Nice-to-Haves | 3 | 54h | P3 |
| **Gesamt** | - | **15** | **100h** | - |

### Fortschritts-Tracking

Markiere erledigte Aufgaben:

- [ ] 1.1 Memory Leak fixen (2h)
- [ ] 1.2 WebGL-Check (1h)
- [ ] 1.3 Error Boundaries (2h)
- [ ] 1.4 JSON Import (4h)
- [ ] 2.1 Undo/Redo (6h)
- [ ] 2.2 FPS Timer Fix (1h)
- [ ] 2.3 Bundle Size (5h)
- [ ] 3.1 Input Validation (4h)
- [ ] 3.2 LookPanel Split (3h)
- [ ] 3.3 Storage Quota (2h)
- [ ] 3.4 Shader Caching (4h)
- [ ] 3.5 Performance Dashboard (6h)
- [ ] 4.1 Test Suite (20h)
- [ ] 4.2 Keyboard Shortcuts (3h)
- [ ] 4.3 JSDoc Docs (8h)

### Nächste Schritte

1. **Start mit Sprint 1** - Kritische Bugs beheben
2. **Teste nach jedem Fix** - Keine Regressionen
3. **Commit nach Aufgabe** - Kleine, fokussierte Commits
4. **Update dieses Dokument** - Tracking aktualisieren

---

**Pro-Tipp:** Kopiere den jeweiligen Prompt-Block in Claude und starte mit Sprint 1, Aufgabe 1.1! 🚀
