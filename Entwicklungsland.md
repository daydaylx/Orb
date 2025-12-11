# Orb-Studio – Entwicklungsplan mit Agent-Prompts

Dieses Dokument definiert den Entwicklungsplan für **Orb-Studio** und liefert zu jeder Phase einen passenden Prompt, den du direkt in Claude/Gemini/WebDev Arena o. Ä. nutzen kannst.

Kontext (für alle Prompts gültig):

- Projekt: Eigenständiger Orb-Editor („Orb-Studio“)
- Zweck: Interaktives Tool zum Erstellen und Bearbeiten von Orb-Konfigurationen
- Output: **JSON-Configs**, die von anderen Projekten konsumiert werden (z. B. Disa), aber **kein** direktes Coupling des Codes.
- Codebasis: React + Vite + TypeScript + Three.js + Zustand
- Verzeichnis: `orb-studio/` ist das eigentliche Projekt
- Ziel: Realistisches, wartbares Tool, keine Spielerei mit halbfertigen Features.

---

## Phase 0 – Ziel & Scope festnageln

**Ziel:** Eindeutig definieren, was Orb-Studio ist (Autorentool) und was das Tool NICHT ist.  
`Plan.md` und Projekt-Zielbeschreibung werden klargezogen.

### Prompt – Phase 0 (Ziel & Scope schärfen)

