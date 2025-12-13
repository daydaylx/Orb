# 🚨 Kritische Probleme - Behebungsplan

**Erstellt:** 2025-12-13
**Status:** Bereit zur Umsetzung
**Gesamtaufwand:** ~83 Stunden

---

## Phase 1: SOFORT - Projekt wieder funktionsfähig machen (2h)

### ✅ Sprint 1.1: Dependencies installieren (30min)
**Ziel:** Build und Dev-Server funktionieren

```bash
# Root dependencies
npm install

# Verify installation
npm run build
npm run lint
```

**Erwartetes Ergebnis:**
- ✅ node_modules existiert
- ✅ Build läuft ohne TypeScript-Fehler
- ✅ ESLint läuft ohne Module-Fehler

**Verifizierung:**
```bash
npm run ci  # Sollte erfolgreich durchlaufen
```

---

### ✅ Sprint 1.2: TypeScript-Konfiguration überprüfen (30min)
**Datei:** `app/tsconfig.app.json`

**Problem:**
- Type definitions für 'vite/client' und 'node' nicht gefunden
- Trotz korrekter Installation in package.json

**Mögliche Fixes:**
1. Überprüfe `types` Array in tsconfig
2. Stelle sicher dass `@types/node` korrekt installiert ist
3. Prüfe `include` Pfade

**Test:**
```bash
cd app && npx tsc --noEmit
```

---

### ✅ Sprint 1.3: Test-Infrastruktur aufsetzen (1h)
**Datei:** `app/package.json`

**Tasks:**
1. Vitest installieren
   ```bash
   npm install --save-dev vitest @vitest/ui @testing-library/react @testing-library/jest-dom jsdom
   ```

2. Test-Script hinzufügen
   ```json
   "scripts": {
     "test": "vitest",
     "test:ui": "vitest --ui",
     "test:coverage": "vitest --coverage"
   }
   ```

3. Vitest-Config erstellen (`app/vitest.config.ts`)
   ```typescript
   import { defineConfig } from 'vitest/config'
   import react from '@vitejs/plugin-react'

   export default defineConfig({
     plugins: [react()],
     test: {
       environment: 'jsdom',
       globals: true,
       setupFiles: './src/test/setup.ts',
     },
   })
   ```

4. Setup-Datei erstellen (`app/src/test/setup.ts`)
   ```typescript
   import '@testing-library/jest-dom'
   ```

**Verifizierung:**
```bash
npm run test
```

---

## Phase 2: P0 - Kritische Bugs beheben (9h)

### 🔴 Sprint 2.1: Memory Leak in OrbRenderer beheben (2h)
**Datei:** `app/src/core/OrbRenderer.tsx:140`

**Problem:**
```typescript
useEffect(() => {
  const newEngine = new OrbEngine(canvasRef.current!, config);
  setEngine(newEngine);
  // ❌ Alte Engine wird nicht disposed!
}, [config]);
```

**Fix:**
```typescript
useEffect(() => {
  // Dispose alte Engine BEVOR neue erstellt wird
  if (engine) {
    engine.dispose();
  }

  const newEngine = new OrbEngine(canvasRef.current!, config);
  setEngine(newEngine);

  // Cleanup beim Unmount
  return () => {
    newEngine.dispose();
  };
}, [config]); // engine NICHT in dependencies!
```

**Tests erstellen:**
```typescript
// app/src/core/__tests__/OrbRenderer.test.tsx
describe('OrbRenderer Memory Management', () => {
  it('should dispose old engine when config changes', () => {
    const disposeSpy = vi.fn();
    // Test implementation
  });

  it('should cleanup on unmount', () => {
    // Test implementation
  });
});
```

**Verifizierung:**
1. Browser DevTools Memory Profiler
2. Config mehrfach ändern
3. Prüfen ob Detached DOM Nodes akkumulieren

---

### 🔴 Sprint 2.2: WebGL-Verfügbarkeits-Prüfung (1h)
**Datei:** `app/src/core/OrbEngine.ts`

**Neue Utility erstellen:**
```typescript
// app/src/utils/webgl.ts
export function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2') || canvas.getContext('webgl');

    if (!context) return false;

    // Cleanup
    if (context instanceof WebGLRenderingContext ||
        context instanceof WebGL2RenderingContext) {
      const loseContext = context.getExtension('WEBGL_lose_context');
      if (loseContext) loseContext.loseContext();
    }

    return true;
  } catch (e) {
    return false;
  }
}

export class WebGLNotSupportedError extends Error {
  constructor() {
    super('WebGL is not supported in this browser');
    this.name = 'WebGLNotSupportedError';
  }
}
```

