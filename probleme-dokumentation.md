# Probleme-Dokumentation - Orb Studio

**Stand:** 2025-12-12
**Basis:** Commit 14249e4 (feat: add env-map drag drop)

---

## 🔴 Kritische Probleme (P0) - Sofort beheben

### 1. Memory Leak in OrbRenderer
**Datei:** `app/src/core/OrbRenderer.tsx:140`
**Schweregrad:** Kritisch
**Impact:** Speicherleck bei jeder Config-Änderung, führt zu Performance-Degradation

**Problem:**
- `OrbEngine` wird nicht korrekt disposed wenn neue Config geladen wird
- Bei jedem Config-Update wird neue Engine-Instanz erstellt
- Alte Three.js Objekte werden nicht aus Speicher entfernt
- Akkumuliert WebGL-Kontexte und Texturen

**Code-Stelle:**
```typescript
// app/src/core/OrbRenderer.tsx
useEffect(() => {
  const newEngine = new OrbEngine(canvasRef.current!, config);
  setEngine(newEngine);
  // ❌ FEHLER: Alte Engine wird nicht disposed!
}, [config]);
```

**Symptome:**
- Steigende Speichernutzung bei Config-Änderungen
- Browser wird langsamer nach längerer Nutzung
- Eventuelle Out-of-Memory Fehler

**Geschätzter Aufwand:** 2h

---

### 2. Fehlende WebGL-Verfügbarkeits-Prüfung
**Datei:** `app/src/core/OrbEngine.ts`
**Schweregrad:** Kritisch
**Impact:** App crasht komplett auf Geräten ohne WebGL

**Problem:**
- Keine Prüfung ob WebGL verfügbar ist vor Initialisierung
- Kein Fallback für ältere Browser oder mobile Geräte
- Keine Fehlermeldung für Nutzer

**Code-Stelle:**
```typescript
// app/src/core/OrbEngine.ts - Constructor
constructor(canvas: HTMLCanvasElement, config: OrbConfigInternal) {
  this.renderer = new THREE.WebGLRenderer({ /* ... */ });
  // ❌ FEHLER: Keine WebGL-Verfügbarkeits-Prüfung!
}
```

**Betroffene Browser:**
- Internet Explorer
- Alte Android-Browser
- Geräte mit deaktivierten WebGL

**Geschätzter Aufwand:** 1h

---

### 3. Keine React Error Boundaries
**Dateien:** Gesamte App
**Schweregrad:** Kritisch
**Impact:** Jeder React-Fehler crasht die gesamte App

**Problem:**
- Keine Error Boundaries implementiert
- Fehler in Komponenten führen zu komplettem App-Crash
- Keine Recovery-Möglichkeit für Nutzer
- Keine Fehler-Logging

**Fehlende Komponenten:**
- `ErrorBoundary.tsx` existiert nicht
- Keine Fallback-UI bei Fehlern
- Keine Error-Tracking-Integration

**Geschätzter Aufwand:** 2h

---

### 4. Kein JSON Import
**Datei:** `app/src/ui/controls/ExportPanel.tsx`
**Schweregrad:** Hoch
**Impact:** Nutzer können gespeicherte Configs nicht zurückladen

**Problem:**
- Nur Export-Funktionalität vorhanden
- Keine Import-Funktionalität
- Nutzer müssen Configs manuell in Code kopieren
- Share-Links funktionieren, aber kein direkter Datei-Import

**Fehlende Features:**
- File-Upload-Dialog
- JSON-Validierung beim Import
- Error-Handling für invalide Dateien

**Geschätzter Aufwand:** 4h

---

## ⚠️ Hohe Priorität (P1) - Nächste Woche

### 5. Keine Undo/Redo Funktionalität
**Dateien:** `app/src/state/useOrbStore.ts`
**Schweregrad:** Hoch
**Impact:** Schlechte UX, Nutzer können Änderungen nicht rückgängig machen

**Problem:**
- Keine State-History
- Keine Undo/Redo-Buttons
- Keine Keyboard-Shortcuts (Ctrl+Z / Ctrl+Y)
- Kritisch für Editor-Tool

**Fehlende Implementierung:**
- History-Stack in Zustand Store
- Undo/Redo Actions
- Keyboard-Event-Handler
- UI-Buttons

**Geschätzter Aufwand:** 6h

---

### 6. FPS Timer Race Condition
**Datei:** `app/src/core/OrbRenderer.tsx`
**Schweregrad:** Mittel
**Impact:** Potentieller Memory Leak bei schnellen Re-Renders

**Problem:**
- `lowFpsTimer` ref wird nicht korrekt aufgeräumt
- Timer läuft weiter nach Unmount
- Race Condition bei schnellen Config-Wechseln

**Code-Stelle:**
```typescript
// app/src/core/OrbRenderer.tsx
const lowFpsTimer = useRef<NodeJS.Timeout | null>(null);
// ❌ FEHLER: Cleanup fehlt in useEffect
```

