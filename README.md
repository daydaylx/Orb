# Orb Project

Dieses Repository enthält den Quellcode für **Orb Studio**, ein Web-Tool zum Erstellen und Konfigurieren von 3D-Orbs.

## Projektstruktur

```
orb/
├── app/                    # Orb Studio Anwendung (React + Vite + Three.js)
├── docs/                   # Dokumentation (Spezifikation, Integration)
├── examples/               # Beispiel-Konfigurationen (JSON)
├── .dev/                   # Entwicklungsdateien (Logs, Notizen, Implementierungsplan)
├── LICENSE
├── README.md
└── package.json
```

### Hauptverzeichnisse

*   **[`app/`](app/)**: Die Hauptanwendung - Orb Studio (React + Vite + Three.js)
*   **[`examples/`](examples/)**: Beispiel-Konfigurationen (JSON) für verschiedene Orb-Styles
*   **[`docs/`](docs/)**: Technische Dokumentation (API-Spezifikation, Integrationsguide)
*   **[`.dev/`](.dev/)**: Entwicklungsdateien (Implementation Log, Plan, Logs)

## Schnellstart

Um das Studio lokal zu starten:

```bash
# aus dem Repo-Root
npm install
npm run dev
```

Weitere Details finden sich in der [App-README](app/README.md).