**OrbEngine anpassen:**
```typescript
// app/src/core/OrbEngine.ts
constructor(canvas: HTMLCanvasElement, config: OrbConfigInternal) {
  if (!isWebGLAvailable()) {
    throw new WebGLNotSupportedError();
  }

  this.renderer = new THREE.WebGLRenderer({ /* ... */ });
  // ... rest
}
```

**UI-Fallback erstellen:**
```typescript
// app/src/ui/common/WebGLFallback.tsx
export function WebGLFallback() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="text-center p-8 max-w-md">
        <h1 className="text-2xl font-bold mb-4">WebGL not supported</h1>
        <p className="mb-4">
          Your browser doesn't support WebGL, which is required for Orb Studio.
        </p>
        <p className="text-sm text-gray-400">
          Please try using a modern browser like Chrome, Firefox, or Safari.
        </p>
      </div>
    </div>
  );
}
```

**In App.tsx integrieren:**
```typescript
// app/src/App.tsx
import { isWebGLAvailable } from './utils/webgl';
import { WebGLFallback } from './ui/common/WebGLFallback';

function App() {
  if (!isWebGLAvailable()) {
    return <WebGLFallback />;
  }

  return <Shell />;
}
```

**Tests:**
```typescript
// app/src/utils/__tests__/webgl.test.ts
describe('isWebGLAvailable', () => {
  it('returns true when WebGL is available', () => {
    // Test with mock canvas
  });

  it('returns false when WebGL is not available', () => {
    // Test with no WebGL context
  });
});
```

---

### 🔴 Sprint 2.3: Error Boundaries überprüfen & erweitern (2h)

**Task 1: Verifikation der existierenden ErrorBoundary**
```bash
# Überprüfe ob ErrorBoundary korrekt eingebunden ist
grep -r "ErrorBoundary" app/src/
```

**Task 2: Sicherstellen dass alle Komponenten wrapped sind**
```typescript
// app/src/App.tsx
import { ErrorBoundary } from './ui/common/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Shell />
    </ErrorBoundary>
  );
}
```

**Task 3: Granulare Error Boundaries für Panels**
```typescript
// app/src/ui/layout/Shell.tsx
<ErrorBoundary>
  <OrbRenderer />
</ErrorBoundary>

<ErrorBoundary>
  <ControlPanels />
</ErrorBoundary>
```

**Task 4: Error-Logging hinzufügen**
```typescript
// app/src/ui/common/ErrorBoundary.tsx
componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
  // Log to localStorage
  const errorLog = {
    timestamp: new Date().toISOString(),
    error: error.toString(),
    stack: error.stack,
    componentStack: errorInfo.componentStack,
  };

  localStorage.setItem('last_error', JSON.stringify(errorLog));

  // In Production: Send to error tracking service
  if (import.meta.env.PROD) {
    // Sentry.captureException(error, { extra: errorInfo });
  }
}
```

**Task 5: Recovery-Mechanismus**
```typescript
handleReset = () => {
  // Reset zu sicheren Defaults
  useOrbStore.getState().resetToDefaults();
  this.setState({ hasError: false, error: null });
};
```

**Tests:**
```typescript
// app/src/ui/common/__tests__/ErrorBoundary.test.tsx
describe('ErrorBoundary', () => {
  it('catches errors and shows fallback UI', () => {
    // Test implementation
  });

  it('allows recovery via reset button', () => {
    // Test implementation
  });

  it('logs errors to localStorage', () => {
    // Test implementation
  });
});
```

---

### 🔴 Sprint 2.4: JSON Import implementieren (4h)

**Datei erstellen:** `app/src/ui/controls/ImportPanel.tsx`

**Features:**
1. File Upload Dialog
2. Drag & Drop Support
3. JSON Validation mit Zod
4. Error Handling
5. Preview vor Import
6. Migration von V0 zu V1

