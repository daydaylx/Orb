# Orb Studio - Entwicklungsplan

**Datum:** 12. Dezember 2025  
**Basis:** [ANALYSIS.md](ANALYSIS.md)

---

## 🎯 Priorisierte Feature-Liste

### Legende
- 🔴 **P0** - Kritisch (sofort)
- 🟠 **P1** - Hoch (diese Woche)
- 🟡 **P2** - Mittel (nächste 2 Wochen)
- 🟢 **P3** - Niedrig (Backlog)

| Nr | Feature | Priorität | Aufwand | Impact | Status |
|----|---------|-----------|---------|--------|--------|
| 1 | Memory Leak Fix | 🔴 P0 | 2h | Kritisch | ⭕ TODO |
| 2 | Error Boundaries | 🔴 P0 | 2h | Hoch | ⭕ TODO |
| 3 | WebGL Verfügbarkeitsprüfung | 🔴 P0 | 1h | Hoch | ⭕ TODO |
| 4 | Input-Validierung | 🟠 P1 | 3h | Mittel | ⭕ TODO |
| 5 | JSON Import + Validierung | 🟠 P1 | 4h | Hoch | ⭕ TODO |
| 6 | Undo/Redo System | 🟠 P1 | 6h | Sehr Hoch | ⭕ TODO |
| 7 | Code-Splitting | 🟠 P1 | 5h | Hoch | ⭕ TODO |
| 8 | Keyboard Shortcuts | 🟡 P2 | 4h | Mittel | ⭕ TODO |
| 9 | Canvas Screenshot | 🟡 P2 | 3h | Hoch | ⭕ TODO |
| 10 | Video/GIF Export | 🟡 P2 | 10h | Sehr Hoch | ⭕ TODO |
| 11 | Preset Browser mit Preview | 🟡 P2 | 7h | Mittel | ⭕ TODO |
| 12 | LocalStorage Limits | 🟡 P2 | 2h | Niedrig | ⭕ TODO |
| 13 | Test-Setup (Jest) | 🟡 P2 | 8h | Hoch | ⭕ TODO |
| 14 | Animation Timeline | 🟢 P3 | 20h | Sehr Hoch | ⭕ TODO |
| 15 | Multi-Orb Scene | 🟢 P3 | 10h | Mittel | ⭕ TODO |
| 16 | Texture Upload | 🟢 P3 | 7h | Mittel | ⭕ TODO |
| 17 | Accessibility (ARIA) | 🟢 P3 | 8h | Mittel | ⭕ TODO |
| 18 | Storybook Setup | 🟢 P3 | 6h | Niedrig | ⭕ TODO |
| 19 | Error Tracking (Sentry) | 🟢 P3 | 3h | Mittel | ⭕ TODO |
| 20 | Cloud Sync | 🟢 P3 | 40h+ | Hoch | ⭕ TODO |

---

## 📅 Sprint-Planung

### Sprint 1: Kritische Bugs (3-4 Tage)
**Ziel:** Stabilität & Produktionsreife

#### Tasks
- [ ] **Bug #1:** Memory Leak in OrbRenderer beheben
  - Datei: `app/src/core/OrbRenderer.tsx`
  - Engine Disposal bei Config-Changes
  - Test: Mehrfach Orb wechseln, Memory profilen
  
- [ ] **Bug #2:** Error Boundary implementieren
  - Neue Komponente: `app/src/ui/common/ErrorBoundary.tsx`
  - App.tsx wrappen
  - Fallback-UI mit Reload-Button
  
- [ ] **Bug #3:** WebGL-Verfügbarkeit prüfen
  - In `OrbEngine` constructor
  - Graceful Fallback mit Fehlermeldung
  - Test: WebGL deaktivieren, Verhalten prüfen

- [ ] **Bug #4:** FPS-Timer Cleanup
  - In `App.tsx` useEffect cleanup
  