```text
Du bist ein Senior-Softwarearchitekt mit Fokus auf kleine, aber saubere Tools (React, TypeScript, Three.js).

Kontext:
- Projektname: Orb-Studio
- Das Projekt liegt im Repo in einem Unterordner `orb-studio/`.
- Orb-Studio soll ein eigenständiger Editor sein, mit dem ich visuelle Orbs entwerfe und als JSON-Config exportiere.
- Andere Projekte (z. B. Disa) sollen nur dieses JSON-Format konsumieren, nicht den Code von Orb-Studio.

Aufgabe:
1. Analysiere die bestehende Struktur und das Dokument `Plan.md` im Projekt `orb-studio/`.
2. Überarbeite `Plan.md` so, dass darin klar und knapp festgehalten ist:
   - Orb-Studio ist ein eigenständiges Autorentool.
   - Der einzige offizielle Output sind Orb-Config-Daten (JSON), die extern verwendet werden.
   - Es gibt KEINE direkte Integration in Disa, nur Datenaustausch über ein klares Config-Format.
   - Ein grober Überblick über:
     - Hauptkomponenten (Engine, UI, State, Export/Import)
     - Zielgruppe: Ich selbst als Power-User / Tool-Bauer.
3. Formuliere Scope-Grenzen:
   - Was gehört NICHT mehr in Orb-Studio (z. B. keine Chat-Funktion, keine Disa-spezifischen UI-Komponenten).
   - Was die Minimalziele sind (Orbs bauen, speichern, laden, exportieren).

Anforderungen:
- Aktualisiere die Datei `Plan.md` direkt, ohne neue Dateien anzulegen.
- Schreib klar, technisch und ohne Marketing-Blabla.
- Keine TODO-Listen im Stil „könnte man mal machen“, sondern knappe, verbindliche Ziele.
- Halte die Datei so, dass ich sie auch in 3 Monaten noch verstehe und als Referenz nutzen kann.


---

Phase 1 – Repo und Basis aufräumen

Ziel: Das Projekt soll nicht mehr wie ein Vite-Template aussehen, sondern wie ein bewusst angelegtes Tool.
README.md und Basisstruktur im orb-studio-Folder werden aufgeräumt.

Prompt – Phase 1 (README & Struktur-Basis)

Du bist ein Senior-Frontend-Engineer (React + Vite + TypeScript), pragmatisch und direkt.

Kontext:
- Das eigentliche Projekt liegt in `orb-studio/`.
- Der aktuelle `README.md` in `orb-studio/` ist noch der Standard-Vite-Template-Text.
- Orb-Studio ist ein eigenständiges Autorentool, das Orb-Configs erzeugt (JSON) und diese für andere Projekte bereitstellt.

Aufgabe:
1. Analysiere die aktuelle Struktur von `orb-studio/` (src/core, src/ui, src/state etc.).
2. Erstelle einen neuen, projektspezifischen `README.md` in `orb-studio/` mit:
   - Kurzbeschreibung (2–3 Sätze), was Orb-Studio ist.
   - Tech-Stack: React, Vite, TypeScript, Three.js, Zustand.
   - Setup-Anleitung:
     - Voraussetzungen (Node-Version, empfohlener Paketmanager).
     - Installationsschritte (z. B. `pnpm install` oder `npm install`).
     - Start (`dev`), Build (`build`) und optional `preview`-Befehl.
   - Aktueller Status:
     - Ein Orb, einfache Controls, noch kein Preset-Management und kein Export/Import.
3. Prüfe die Ordnerstruktur grob:
   - `core/` für Engine, Shader, Config.
   - `state/` für Stores.
   - `ui/` für Layout, Controls, Common-Komponenten.
   - Falls etwas grob unlogisch ist, schlage eine minimal-intrusive Umstrukturierung vor und führe sie durch (z. B. Datei verschieben, Benennung klarer machen).

Anforderungen:
- Keine Dummy-Texte, keine generischen Vite-Verweise.
- README soll realistisch den IST-Zustand widerspiegeln, nicht Wunschdenken.
- Der Code muss danach weiter builden; verschobene Dateien müssen mit angepassten Imports funktionieren.


---

Phase 2 – Orb-Config-Spezifikation v1 definieren

Ziel: Ein klares, externes Config-Schema, das später von anderen Projekten konsumiert werden kann.
Trennung zwischen interner und externer Config.

Prompt – Phase 2 (Config-Spezifikation & interne/externe Typen)

Du bist ein Senior-TypeScript-Architekt mit Fokus auf stabile Datenmodelle.

Kontext:
- In `orb-studio/src/core/OrbConfig.ts` gibt es bereits ein recht umfangreiches Config-Interface und ein `DEFAULT_ORB_CONFIG`.
- Viele Felder sind Vision, aber das Shader-/Uniform-System nutzt aktuell nur einen kleinen Teil davon.
- Orb-Studio soll Orb-Configs als JSON exportieren, die von anderen Projekten konsumiert werden.

Aufgabe:
1. Definiere zwei klar getrennte Typen:
   - `OrbConfigInternal`: vollständige Struktur, die intern im Tool genutzt wird (inkl. UI-relevanter Infos, Defaults etc.).
   - `OrbConfigExternalV1`: das offizielle, externe JSON-Format, das exportiert werden darf (clean, minimal, versioniert).
2. Lege für `OrbConfigExternalV1` eine sinnvolle Struktur fest:
   - Pflichtfelder:
     - `id: string`
     - `name: string`
     - `version: 1`
     - `rendering`: Objekt mit Feldern wie `baseRadius`, `colors`, `rotation`, optional `noise`, `glow`, `details`.
   - Optionalfelder:
     - `meta?: { description?: string; tags?: string[] }`
3. Implementiere in `OrbConfig.ts`:
   - Die beiden Interfaces (`OrbConfigInternal` und `OrbConfigExternalV1`).
   - Einen internen Default (`DEFAULT_ORB_CONFIG: OrbConfigInternal`), der sinnvoll befüllt ist.
4. Erstelle eine Mapping-Funktion:
   - `toExternalConfig(config: OrbConfigInternal): OrbConfigExternalV1`
   - Diese Funktion soll:
     - Nur Felder einbeziehen, die wirklich relevant sind und ins externe Schema gehören.
     - `version` immer auf `1` setzen.
5. Lege eine neue Datei `docs/orb-config-spec.md` an:
   - Beschreibe dort in normalem Markdown:
     - Zweck des Formats.
     - Die Struktur von `OrbConfigExternalV1` (inkl. Erklärung der Felder).
     - Ein konkretes JSON-Beispiel.

Anforderungen:
- Kein toter Ballast: Wenn Felder im externen Schema keine klare Verwendung haben, lass sie weg oder markiere sie als optional mit klarer Bedeutung.
- Die interne Struktur darf ausführlicher sein, aber die externe muss stabil und verständlich sein.
- Stelle sicher, dass der bestehende Code noch kompiliert, und passe ggf. Importe/Verwendungen von `OrbConfig` an.


---

Phase 3 – Mapping + Export-UI

Ziel: Aus der internen Config ein externes JSON machen und dieses in der UI exportierbar machen (Copy / Download).

Prompt – Phase 3 (Export-Funktionalität & UI)

Du bist ein Senior-Frontend-Engineer mit Praxis in Tools / Editor-UIs.

Kontext:
- Es gibt nun in `src/core/OrbConfig.ts` die Typen `OrbConfigInternal` und `OrbConfigExternalV1` sowie eine Funktion `toExternalConfig`.
- Orb-Studio verwaltet aktuell eine einzelne Orb-Config über Zustand (`useOrbStore`).
- Ziel: Einen Export-Workflow bauen, der die aktuelle Orb-Config als JSON nach außen gibt.

Aufgabe:
1. Implementiere in `src/core/OrbConfig.ts` zusätzlich eine Hilfsfunktion:
   - `exportOrbConfigToJson(config: OrbConfigInternal): string`
   - Diese Funktion soll:
     - `toExternalConfig` verwenden.
     - Das Ergebnis mit `JSON.stringify(config, null, 2)` formatieren.
2. Erweitere die UI:
   - Füge in der Sidebar (z. B. im oberen Bereich unter dem Titel „Orb Studio“ oder in einem separaten Panel) einen Bereich „Export“ hinzu.
   - Dieser Bereich enthält:
     - Einen Button „Copy JSON“:
       - Kopiert die JSON-Repräsentation der aktuellen Orb (basierend auf `exportOrbConfigToJson`) in die Zwischenablage.
       - Zeigt eine kurze visuelle Rückmeldung (z. B. „Config kopiert“).
     - Optional: Einen Button „Download JSON“:
       - Erzeugt eine Datei `orb-config.json` mit dem JSON-Inhalt und triggert den Download.
3. Wo nötig:
   - Nutze den bestehenden Zustand (`useOrbStore`), um die aktive Orb-Config abzugreifen.
   - Implementiere die Clipboard-/Download-Logik sauber in React/TS.

Anforderungen:
- Keine TODO-Kommentare, keine Platzhalter-Komponenten.
- UI darf schlicht sein, aber klar benannt („Export“, „Copy JSON“).
- Stelle sicher, dass Fehler (z. B. Clipboard nicht verfügbar) zumindest geloggt werden und nicht zu einem Crash führen.
- Der Build muss danach weiterhin fehlerfrei laufen.


---

Phase 4 – Multi-Orb-Verwaltung („Studio“ statt Demo)

Ziel: Mehrere Orbs verwalten, zwischen ihnen wechseln, neue anlegen, duplizieren, löschen.
Das ist der Schritt vom „Playground“ hin zu einem echten Studio.

Prompt – Phase 4 (Multi-Orb-State & Sidebar-Liste)

Du bist ein Senior-Frontend-Engineer mit Erfahrung in Tools, die mehrere Entities verwalten (Presets, Assets etc.).

Kontext:
- Orb-Studio hat aktuell genau eine Orb-Config, die über `useOrbStore` verwaltet wird.
- Ziel ist es, mehrere Orbs verwalten zu können (ähnlich wie Presets):
  - Liste aller Orbs
  - aktive Orb
  - Aktionen: Neu, Duplizieren, Löschen

Aufgabe:
1. Erweitere den Zustand in `src/state/useOrbStore.ts`:
   - Statt nur einer einzelnen `config` soll es geben:
     - `orbs: OrbConfigInternal[]`
     - `activeOrbId: string`
   - Implementiere Aktionen:
     - `createOrb(initial?: Partial<OrbConfigInternal>): void`
     - `duplicateOrb(id: string): void`
     - `deleteOrb(id: string): void`
     - `setActiveOrb(id: string): void`
     - `updateActiveOrb(partial: Partial<OrbConfigInternal> | ((prev: OrbConfigInternal) => Partial<OrbConfigInternal>)): void`
   - Sorge dafür, dass es immer mindestens eine aktive Orb gibt (Fallback, falls man die letzte löscht).
2. Passe alle bisherigen Stellen an, die bisher nur mit einer einzelnen `config` gearbeitet haben (z. B. `App.tsx`, Panels):
   - Sie sollen mit der aktiven Orb arbeiten (basierend auf `activeOrbId`).
3. Erweitere die Sidebar-UI:
   - Erstelle einen Abschnitt „Orbs“ oben in der Sidebar.
   - Zeige dort eine Liste der vorhandenen Orbs mit Name/Label.
   - Markiere die aktive Orb klar.
   - Fü­ge Buttons hinzu:
     - „Neu“ → `createOrb()` mit einer sinnvollen Default-Config.
     - „Duplizieren“ → dupliziert die aktive Orb.
     - „Löschen“ → löscht die aktive Orb mit Schutz (z. B. keine Löschung, wenn nur eine Orb existiert).
4. Aktualisiere bei Bedarf `OrbConfigInternal`, damit jede Orb eine eindeutige `id` und einen `name`/`label` besitzt.

Anforderungen:
- State-Änderung muss strikt typisiert sein, keine any-Hacks.
- Refaktor so, dass der Code weiterhin verständlich bleibt; keine Inline-Monsterfunktionen.
- Alle bestehenden Funktionalitäten (Rendering, Slider, ColorPicker) müssen mit der aktiven Orb weiter funktionieren.


---

Phase 5 – Persistenz (Orbs über Reload hinweg speichern)

Ziel: Orbs nicht bei jedem Seite-Reload verlieren, sondern lokal speichern (LocalStorage reicht als MVP).

Prompt – Phase 5 (Persistenz mit LocalStorage)

Du bist ein pragmatischer Senior-Frontend-Entwickler mit Erfahrung in State-Persistenz.

Kontext:
- In `useOrbStore` gibt es jetzt mehrere Orbs und eine aktive Orb-ID.
- Bisher ist der State rein in-memory; ein Reload der Seite löscht alle Konfigurationen.
- Ziel: Orbs und aktive Orb-ID lokal im Browser speichern (LocalStorage als MVP).

Aufgabe:
1. Implementiere Persistenz in `useOrbStore`:
   - Beim Initialisieren des Stores:
     - Lies aus `localStorage` einen Eintrag wie `orbStudioState` (oder ähnlicher Key).
     - Wenn vorhanden und gültig:
       - Nutze diese Daten als Startzustand (Orbs + activeOrbId).
     - Wenn nicht vorhanden:
       - Lege einen Default-Zustand mit genau einer Orb (basierend auf `DEFAULT_ORB_CONFIG`) an.
   - Bei jeder relevanten State-Änderung (Orbs und activeOrbId):
     - Schreibe den aktuellen Zustand debounced (z. B. mit 500–1000 ms Verzögerung) zurück in `localStorage`.
2. Implementiere eine robuste Serialisierung:
   - Arbeite mit `JSON.stringify` / `JSON.parse`.
   - Prüfe bei der Initialisierung, ob die Datenform grob mit dem erwarteten Format übereinstimmt (oder fail-safes, falls corrupt).
3. Achte darauf:
   - Keine unnötige Persistenz von reinen UI-Transienten (z. B. offene Panels, temporäre Messages).
   - Nur das, was wirklich den Orb-Zustand repräsentiert, soll landen.

Anforderungen:
- Kein Crash, falls `localStorage` nicht verfügbar ist (z. B. SSR oder strikte Browser-Settings) – in diesem Fall einfach ohne Persistenz laufen.
- Der Code muss klar verständlich bleiben; verzichte auf komplexe Abstraktion für diesen einfachen Persistenzbedarf.


---

Phase 6 – Shader & Uniforms an Config-Schema anpassen

Ziel: Der Shader soll tatsächlich Teile der Config nutzen (Noise, Glow, Details), statt nur zwei Farben.
Die Orb reagiert sichtbar auf die Parameter.

Prompt – Phase 6 (Shader- und Uniform-Erweiterung)

Du bist ein erfahrener Three.js-/GLSL-Entwickler mit Sinn für pragmatische, aber wirkungsvolle Effekte.

Kontext:
- In `src/core/shader/orb.vert.glsl.ts` und `orb.frag.glsl.ts` existiert bereits ein sehr simpler Shader für eine Kugel mit Farbverlauf.
- In `src/core/mapping/configToUniforms.ts` gibt es aktuell nur wenige Uniforms (`u_colorInner`, `u_colorOuter`, `u_gradientBias`, `u_time`).
- `OrbConfigInternal` und `OrbConfigExternalV1` enthalten Parameter für:
  - Farben
  - Rotation
  - Optional: Noise, Glow, Details (Bands, Schärfe, Dichte)

Ziel:
- Mehrere dieser Parameter sollen tatsächlich in Shader und Uniforms eine sichtbare Rolle spielen.
- Die Orb soll sich deutlich verändern, wenn ich z. B. Noise-/Glow-/Band-Parameter verändere.

Aufgabe:
1. Erweitere `OrbUniforms` in `configToUniforms.ts`:
   - Ergänze Uniforms für:
     - Noise (z. B. `u_noiseScale`, `u_noiseIntensity`, `u_noiseSpeed`, `u_noiseDetail`).
     - Glow (z. B. `u_glowIntensity`, `u_glowRadius`, `u_glowThreshold`).
     - Details (z. B. `u_bandCount`, `u_bandSharpness`, `u_particleDensity` – sofern sinnvoll).
2. Passe `createOrbUniforms(config)` und `updateOrbUniforms(uniforms, config)` an:
   - Mappe die relevanten Felder aus `OrbConfigInternal` konsistent auf diese Uniforms.
3. Erweitere `orb.frag.glsl.ts`:
   - Baue Noise-basierte Verzerrung ein (z. B. einfache fbm-/Noise-Funktion oder Fake-Noise), die von `u_noise*` beeinflusst wird.
   - Implementiere Bänder/Linien entlang der Kugel (z. B. abhängig von `u_bandCount`, `u_bandSharpness`) und mische sie in die Farbe.
   - Implementiere einen einfachen Glow-/Fresnel-Effekt, der von `u_glow*` gesteuert wird.
4. Achte darauf, dass:
   - Der Shader kompiliert.
   - Die Uniforms exakt mit den Namen aus TypeScript übereinstimmen.
   - Die Performance für eine einzelne Kugel in einem Frontend-Tool ausreichend ist (kein übertriebener Shader-Ballast).

Anforderungen:
- Keine ultraspezialisierten Shader-Tricks, die das Ding unwartbar machen.
- Die visuelle Veränderung der Orb muss klar erkennbar sein, wenn ich in der späteren UI die entsprechenden Slider bewege.
- Kommentiere zentrale Stellen im Fragment-Shader kurz und verständlich.


---

Phase 7 – Studio-UX und Qualität

Ziel: Die UI soll sich wie ein kleines Studio anfühlen, nicht wie eine Testseite.
Klare Sektionen, ein wenig UX-Politur, aber ohne Overkill.

Prompt – Phase 7 (UX-Verbesserungen & Strukturierung)

Du bist ein Senior-UX-orientierter Frontend-Entwickler, der Tools ergonomisch macht.

Kontext:
- Orb-Studio hat inzwischen:
  - Mehrere Orbs im Zustand (Liste, aktive Orb).
  - Panels für Look/Motion.
  - Export-Bereich (JSON).
  - Persistenz.
- Die Sidebar ist funktional, aber optisch und strukturell noch sehr roh.

Ziel:
- Die Sidebar soll klar in Segmente gegliedert sein:
  - „Orbs“ (Liste + Management)
  - „Look“ (Farben, Gradienten, ggf. Glow/Details)
  - „Motion“ (Rotation, Animation)
  - „Export“ (JSON-Export)
- Das Ganze soll aufgeräumt, ohne visuelle Überladung sein.

Aufgabe:
1. Überarbeite die Struktur der Sidebar-Komponenten (z. B. in `src/ui/layout/Shell.tsx` und den Panels):
   - Füge klare Sektionstitel hinzu (z. B. mit kleinen Headings).
   - Sorge für konsistente Abstände, Padding und Reihenfolge.
2. Passe CSS/Styles (`Shell.css`, ggf. weitere) an:
   - Fokus: gute Lesbarkeit, klare Trennung der Bereiche, trotzdem kompakt.
   - Keine extremen „Dribbble-Spielereien“, sondern Tool-Optik.
3. Stelle sicher, dass:
   - Es visuell klar ist, wo man Orbs verwaltet, wo man Look/Motion einstellt und wo Export ist.
   - Die Titel der Panels die Funktion widerspiegeln (z. B. „Look“, nicht „Panel 1“ etc.).

Anforderungen:
- Keine neuen Dependencies für UI-Frameworks einführen (kein MUI, kein Chakra, etc.).
- Style-Anpassungen sollen im bestehenden CSS-System bleiben.
- Achte darauf, dass die UI auf kleineren Viewports noch sinnvoll bedienbar bleibt.


---

Phase 8 – Dokumentation & Beispiele

Ziel: Konkrete Beispiel-Orbs und verständliche Doku, wie die Configs verwendet werden können.
Das ist die Basis, um das Tool später mit anderen Projekten ernsthaft zu nutzen.

Prompt – Phase 8 (Beispiel-Configs & Doku-Erweiterung)

Du bist ein Senior-Engineer, der Wert auf nachvollziehbare Doku und Beispiele legt.

Kontext:
- Orb-Studio kann jetzt Orbs verwalten, exportieren und persistieren.
- Es existiert `docs/orb-config-spec.md` mit dem Schema von `OrbConfigExternalV1`.

Ziel:
- Einige Beispiel-Orb-Configs erstellen, die realistisch aussehen und sich unterscheiden.
- Die Doku so erweitern, dass klar wird, wie man diese JSON-Configs in anderen Projekten nutzt.

Aufgabe:
1. Lege im Projekt einen neuen Ordner `examples/` an.
2. Erstelle darin mindestens 3 Beispiel-Configs als JSON-Dateien, z. B.:
   - `core_red_blue_plasma.json`
   - `calm_soft_purple_glow.json`
   - `tech_cyan_grid_orb.json`
   - Jede Datei soll:
     - Eine gültige `OrbConfigExternalV1` enthalten.
     - Von der Struktur und den Werten her so sein, dass sie realistisch und stabil aussehen.
3. Ergänze `docs/orb-config-spec.md`:
   - Abschnitt „Beispiele“:
     - Beschreibe kurz die Beispiel-Orbs.
     - Verweise auf die JSON-Dateien im Ordner `examples/`.
   - Abschnitt „Verwendung in anderen Projekten“:
     - Erkläre knapp, wie ein anderes Projekt typischerweise vorgeht:
       - JSON laden
       - In eigenes Rendering-/Shader-System mappen
       - Hinweis, dass nur das JSON-Format „offiziell“ ist, nicht die Implementierungsdetails von Orb-Studio.
4. Ergänze den `README.md` in `orb-studio/`:
   - Kurzer Abschnitt „Beispiel-Orbs“, der auf `examples/` und `docs/orb-config-spec.md` verweist.

Anforderungen:
- Keine Fake-Beispiele mit offensichtlichem Unsinn (z. B. negative Radii, absurde Werte).
- Die JSON-Dateien müssen syntaktisch korrekt sein.
- Beschreibungen kurz, aber technisch korrekt.


---

Phase 9 – Optionale spätere Integration in andere Projekte

Ziel: Orb-Studio bleibt unabhängig, aber es gibt eine klare Richtung, wie andere Projekte die Configs nutzen.
Das ist optional und später dran, aber du kannst dir die Brücke schon vorbereiten.

Prompt – Phase 9 (Integrations-Skizze, optional)

Du bist ein Senior-Engineer, der saubere Integration ohne Tight Coupling mag.

Kontext:
- Orb-Studio existiert als eigenständiges Tool.
- Es gibt exportierte `OrbConfigExternalV1`-JSON-Dateien in `examples/`.
- Andere Projekte (z. B. Disa) sollen diese JSON-Files konsumieren können, ohne Orb-Studio-Code direkt zu verwenden.

Ziel:
- Eine klare, einfache Integrations-Skizze erstellen, wie ein beliebiges Projekt eine Orb-Config laden und darstellen kann.

Aufgabe:
1. Lege ein neues Dokument `docs/integration-guide.md` an.
2. Beschreibe darin:
   - Das Grundprinzip:
     - Orb-Studio als Authoring-Tool.
     - Andere Projekte laden JSON-Configs.
   - Ein generisches Beispiel (kein projektspezifischer Code):
     - Pseudocode oder TypeScript-Snippet, das:
       - Eine Orb-Config aus JSON lädt.
       - Diese auf ein eigenes Rendering-/Shader-System mappt.
   - Hinweise zur Versionierung:
     - Was bedeutet `version: 1`?
     - Wie man in Zukunft mit `version: 2` etc. umgehen würde.
3. Optional: Skizziere, wie man in einem anderen React/Three.js-Projekt eine einfache „OrbRenderer“-Komponente bauen würde, die eine `OrbConfigExternalV1` entgegennimmt und darstellt, ohne Abhängigkeit auf `orb-studio`-internen Code.

Anforderungen:
- Keine echten Implementierungen für andere Projekte schreiben, sondern nur generische Beispiele.
- Der Guide soll mir später helfen, ohne Nachdenken eine Integration umzusetzen, wenn ich es wirklich brauche.


---
