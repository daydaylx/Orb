# Orb-Studio – Projektplan

## Ziel & Zweck
**Orb-Studio** ist ein eigenständiges **Autorentool** zur visuellen Erstellung und Bearbeitung von „Orbs“ (interaktiven 3D-Kugeln).

- **Output:** Der einzige offizielle Output sind **Orb-Config-Daten (JSON)** (`OrbConfigExternalV1`), die von anderen Projekten (z. B. Disa) konsumiert werden.
- **Entkopplung:** Es gibt **KEINE** direkte Code-Integration in andere Projekte. Der Datenaustausch erfolgt ausschließlich über das definierte JSON-Format.
- **Zielgruppe:** Power-User / Tool-Builder (ich selbst).

## Hauptkomponenten
1.  **Engine:** Three.js-basiertes Rendering, Shader-Pipeline, Uniforms-Mapping.
2.  **UI:** Editor-Interface (Sidebar, Panels) zur Manipulation der Parameter.
3.  **State:** Verwaltung der Orb-Konfigurationen (Zustand, Historie).
4.  **Export/Import:** Generierung und Laden von validen JSON-Configs.

## Scope-Grenzen & Minimalziele

### Was gehört NICHT dazu (Out of Scope)
- Keine Chat-Funktionalitäten oder Messenger-Logik.
- Keine Disa-spezifischen UI-Komponenten oder Business-Logik.
- Keine Backend-Datenbank (Persistenz nur lokal/Browser oder Datei-basiert).

### Minimalziele (MVP)
1.  **Orbs bauen:** Visuelle Anpassung von Farben, Shadern, Rotation.
2.  **Speichern/Laden:** Persistenz im LocalStorage (Session-basiert).
3.  **Exportieren:** Generierung einer sauberen JSON-Config für externe Nutzung.
4.  **Verwalten:** Liste von Orbs (Erstellen, Löschen, Duplizieren).