- [ ] **Bug #5:** Input-Validierung
  - Alle Slider-Komponenten: Min/Max enforcing
  - ColorPicker: Hex-Validierung
  - Number inputs: NaN-Checks

**Deliverable:** Stabile v0.2.0 ohne kritische Bugs

---

### Sprint 2: Core Features (5-7 Tage)
**Ziel:** Wichtigste fehlende Features

#### Tasks
- [ ] **Feature #1:** Undo/Redo System
  - Zustand-Historie in Store
  - UI: Buttons in HeaderBar
  - Keyboard: Ctrl+Z / Ctrl+Y
  - Limit: 50 Historie-Einträge
  
- [ ] **Feature #2:** JSON Import
  - Neue Komponente: `ImportPanel.tsx`
  - File Picker + Drag & Drop
  - Schema-Validierung mit Zod/Yup
  - Error-Handling mit User-Feedback
  
- [ ] **Feature #3:** Code-Splitting
  - Three.js: dynamic import
  - Route-based splitting (future)
  - Vite config anpassen
  - Bundle-Size messen: Ziel <400 KB
  
- [ ] **Feature #4:** Keyboard Shortcuts
  - Hook: `useKeyboardShortcuts.ts`
  - Shortcuts:
    - `Ctrl+Z` - Undo
    - `Ctrl+Y` - Redo
    - `Ctrl+D` - Duplicate
    - `Ctrl+S` - Download
    - `Space` - Toggle Animation
  - Shortcuts-Overlay: `?` drücken

**Deliverable:** v0.3.0 mit Import, Undo/Redo, Shortcuts

---

### Sprint 3: UX Polish (5-7 Tage)
**Ziel:** Benutzererfahrung verbessern

#### Tasks
- [ ] **Feature #1:** Canvas Screenshot
  - Button in ExportPanel
  - `toDataURL()` von Canvas
  - Download als PNG
  - Copy to Clipboard
  
- [ ] **Feature #2:** Video/GIF Export
  - Library: `ccapture.js` oder `canvas-recorder`
  - UI: Start/Stop Recording
  - Format-Auswahl: WebM, GIF
  - Progress indicator
  
- [ ] **Feature #3:** Preset Browser Overhaul
  - Grid-Layout statt Liste
  - Thumbnails: Mini-Canvas-Renderer
  - Hover: Animierte Preview
  - Filter: Tags, Farbe
  
- [ ] **Feature #4:** Color Palettes
  - Vordefinierte Paletten: Material, Nord, etc.
  - Palette-Picker in LookPanel
  - Eigene Paletten speichern

**Deliverable:** v0.4.0 mit Export-Features, besserem Browser

---

### Sprint 4: Testing & Monitoring (5-7 Tage)
**Ziel:** Qualitätssicherung

#### Tasks
- [ ] **Setup:** Jest + React Testing Library
  - Config: `jest.config.js`
  - Test utils: `test-utils.tsx`
  - Mock für Three.js
  
- [ ] **Tests:** Core Logic
  - `OrbConfig.test.ts`
  - `useOrbStore.test.ts`
  - `configToUniforms.test.ts`
  
- [ ] **Tests:** UI Components
  - `Slider.test.tsx`
  - `ColorPicker.test.tsx`
  - `OrbPanel.test.tsx`
  
- [ ] **Tests:** Integration
  - Export-Flow
  - Import-Flow
  - Undo/Redo
  
- [ ] **CI/CD:** GitHub Actions
  - Test-Runner bei PR
  - Build-Check
  - Coverage-Report

**Deliverable:** v0.5.0 mit >60% Test Coverage

---

## 🛠️ Technische Implementierungsdetails

### 1. Memory Leak Fix

**Problem-Code:**
```tsx
// app/src/core/OrbRenderer.tsx
useEffect(() => {
  engineRef.current = new OrbEngine(canvasRef.current);
  return () => {
    engineRef.current?.dispose();
  };
}, []); // PROBLEM: Läuft nur einmal
```

