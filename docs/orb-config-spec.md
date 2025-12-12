# Orb Config Specification (V1)

## Zweck
Dieses Dokument beschreibt das **externe JSON-Format** für Orbs, das von Orb-Studio exportiert wird.
Ziel ist es, Orbs als reine Datenstruktur zu definieren, die unabhängig von der Orb-Studio-Implementierung in anderen Anwendungen (z. B. Disa, Websites, Games) geladen und gerendert werden können.

## Format: `OrbConfigExternalV1`

Das Format ist stabil und versioniert.

### Felder

| Feld | Typ | Pflicht? | Beschreibung |
|---|---|---|---|
| `id` | string | Ja | Eindeutige ID der Orb (UUID oder Slug). |
| `name` | string | Ja | Anzeigename der Orb. |
| `version` | number | Ja | Muss `1` sein. |
| `rendering` | Object | Ja | Enthält alle visuellen Parameter. |
| `rendering.baseRadius` | number | Ja | Basisradius der Kugel (typisch 0.1 - 1.0). |
| `rendering.colors` | Object | Ja | Farbdefinitionen. |
| `rendering.rotation` | Object | Ja | Rotationsparameter. |
| `rendering.noise` | Object | Optional | Parameter für Noise-Verzerrung. |
| `rendering.glow` | Object | Optional | Parameter für Glow/Fresnel. |
| `rendering.details` | Object | Optional | Parameter für Bänder/Details. |
| `meta` | Object | Optional | Metadaten (Tags, Beschreibung). |

### Beispiel (JSON)

```json
{
  "id": "demo-orb-01",
  "name": "Plasma Burst",
  "version": 1,
  "rendering": {
    "baseRadius": 0.5,
    "colors": {
      "inner": "#ff0000",
      "outer": "#0000ff",
      "accent": "#ffff00",
      "background": "#000000",
      "gradientBias": 0.6
    },
    "rotation": {
      "xSpeed": 0.5,
      "ySpeed": 0.2
    },
    "noise": {
      "scale": 2.0,
      "intensity": 0.8,
      "speed": 0.5,
      "detail": 0.4
    },
    "glow": {
      "intensity": 0.7,
      "radius": 0.6,
      "threshold": 0.2
    },
    "details": {
      "bandCount": 10,
      "bandSharpness": 0.8,
      "particleDensity": 0.1
    }
  },
  "meta": {
    "description": "A vibrant plasma orb.",
    "tags": ["energy", "red", "blue"]
  }
}
```
