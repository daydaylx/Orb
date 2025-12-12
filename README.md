# Orb Project

Dieses Repository enthält den Quellcode für **Orb Studio**, ein Web-Tool zum Erstellen und Konfigurieren von 3D-Orbs.

## Projektstruktur

```
orb/
├── app/                    # Orb Studio Anwendung (React + Vite + Three.js)
├── docs/                   # Dokumentation (Spezifikation, Integration)
├── examples/               # Beispiel-Konfigurationen (JSON)
├── .dev/                   # Interne Entwicklungsnotizen (keine Logs mehr im Repo)
├── .gitignore
├── LICENSE
├── README.md
└── package.json
```

### Hauptverzeichnisse

*   **[`app/`](app/)**: Die Hauptanwendung - Orb Studio (React + Vite + Three.js)
*   **[`examples/`](examples/)**: Beispiel-Konfigurationen (JSON) für verschiedene Orb-Styles
*   **[`docs/`](docs/)**: Technische Dokumentation (API-Spezifikation, Integrationsguide)
*   **[`.dev/`](.dev/)**: Entwicklungsdokumente (Plan, Implementation Log, Notizen). Temporäre Logs/DBs sind aus dem Repository entfernt und via `.gitignore` ausgeschlossen.

## Schnellstart

Um das Studio lokal zu starten:

```bash
# Abhängigkeiten der App installieren
npm install --prefix app

# Development-Server starten (läuft via Vite)
npm run dev
```

Weitere Details finden sich in der [App-README](app/README.md).