**Fix:**
```tsx
useEffect(() => {
  if (!canvasRef.current) return;
  
  // Dispose old engine
  if (engineRef.current) {
    engineRef.current.dispose();
  }
  
  try {
    engineRef.current = new OrbEngine(canvasRef.current);
    engineRef.current.setConfig(config);
  } catch (e) {
    setError(e.message);
  }
  
  return () => {
    engineRef.current?.dispose();
    engineRef.current = null;
  };
}, [config.id]); // Re-create on orb change
```

---

### 2. Error Boundary

**Neue Datei:** `app/src/ui/common/ErrorBoundary.tsx`

```tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('React Error Boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-red-500 rounded-lg p-6 max-w-md">
            <h2 className="text-xl font-bold text-red-400 mb-3">
              Something went wrong
            </h2>
            <p className="text-gray-300 mb-4">
              {this.state.error?.message || 'Unknown error'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded"
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Integration in** `app/src/main.tsx`:
```tsx
import { ErrorBoundary } from './ui/common/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
```

---

### 3. WebGL-Verfügbarkeit prüfen

**Update:** `app/src/core/OrbEngine.ts`

```typescript
constructor(canvas: HTMLCanvasElement) {
  // Check WebGL availability
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  if (!gl) {
    throw new Error(
      'WebGL is not supported in your browser. Please enable hardware acceleration.'
    );
  }

  this.renderer = new THREE.WebGLRenderer({ 
    canvas, 
    alpha: true, 
    antialias: true,
    context: gl as WebGLRenderingContext 
  });
  
  // ... rest
}
```

---

### 4. Undo/Redo System

**Update:** `app/src/state/useOrbStore.ts`

```typescript
import { temporal } from 'zundo'; // npm install zundo

export const useOrbStore = create<OrbState>()(
  temporal(
    persist(
      (set) => ({
        // ... existing state
      }),
      { name: 'orb-studio-storage' }
    ),
    {
      limit: 50, // Max 50 undo steps
      equality: (a, b) => a.orbs === b.orbs, // Only track orb changes
    }
  )
);

// Export undo/redo hooks
export const { undo, redo, clear: clearHistory } = useOrbStore.temporal.getState();
export const useCanUndo = () => useOrbStore.temporal((state) => state.canUndo);
export const useCanRedo = () => useOrbStore.temporal((state) => state.canRedo);
```

**UI Update:** `app/src/ui/layout/HeaderBar.tsx`

```tsx
import { undo, redo, useCanUndo, useCanRedo } from '../../state/useOrbStore';

export const HeaderBar = () => {
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  return (
    <div className="flex gap-2">
      <button 
        onClick={undo} 
        disabled={!canUndo}
        className="px-3 py-1 bg-gray-700 disabled:opacity-30"
      >
        ↶ Undo
      </button>
      <button 
        onClick={redo} 
        disabled={!canRedo}
        className="px-3 py-1 bg-gray-700 disabled:opacity-30"
      >
        ↷ Redo
      </button>
    </div>
  );
};
```

---

### 5. JSON Import

**Neue Datei:** `app/src/ui/controls/ImportPanel.tsx`

```tsx
import React, { useState } from 'react';
import { useOrbStore } from '../../state/useOrbStore';
import { importOrbConfigFromJson } from '../../core/OrbConfig';

