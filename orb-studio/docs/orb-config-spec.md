# Orb Config Specification V1

## Zweck
Dieses Dokument beschreibt das **Orb Config Format (Version 1)**.
Es dient als Schnittstelle zwischen **Orb-Studio** (Autorentool) und konsumierenden Anwendungen (z. B. Disa).

## Struktur
Die Konfiguration ist ein JSON-Objekt, das alle visuellen Parameter einer Orb definiert.

### `OrbConfigExternalV1`

| Feld | Typ | Beschreibung |
|---|---|---|
| `id` | `string` | Eindeutige ID der Orb. |
| `name` | `string` | Anzeigename der Orb. |
| `version` | `1` | Version des Config-Schemas. |
| `rendering` | `object` | Visuelle Parameter. |
| `meta` | `object` (optional) | Metadaten (Beschreibung, Tags). |

#### `rendering` Objekt

| Feld | Typ | Beschreibung |
|---|---|---|
| `baseRadius` | `number` | Grundradius der Kugel (0.1–1.0). |
| `colors` | `object` | Farbdefinitionen (`inner`, `outer`, `accent`, `background`, `gradientBias`). |
| `rotation` | `object` | Rotation (`xSpeed`, `ySpeed`). |
| `noise` | `object` (opt) | Noise-Effekte (`scale`, `intensity`, `speed`, `detail`). |
| `glow` | `object` (opt) | Glow-Effekte (`intensity`, `threshold`, `radius`). |
| `details` | `object` (opt) | Detail-Effekte (`bandCount`, `bandSharpness`, `particleDensity`). |

## JSON-Beispiel

```json
{
  "id": "my-orb-123",
  "name": "Plasma Orb",
  "version": 1,
  "rendering": {
    "baseRadius": 0.8,
    "colors": {
      "inner": "#ff0000",
      "outer": "#0000ff",
      "accent": "#ffff00",
      "background": "#000000",
      "gradientBias": 0.5
    },
    "rotation": {
      "xSpeed": 0.5,
      "ySpeed": 0.2
    },
    "noise": {
      "scale": 1.2,
      "intensity": 0.8,
      "speed": 0.1,
      "detail": 0.5
    },
    "glow": {
      "intensity": 0.6,
      "threshold": 0.2,
      "radius": 0.4
    },
    "details": {
      "bandCount": 3,
      "bandSharpness": 0.8,
      "particleDensity": 0.1
    }
  },
  "meta": {
    "description": "Ein Beispiel für eine Plasma-Orb.",
    "tags": ["plasma", "hot", "red"]
  }
}
```

## Beispiele & Verwendung

Im Ordner `examples/` befinden sich konkrete Beispiel-Konfigurationen:

*   `core_red_blue_plasma.json`: Ein energetischer Orb mit rotem Kern.
*   `calm_soft_purple_glow.json`: Ein sanfter, violetter Orb.
*   `tech_cyan_grid_orb.json`: Ein technischer Look mit scharfen Cyan-Bändern.

### Verwendung in anderen Projekten

Ein externes Projekt (z. B. Disa) geht wie folgt vor:

1.  **Laden:** Das JSON wird geladen (z. B. via `fetch` oder Import).
2.  **Mapping:** Die Werte aus dem `rendering`-Objekt werden auf das projektspezifische Shader- oder Partikelsystem übertragen.
    *   *Hinweis:* Nur das JSON-Format ist der Vertrag. Wie Orb-Studio intern rendert, ist Implementierungsdetail. Konsumierende Projekte müssen ihren eigenen Renderer bauen, der diese Parameter interpretiert.
3.  **Fallback:** Unbekannte Felder (z. B. neue Features in `version: 2`) sollten ignoriert werden; fehlende optionale Felder sollten sinnvolle Defaults haben.
