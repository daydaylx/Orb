# Orb-Studio

Ein eigenständiges Autorentool zum Erstellen und Konfigurieren von visuellen Orbs (3D-Sphären) für die Verwendung in externen Anwendungen.

## Über Orb-Studio
Orb-Studio ist ein spezialisierter Editor für "Orbs". Es ermöglicht die visuelle Gestaltung von 3D-Kugeln mit verschiedenen Parametern wie Farben, Gradienten, Rotation und Effekten. Das Ziel ist es, diese Konfigurationen als **JSON** zu exportieren, damit sie von anderen Systemen (z. B. Disa) gerendert werden können.

Es gibt **keine** direkte Code-Abhängigkeit zu den konsumierenden Projekten; die Schnittstelle ist rein datengetrieben.

## Tech-Stack
- **Framework:** React (Vite)
- **Sprache:** TypeScript
- **Rendering:** Three.js (@react-three/fiber, @react-three/drei)
- **State Management:** Zustand
- **Styling:** CSS Modules / Standard CSS (Tailwind möglich, falls konfiguriert)

## Setup & Entwicklung

### Voraussetzungen
- Node.js (empfohlen: v18+ oder v20+)
- npm oder pnpm

### Installation
```bash
cd orb-studio
npm install
# oder
pnpm install
```

### Starten (Development)
Startet den Dev-Server unter `http://localhost:5173`.
```bash
npm run dev
```

### Build
Erstellt das optimierte Build-Artefakt im `dist/` Ordner.
```bash
npm run build
```

## Projektstruktur

- `src/core/`: Kernlogik für die 3D-Engine, Shader, Config-Definitionen.
- `src/state/`: Globales State Management (Zustand Stores).
- `src/ui/`: React-Komponenten für das Editor-Interface (Layout, Controls).
- `src/presets/`: Vordefinierte Orb-Konfigurationen (optional).
- `src/utils/`: Allgemeine Hilfsfunktionen.

## Beispiel-Orbs
Im Ordner `examples/` finden sich Beispiel-Konfigurationen im JSON-Format. Details zum Format sind in `docs/orb-config-spec.md` dokumentiert.

## Aktueller Status
- **Studio-Funktionen:** Multi-Orb-Verwaltung (Liste, Erstellen, Löschen), lokale Persistenz.
- **Rendering:** Voller Shader-Support für Farben, Noise, Glow und Details.
- **Export:** JSON-Export (Clipboard/File) implementiert.
