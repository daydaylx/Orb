# Orb Project

Dieses Repository enthält den Quellcode für **Orb Studio**, ein Web-Tool zum Erstellen und Konfigurieren von 3D-Orbs.

## Projektstruktur

```
orb/
├── app/                    # Orb Studio Anwendung (React + Vite + Three.js)
├── docs/                   # Dokumentation: spec/, guides/, changelog/
├── examples/               # Beispiel-Konfigurationen (JSON)
├── .dev/                   # Interne Entwicklungsnotizen (keine Logs im Repo)
├── .github/workflows/      # CI-Pipeline
├── .gitignore
├── LICENSE
├── README.md
└── package.json
```

### Hauptverzeichnisse

* **[`app/`](app/)**: Die Hauptanwendung - Orb Studio (React + Vite + Three.js)
* **[`examples/`](examples/)**: Beispiel-Konfigurationen (JSON) für verschiedene Orb-Styles
* **[`docs/`](docs/)**: Spezifikationen (`spec/`), Guides (`guides/`), Changelog (`changelog/`)
* **[`.dev/`](.dev/)**: Entwicklungsdokumente (Plan, Implementation Log, Notizen). Temporäre Logs/DBs sind aus dem Repository entfernt und via `.gitignore` ausgeschlossen.
* **[`.github/workflows/`](.github/workflows/)**: CI-Pipeline (Lint + Build)

## Schnellstart

Um das Studio lokal zu starten:

```bash
# Abhängigkeiten installieren (Workspaces)
npm install

# Development-Server starten (Vite)
npm run dev
```

Weitere Details finden sich in der [App-README](app/README.md).

## Neu (Dez 2025)
- Erweiterte Preset-Bibliothek mit Farbharmonien/Randomizer.
- Post-FX: Bloom, Chromatic Aberration, Film Grain, optional Depth of Field; Qualitätsstufen High/Medium/Low + Optimize.
- Export: JSON, Share-Link (Query-Param `?orb=`), GLB-Preview Export.
- Timeline-Scrub + Easing-Auswahl für Animation.
- Drag & Drop von HDR/PNG/JPG als Environment Map direkt auf die Canvas.