**Implementierung:**
```typescript
// app/src/ui/controls/ImportPanel.tsx
import { useOrbStore } from '../../state/useOrbStore';
import { orbConfigSchema } from '../../core/OrbConfig';
import { useState } from 'react';

export function ImportPanel() {
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<any>(null);
  const loadConfig = useOrbStore(state => state.loadConfig);

  const handleFile = async (file: File) => {
    try {
      const text = await file.text();
      const json = JSON.parse(text);

      // Validate with Zod
      const validated = orbConfigSchema.parse(json);

      setPreview(validated);
      setError(null);
    } catch (e) {
      if (e instanceof SyntaxError) {
        setError('Invalid JSON format');
      } else if (e instanceof z.ZodError) {
        setError(`Validation error: ${e.errors[0].message}`);
      } else {
        setError('Unknown error');
      }
      setPreview(null);
    }
  };

  const handleImport = () => {
    if (preview) {
      loadConfig(preview);
      setPreview(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/json') {
      handleFile(file);
    }
  };

  return (
    <div className="space-y-4">
      {/* Drag & Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
      >
        <input
          type="file"
          accept=".json"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <p className="text-gray-400">
            Drop JSON file here or click to browse
          </p>
        </label>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-red-400">
          {error}
        </div>
      )}

      {/* Preview */}
      {preview && (
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Preview</h3>
          <pre className="text-xs overflow-auto max-h-40">
            {JSON.stringify(preview, null, 2)}
          </pre>
          <button
            onClick={handleImport}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
          >
            Import Configuration
          </button>
        </div>
      )}
    </div>
  );
}
```

**In HeaderBar einbinden:**
```typescript
// app/src/ui/layout/HeaderBar.tsx
import { ImportPanel } from '../controls/ImportPanel';

// Tab für Import hinzufügen
```

**Tests:**
```typescript
// app/src/ui/controls/__tests__/ImportPanel.test.tsx
describe('ImportPanel', () => {
  it('accepts valid JSON files', async () => {
    // Test implementation
  });

  it('rejects invalid JSON', async () => {
    // Test implementation
  });

  it('validates against schema', async () => {
    // Test implementation
  });

  it('handles drag and drop', async () => {
    // Test implementation
  });
});
```

---

## Phase 3: P1 - Hohe Priorität (12h)

### ⚠️ Sprint 3.1: FPS Timer Race Condition beheben (1h)
**Datei:** `app/src/core/OrbRenderer.tsx`

**Problem:**
```typescript
const lowFpsTimer = useRef<NodeJS.Timeout | null>(null);
// ❌ Timer wird nicht gecleant
```

**Fix:**
```typescript
useEffect(() => {
  // ... FPS tracking logic

  return () => {
    // Cleanup timer
    if (lowFpsTimer.current) {
      clearTimeout(lowFpsTimer.current);
      lowFpsTimer.current = null;
    }
  };
}, [engine]);
```

---

### ⚠️ Sprint 3.2: Bundle Size optimieren (5h)

**Task 1: Code Splitting konfigurieren**
```typescript
// app/vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'three-core': ['three'],
          'three-postprocessing': [
            'three/examples/jsm/postprocessing/EffectComposer',
            'three/examples/jsm/postprocessing/RenderPass',
            'three/examples/jsm/postprocessing/UnrealBloomPass',
            // ... andere postprocessing
          ],
          'vendor': ['react', 'react-dom', 'zustand'],
        },
      },
    },
  },
});
```

**Task 2: Lazy Loading für Panels**
```typescript
// app/src/ui/layout/Shell.tsx
import { lazy, Suspense } from 'react';

const LookPanel = lazy(() => import('../controls/LookPanel'));
const MotionPanel = lazy(() => import('../controls/MotionPanel'));
// ... andere Panels

function Shell() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {activePanel === 'look' && <LookPanel />}
      {activePanel === 'motion' && <MotionPanel />}
    </Suspense>
  );
}
```

**Task 3: Tree Shaking verbessern**
- Nur benötigte Three.js Komponenten importieren
- `import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer'`
- Statt `import * as THREE from 'three'`

**Task 4: Presets async laden**
```typescript
// app/src/presets/index.ts
export const loadPresets = async () => {
  const { DEFAULT_PRESETS } = await import('./defaults');
  return DEFAULT_PRESETS;
};
```

**Ziel:** Bundle Size von 734 KB auf ~400 KB reduzieren

---

### ⚠️ Sprint 3.3: Console.log Statements entfernen (1h)

**Automatisiert mit ESLint:**
```javascript
// app/eslint.config.js
export default [
  {
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
];
```

**Manuell in Dateien ersetzen:**
```bash
# Finden
grep -r "console.log" app/src/

# Ersetzen durch structured logging (production)
# app/src/utils/logger.ts
export const logger = {
  debug: import.meta.env.DEV ? console.log : () => {},
  info: import.meta.env.DEV ? console.info : () => {},
  warn: console.warn,
  error: console.error,
};
```

---

### ⚠️ Sprint 3.4: Undo/Redo verifizieren & integrieren (5h)

**Task 1: Status prüfen**
- Zundo ist installiert ✅
- Prüfe ob in useOrbStore integriert