**Geschätzter Aufwand:** 1h

---

### 7. Großer Bundle Size (734 KB)
**Datei:** Vite-Konfiguration
**Schweregrad:** Mittel
**Impact:** Langsame Ladezeiten, schlechte Performance auf mobilen Geräten

**Problem:**
- Bundle ist 734 KB (Ziel: ~400 KB)
- Three.js Examples komplett gebundled
- Kein Code-Splitting konfiguriert
- Keine Lazy-Loading für Komponenten
- Keine Tree-Shaking-Optimierung

**Hauptursachen:**
- Three.js Postprocessing Examples (~200 KB)
- Keine dynamischen Imports
- Alle Presets in Main-Bundle

**Geschätzter Aufwand:** 5h

---

## 📋 Mittlere Priorität (P2) - Nächste 2-3 Wochen

### 8. Keine Input-Validierung
**Dateien:** Alle Control-Komponenten
**Schweregrad:** Mittel
**Impact:** Ungültige Werte können zu Fehlern führen

**Problem:**
- Slider-Werte werden nicht geprüft
- Hex-Color-Werte nicht validiert
- Keine Runtime-Validierung der Config
- Keine Zod/Joi Schema-Validierung

**Betroffene Dateien:**
- `app/src/ui/controls/LookPanel.tsx`
- `app/src/ui/controls/MotionPanel.tsx`
- `app/src/ui/controls/DetailsPanel.tsx`
- `app/src/ui/common/Slider.tsx`
- `app/src/ui/common/ColorPicker.tsx`

**Geschätzter Aufwand:** 4h

---

### 9. Große Komponenten (Code Smell)
**Datei:** `app/src/ui/controls/LookPanel.tsx:310`
**Schweregrad:** Niedrig
**Impact:** Schlechte Wartbarkeit, schwierige Lesbarkeit

**Problem:**
- LookPanel ist 310 Zeilen lang
- Sollte in kleinere Sub-Komponenten aufgeteilt werden
- Zu viele Verantwortlichkeiten

**Vorgeschlagene Aufteilung:**
- `ColorControls.tsx` - Farbauswahl
- `GradientControls.tsx` - Gradient-Einstellungen
- `GlowControls.tsx` - Glow-Einstellungen
- `ColorHarmonies.tsx` - Farb-Harmonien

**Geschätzter Aufwand:** 3h

---

### 10. LocalStorage ohne Limits
**Datei:** `app/src/state/useOrbStore.ts`
**Schweregrad:** Mittel
**Impact:** Potenzielle Quota-Probleme bei vielen Orbs

**Problem:**
- Keine Begrenzung der gespeicherten Orbs
- Kein Cleanup alter States
- Keine Prüfung der LocalStorage-Quota
- Keine Kompression der gespeicherten Daten

**Potenzielle Issues:**
- QuotaExceededError bei zu vielen Orbs
- Performance-Probleme beim Laden
- Keine Warnung für Nutzer

**Geschätzter Aufwand:** 2h

---

### 11. Shader-Recompilation bei jedem Update
**Datei:** `app/src/core/OrbEngine.ts`
**Schweregrad:** Mittel
**Impact:** Unnötige Performance-Kosten

**Problem:**
- Material wird bei jedem Config-Update neu kompiliert
- Shader-Code ändert sich nicht, nur Uniforms
- Könnte mit Caching optimiert werden

**Code-Stelle:**
```typescript
// app/src/core/OrbEngine.ts
public updateMaterial(config: OrbConfigInternal) {
  // Material wird komplett neu erstellt
  this.orbMesh.material = new THREE.ShaderMaterial({ /* ... */ });
}
```

**Geschätzter Aufwand:** 4h

---

### 12. Kein Performance-Monitoring
**Dateien:** Gesamte App
**Schweregrad:** Niedrig
**Impact:** Keine Metriken für Performance-Optimierung

**Problem:**
- FPS-Tracking existiert, aber keine Metriken-Export
- Keine Lighthouse-CI-Integration
- Keine Web Vitals Messung
- Keine Error-Tracking (Sentry, etc.)

**Fehlende Features:**
- Performance Monitoring Dashboard
- Metric Export (JSON/CSV)
- Analytics-Integration
- Error-Tracking-Service

**Geschätzter Aufwand:** 6h

---

## 📝 Niedrige Priorität (P3) - Nice to Have

### 13. Unused Dependency
**Datei:** `app/src/ui/controls/LookPanel.tsx`
**Schweregrad:** Sehr niedrig
**Impact:** Minimal, nur Bundle-Size

**Problem:**
- `tinycolor2` wird importiert aber nie verwendet
- Kann entfernt werden

**Geschätzter Aufwand:** 5min

---