export const ImportPanel: React.FC = () => {
  const createOrb = useOrbStore((state) => state.createOrb);
  const [error, setError] = useState<string | null>(null);

  const handleImport = async (jsonString: string) => {
    try {
      const config = importOrbConfigFromJson(jsonString);
      createOrb(config);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const json = event.target?.result as string;
      handleImport(json);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const json = event.target?.result as string;
        handleImport(json);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition"
      >
        <p className="text-gray-400 mb-4">Drop JSON file here</p>
        <input
          type="file"
          accept=".json"
          onChange={handleFileSelect}
          className="hidden"
          id="file-input"
        />
        <label
          htmlFor="file-input"
          className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-500"
        >
          Choose File
        </label>
      </div>
      
      {error && (
        <div className="p-3 bg-red-900/30 border border-red-500 rounded text-red-300 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};
```

**Validierung in:** `app/src/core/OrbConfig.ts`

```typescript
import { z } from 'zod'; // npm install zod

const OrbConfigSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  version: z.literal(1),
  rendering: z.object({
    baseRadius: z.number().min(0.1).max(2),
    colors: z.object({
      inner: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
      outer: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
      // ... etc
    }),
    // ... rest
  }),
});

export function importOrbConfigFromJson(json: string): Partial<OrbConfigInternal> {
  const parsed = JSON.parse(json);
  const validated = OrbConfigSchema.parse(parsed);
  
  // Convert external to internal format
  return {
    id: validated.id || uuidv4(),
    label: validated.name,
    baseRadius: validated.rendering.baseRadius,
    // ... map all fields
  };
}
```

---

### 6. Code-Splitting

**Update:** `app/vite.config.ts`

```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three'],
          'vendor': ['react', 'react-dom', 'zustand'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
```

**Lazy Load Three.js:**

```tsx
// app/src/core/OrbRenderer.tsx
import { lazy, Suspense } from 'react';

const OrbEngine = lazy(() => import('./OrbEngine').then(m => ({ default: m.OrbEngine })));

export const OrbRenderer = ({ config }) => {
  return (
    <Suspense fallback={<div>Loading 3D Engine...</div>}>
      <OrbEngineRenderer config={config} />
    </Suspense>
  );
};
```

---

## 📊 Erfolgskriterien

### Sprint 1 (Stabilität)
- ✅ Keine Memory Leaks (Chrome DevTools Memory Profiler)
- ✅ Keine unhandled exceptions
- ✅ App läuft auf Geräten ohne WebGL (mit Fallback)
- ✅ Alle Inputs validiert

### Sprint 2 (Features)
- ✅ JSON Import funktioniert fehlerfrei
- ✅ Undo/Redo funktioniert für alle Changes
- ✅ Bundle Size < 400 KB
- ✅ Alle Shortcuts funktionieren

### Sprint 3 (UX)
- ✅ Screenshot in <1s exportiert
- ✅ Video-Export funktioniert (WebM)
- ✅ Preset-Browser lädt in <500ms
- ✅ User-Feedback positiv

### Sprint 4 (Quality)
- ✅ Test Coverage > 60%
- ✅ Alle Tests grün
- ✅ CI/CD läuft automatisch
- ✅ Keine kritischen Linting-Fehler

---

## 🚀 Release-Strategie

### v0.2.0 - Stabilität (Nach Sprint 1)
- Bugfixes
- WebGL-Prüfung
- Error Boundaries

### v0.3.0 - Core Features (Nach Sprint 2)
- JSON Import
- Undo/Redo
- Keyboard Shortcuts
- Code-Splitting

### v0.4.0 - UX Improvements (Nach Sprint 3)
- Screenshot Export
- Video Export
- Preset Browser v2
- Color Palettes

### v0.5.0 - Quality (Nach Sprint 4)
- Tests
- CI/CD
- Documentation

### v1.0.0 - Production Ready
- Alle P0-P2 Features
- >70% Test Coverage
- Vollständige Docs
- Performance optimiert

---

## 📝 Nächste Schritte

1. **Team-Review** dieser Analyse
2. **Priorisierung** der Features
3. **Sprint 1 starten** (Stabilität)
4. **Daily Standups** etablieren
5. **Wöchentliche Reviews**

---

**Erstellt von:** GitHub Copilot  
**Basis:** [ANALYSIS.md](ANALYSIS.md)  
**Status:** Ready for Review  
**Aktualisiert:** 12. Dezember 2025