**Task 2: Falls nicht integriert:**
```typescript
// app/src/state/useOrbStore.ts
import { temporal } from 'zundo';

export const useOrbStore = create<OrbStore>()(
  temporal(
    persist(
      (set, get) => ({
        // ... state

        undo: () => {
          useOrbStore.temporal.getState().undo();
        },

        redo: () => {
          useOrbStore.temporal.getState().redo();
        },
      }),
      { name: 'orb-store' }
    ),
    {
      limit: 50, // Max 50 undo steps
      equality: (a, b) => JSON.stringify(a) === JSON.stringify(b),
    }
  )
);
```

**Task 3: UI Buttons hinzufügen**
```typescript
// app/src/ui/layout/HeaderBar.tsx
const { undo, redo } = useOrbStore.temporal.getState();
const { pastStates, futureStates } = useOrbStore.temporal;

<button onClick={undo} disabled={!pastStates.length}>
  Undo
</button>
<button onClick={redo} disabled={!futureStates.length}>
  Redo
</button>
```

**Task 4: Keyboard Shortcuts**
```typescript
// app/src/hooks/useKeyboardShortcuts.ts
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      useOrbStore.temporal.getState().undo();
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
      e.preventDefault();
      useOrbStore.temporal.getState().redo();
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
```

---

## Phase 4: P2 - Mittlere Priorität (25h)

### 📋 Sprint 4.1: Input-Validierung (4h)

**Zod-Schemas erstellen:**
```typescript
// app/src/core/validation.ts
import { z } from 'zod';

export const colorSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/);
export const rangeSchema = (min: number, max: number) =>
  z.number().min(min).max(max);

export const sliderValueSchema = z.object({
  value: z.number(),
  min: z.number(),
  max: z.number(),
  step: z.number().optional(),
}).refine(data => data.value >= data.min && data.value <= data.max);
```

**In Komponenten integrieren:**
```typescript
// app/src/ui/common/Slider.tsx
const handleChange = (value: number) => {
  const result = rangeSchema(min, max).safeParse(value);
  if (result.success) {
    onChange(result.data);
  } else {
    console.warn('Invalid slider value:', value);
  }
};
```

---

### 📋 Sprint 4.2: LocalStorage Limits (2h)

```typescript
// app/src/state/useOrbStore.ts
const MAX_ORBS = 50;
const STORAGE_QUOTA_WARNING = 0.8; // 80% of quota

const checkStorageQuota = () => {
  if (navigator.storage && navigator.storage.estimate) {
    navigator.storage.estimate().then(({ usage, quota }) => {
      if (usage && quota && usage / quota > STORAGE_QUOTA_WARNING) {
        console.warn('Storage quota nearly exceeded:', usage, '/', quota);
      }
    });
  }
};

// In store:
createOrb: () => {
  const orbs = get().orbs;
  if (orbs.length >= MAX_ORBS) {
    throw new Error(`Maximum ${MAX_ORBS} orbs allowed`);
  }
  // ... create orb
  checkStorageQuota();
}
```

---

### 📋 Sprint 4.3: Shader-Caching (4h)

```typescript
// app/src/core/OrbEngine.ts
private materialCache = new Map<string, THREE.ShaderMaterial>();

private getCachedMaterial(config: OrbConfigInternal): THREE.ShaderMaterial {
  const cacheKey = this.getMaterialCacheKey(config);

  if (this.materialCache.has(cacheKey)) {
    const material = this.materialCache.get(cacheKey)!;
    // Nur Uniforms updaten
    this.updateUniforms(material, config);
    return material;
  }

  // Material neu erstellen und cachen
  const material = this.createMaterial(config);
  this.materialCache.set(cacheKey, material);
  return material;
}

private getMaterialCacheKey(config: OrbConfigInternal): string {
  // Cache key basiert auf Shader-relevanten Parametern
  return `${config.shader.type}-${config.postprocessing.enabled}`;
}
```

---

### 📋 Sprint 4.4: LookPanel refactoring (3h)

**Komponenten aufteilen:**
```
app/src/ui/controls/look/
  ├── LookPanel.tsx (Hauptkomponente)
  ├── ColorControls.tsx
  ├── GradientControls.tsx
  ├── GlowControls.tsx
  └── ColorHarmonies.tsx
```

---

### 📋 Sprint 4.5: Performance Monitoring (6h)

**Web Vitals Integration:**
```typescript
// app/src/utils/performance.ts
import { onCLS, onFID, onLCP } from 'web-vitals';

export function initPerformanceMonitoring() {
  onCLS(console.log);
  onFID(console.log);
  onLCP(console.log);
}
```