### 14. 0% Test Coverage
**Dateien:** Gesamte App
**Schweregrad:** Kritisch (langfristig)
**Impact:** Keine Regression-Sicherheit, fehleranfällige Entwicklung

**Problem:**
- Keine Tests vorhanden
- Kein Jest/Vitest Setup
- Keine Test-Infrastruktur
- Kritisch für produktive Editor-Tools

**Fehlende Tests:**
- Unit Tests für Core-Logic
- Integration Tests für UI
- E2E Tests für User-Flows
- Shader Tests

**Geschätzter Aufwand:** 20h (vollständige Suite)

---

### 15. Fehlende JSDoc-Kommentare
**Dateien:** Alle TypeScript-Dateien
**Schweregrad:** Niedrig
**Impact:** Schlechtere Developer-Experience

**Problem:**
- Keine JSDoc-Kommentare auf Public APIs
- Keine Dokumentation für Komponenten-Props
- Keine Beispiele in Code-Kommentaren

**Geschätzter Aufwand:** 8h

---

### 16. Keine Keyboard-Shortcuts
**Dateien:** Gesamte App
**Schweregrad:** Mittel
**Impact:** Schlechtere UX für Power-User

**Problem:**
- Keine Keyboard-Navigation
- Keine Shortcuts für häufige Aktionen
- Keine Hilfe-Übersicht für Shortcuts

**Fehlende Shortcuts:**
- `Ctrl+Z` / `Ctrl+Y` - Undo/Redo
- `Ctrl+D` - Duplicate Orb
- `Ctrl+S` - Export
- `Space` - Toggle Playback
- `Ctrl+N` - New Orb

**Geschätzter Aufwand:** 3h

---

### 17. Mobile Responsiveness ungetestet
**Dateien:** UI-Komponenten
**Schweregrad:** Mittel
**Impact:** Unbekannt, ob auf Mobile nutzbar

**Problem:**
- Keine mobilen Tests
- Tailwind-Responsive-Klassen verwendet, aber nicht verifiziert
- Heavy 3D-Rendering könnte auf Mobile langsam sein
- Touch-Events nicht optimiert

**Geschätzter Aufwand:** 6h Testing + Fixes

---

### 18. Keine Accessibility-Prüfung
**Dateien:** Gesamte App
**Schweregrad:** Mittel
**Impact:** Nicht barrierefrei

**Problem:**
- Keine ARIA-Labels
- Keine Keyboard-Navigation
- Keine Screen-Reader-Tests
- Keine Farbkontrast-Prüfung

**Fehlende Standards:**
- WCAG 2.1 AA Compliance
- Semantic HTML
- Focus-Management
- Alt-Texte

**Geschätzter Aufwand:** 8h

---

### 19. Dokumentations-Inkonsistenzen
**Dateien:** README, Docs
**Schweregrad:** Sehr niedrig
**Impact:** Verwirrung für Contributors

**Problem:**
- Mischung aus Deutsch und Englisch
- .dev/ Docs nicht im Haupt-README verlinkt
- Kein CONTRIBUTING.md
- Kein CODE_OF_CONDUCT.md

**Geschätzter Aufwand:** 2h

---

### 20. Kein Environment-Variablen-System
**Dateien:** Vite-Config
**Schweregrad:** Niedrig
**Impact:** Hardcoded-Werte, keine Build-Zeit-Config

**Problem:**
- Keine `.env`-Datei
- Keine Build-Zeit-Konfiguration
- Magic Numbers hardcoded

**Fehlende Features:**
- `.env.development`, `.env.production`
- Vite-Env-Integration
- Config-Injection

**Geschätzter Aufwand:** 2h

---

## 📊 Zusammenfassung

### Probleme nach Kategorie

| Kategorie | P0 | P1 | P2 | P3 | Gesamt |
|-----------|----|----|----|----|--------|
| **Bugs** | 3 | 2 | 3 | 1 | 9 |
| **Features** | 1 | 1 | 0 | 3 | 5 |
| **Code Quality** | 0 | 0 | 2 | 4 | 6 |
| **Gesamt** | **4** | **3** | **5** | **8** | **20** |

### Aufwand-Schätzung

| Priorität | Probleme | Geschätzter Aufwand |
|-----------|----------|---------------------|
| **P0** | 4 | 9h |
| **P1** | 3 | 12h |
| **P2** | 5 | 25h |
| **P3** | 8 | 54h |
| **Gesamt** | **20** | **100h** |

---

## 🎯 Empfohlene Reihenfolge

1. **Woche 1:** P0 Bugs (9h) - Stabilität
2. **Woche 2:** P1 Features + Bugs (12h) - Core-Funktionalität
3. **Woche 3-4:** P2 Code-Quality (25h) - Optimierung
4. **Monat 2+:** P3 Nice-to-Haves (54h) - Polish

---

**Nächster Schritt:** Siehe `aufgabenplan.md` für konkrete Prompts und Implementierungs-Schritte.
