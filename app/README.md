# Orb Studio

## Kurzbeschreibung
Orb Studio ist eine interaktive Webanwendung zur Visualisierung und Konfiguration eines 3D-Orbs. Die Anwendung richtet sich an Entwickler und Designer, die Shader-Effekte, Farben und Animationen in Echtzeit testen und als Presets speichern möchten. Sie löst das Problem, komplexe 3D-Parameter mühsam im Code anpassen zu müssen, indem sie eine intuitive Benutzeroberfläche zur Feinjustierung bietet.

## Features
- **Echtzeit-3D-Rendering**: Visualisierung eines konfigurierbaren Orbs mittels Three.js und Shadern.
- **Detaillierte Konfiguration**: Anpassung von Parametern wie Rotation, Noise, Farben, Glow und Partikeldichte.
- **Preset-Management**: Speichern und Laden von Konfigurationen (Standard-Presets und benutzerdefinierte Presets).
- **Export-Funktion**: Kopieren der aktuellen Konfiguration als JSON oder TypeScript-Code.
- **Responsive UI**: Unterteilt in übersichtliche Bereiche für Look, Motion und Details.

## Tech-Stack
- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS (Utility-First), CSS Modules
- **3D / Grafik**: Three.js, Custom WebGL Shader (GLSL)
- **State Management**: Zustand
- **Build-Tools**: Vite, npm

## Projektstruktur
Die wichtigsten Ordner und Dateien im Überblick:

- `src/` – Hauptquellcode der Anwendung
  - `src/core/` – Kernlogik für 3D-Rendering (Engine, Config, Shader)
  - `src/state/` – Globales State Management (Zustand Stores)
  - `src/ui/` – Benutzeroberfläche (Panels, Controls, Layout)
  - `src/utils/` – Hilfsfunktionen
- `public/` – Statische Assets
- `tailwind.config.js` – Konfiguration für Tailwind CSS
- `vite.config.ts` – Konfiguration für den Build-Prozess

## Voraussetzungen
- Node.js (empfohlen: v18 oder höher)
- npm (wird standardmäßig mit Node.js installiert)

## Installation & Setup
1. Repository clonen (oder in das Verzeichnis wechseln):
   ```bash
   cd orb-studio
   ```
2. Abhängigkeiten installieren:
   ```bash
   npm install
   ```
3. Lokalen Development-Server starten:
   ```bash
   npm run dev
   ```
   Die Anwendung ist anschließend unter `http://localhost:5173` (oder einem ähnlichen Port) erreichbar.

## Konfiguration
Das Projekt verwendet Standard-Konfigurationsdateien:
- **`tailwind.config.js`**: Definiert die Pfade für Tailwind CSS.
- **`vite.config.ts`**: Steuert den Vite-Build-Prozess und Plugins (React).
- **`tsconfig.json`**: TypeScript-Compiler-Einstellungen.

Wichtige Umgebungsvariablen sind aktuell nicht erforderlich.

## Nutzung
Nach dem Start (`npm run dev`) öffnet sich die Web-Oberfläche.

### Hauptbereiche:
- **Canvas (Mitte)**: Zeigt die Echtzeit-Vorschau des Orbs.
- **Sidebar (Links)**:
  - **Orbs**: Verwaltung mehrerer Orbs (Neu, Duplizieren, Löschen).
  - **Look**: Farben, Verlauf und Leuchteffekte (Glow).
  - **Motion**: Rotation und Noise-Bewegung.
  - **Details**: Partikeldichte, Bänder und Animationsschleifen.
  - **Presets**: Laden von vordefinierten Stilen.
  - **Export**: Exportieren der Config als JSON.
- **Header**: Titelzeile.

## Beispiel-Orbs
Im Ordner `../examples` (vom Repo-Root aus) finden sich kuratierte JSON-Konfigurationen (z. B. Plasma, Calm Purple, Tech Grid), die zeigen, was mit dem Orb Studio möglich ist. 
Details zum Format und zur Verwendung in anderen Projekten gibt es in `../docs/orb-config-spec.md`.

## Tests & Qualitätssicherung
- **Linting**:
  Überprüfung des Codes auf Stil- und Syntaxfehler:
  ```bash
  npm run lint
  ```
- **Build-Test**:
  Erstellen des Produktions-Builds zur Verifizierung:
  ```bash
  npm run build
  ```

## Deployment
Das Projekt ist eine statische Webanwendung (SPA) und kann auf jedem statischen Hoster deployed werden.

Build-Befehl für das Deployment:
```bash
npm run build
```
Das Ergebnis liegt im Ordner `dist/`.

Beispiele für Hoster:
- **Vercel / Netlify / Cloudflare Pages**: Einfach das Repository verbinden und `npm run build` als Build-Command sowie `dist` als Output-Directory angeben.
- **Docker / Nginx**: Den Inhalt von `dist/` auf einen Webserver kopieren.

## Lizenz
MIT License (siehe `LICENSE` Datei im Hauptverzeichnis).

## Autor
Entwickelt von **daydaylx**.