**FPS Metrics Export:**
```typescript
// app/src/core/OrbRenderer.tsx
export const exportPerformanceMetrics = () => {
  return {
    avgFPS: /* ... */,
    minFPS: /* ... */,
    maxFPS: /* ... */,
    timestamp: new Date().toISOString(),
  };
};
```

**Lighthouse CI Setup:**
```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [pull_request]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm run build
      - uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            http://localhost:4173
          uploadArtifacts: true
```

---

### 📋 Sprint 4.6: Environment Variables (2h)

```bash
# app/.env.development
VITE_APP_VERSION=$npm_package_version
VITE_ENABLE_DEBUG=true
VITE_MAX_ORBS=50

# app/.env.production
VITE_APP_VERSION=$npm_package_version
VITE_ENABLE_DEBUG=false
VITE_MAX_ORBS=20
```

```typescript
// app/src/config.ts
export const config = {
  version: import.meta.env.VITE_APP_VERSION,
  debug: import.meta.env.VITE_ENABLE_DEBUG === 'true',
  maxOrbs: Number(import.meta.env.VITE_MAX_ORBS),
};
```

---

## Phase 5: P3 - Niedrige Priorität (35h)

### 📝 Sprint 5.1: Keyboard Shortcuts (3h)
- Implementierung siehe Sprint 3.4
- Hilfe-Overlay mit Shortcut-Übersicht

### 📝 Sprint 5.2: Mobile Testing (6h)
- Touch-Event-Optimierung
- Responsive-Breakpoints testen
- Performance auf Mobile-Devices

### 📝 Sprint 5.3: Accessibility (8h)
- ARIA-Labels hinzufügen
- Keyboard-Navigation
- Screen-Reader-Tests
- Farbkontrast-Prüfung (WCAG AA)

### 📝 Sprint 5.4: Dokumentation (4h)
- Einheitliche Sprache (Englisch)
- CONTRIBUTING.md erstellen
- CODE_OF_CONDUCT.md
- API-Dokumentation

### 📝 Sprint 5.5: Erweiterte Tests (14h)
- Unit Tests für Core-Logic (8h)
- Integration Tests für UI (4h)
- E2E Tests mit Playwright (2h)
- **Ziel:** 70% Coverage

---

## 🚀 Empfohlene Umsetzungs-Reihenfolge

### Woche 1: Projekt stabilisieren
- ✅ Phase 1: Dependencies & Build (2h)
- ✅ Phase 2: P0 Bugs (9h)
- **Ergebnis:** Funktionsfähiges Projekt ohne kritische Bugs

### Woche 2: Core-Features
- ✅ Phase 3: P1 Features (12h)
- **Ergebnis:** Optimierte Performance, vollständige Funktionalität

### Woche 3-4: Code-Qualität
- ✅ Phase 4: P2 Verbesserungen (25h)
- **Ergebnis:** Wartbarer, performanter Code

### Monat 2+: Polish
- ✅ Phase 5: P3 Nice-to-Haves (35h)
- **Ergebnis:** Produktionsreife Anwendung

---

## ✅ Erfolgskriterien

Nach Abschluss aller Phasen:

**Build & Tests:**
- ✅ `npm run build` läuft ohne Fehler
- ✅ `npm run lint` zeigt 0 Fehler
- ✅ `npm run test` zeigt 70%+ Coverage
- ✅ CI Pipeline grün

**Performance:**
- ✅ Bundle Size < 400 KB
- ✅ FPS > 30 auf mobilen Geräten
- ✅ Lighthouse Score > 90
- ✅ Keine Memory Leaks

**Funktionalität:**
- ✅ WebGL Fallback funktioniert
- ✅ Error Boundaries fangen alle Fehler
- ✅ Import/Export funktioniert
- ✅ Undo/Redo funktioniert
- ✅ Keyboard Shortcuts funktionieren

**Code-Qualität:**
- ✅ Keine console.log in Production
- ✅ Input-Validierung überall
- ✅ Komponenten < 200 Zeilen
- ✅ LocalStorage-Limits implementiert

**Accessibility:**
- ✅ WCAG 2.1 AA konform
- ✅ Keyboard-Navigation
- ✅ Screen-Reader-kompatibel

---

## 📝 Nächste Schritte

1. **Review dieses Plans** - Team-Zustimmung einholen
2. **Sprint 1.1 starten** - Dependencies installieren
3. **Tägliches Standup** - Progress tracken
4. **Wöchentliches Review** - Plan adjustieren

---

**Fragen? Änderungswünsche?** → Siehe `aufgabenplan.md` für detaillierte Prompts
