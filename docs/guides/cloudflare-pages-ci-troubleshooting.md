# Cloudflare Pages CI Deployment - Troubleshooting Guide

**Problem:** Authentication error [code: 10000] bei Cloudflare Pages Deploy  
**Kontext:** CI-Deploy mit Wrangler zu Cloudflare Pages  
**Account ID:** a279ad14be9df28106687cba845e2158  
**Projekt:** orb-studio  

---

## 🔍 Diagnose (Code 10000)

**Fehlercode 10000** bedeutet "Authentication error" bei Cloudflare und tritt auf, wenn:

1. **Token ungültig:** Der API-Token existiert nicht, ist abgelaufen oder wurde widerrufen.
2. **Fehlende Scopes:** Der Token hat nicht die erforderlichen Permissions für Cloudflare Pages (`Cloudflare Pages:Edit`).
3. **Falscher Account Scope:** Der Token ist für einen anderen Account erstellt oder das Projekt existiert nicht im angegebenen Account.

**Wahrscheinlichste Ursache:** Der Token hat nicht die benötigten **Cloudflare Pages**-Scopes. Standard API-Tokens haben oft nur Worker-Permissions, aber Pages benötigt explizit `Cloudflare Pages:Edit` Permission.

**Diagnose für orb-studio:** Das Projekt existiert vermutlich im Dashboard, aber der Token hat entweder (a) keine Pages-Permission oder (b) ist für "All accounts" statt für den spezifischen Account `a279ad14be9df28106687cba845e2158` erstellt.

---

## ✅ Fix: Token Scopes & Resources

### Token-Erstellung im Cloudflare Dashboard

1. **Gehe zu:** https://dash.cloudflare.com/profile/api-tokens
2. **Klick:** "Create Token"
3. **Wähle:** "Create Custom Token" (NICHT "Edit Cloudflare Workers" Template)

### Erforderliche Permissions (exakt wie im Dashboard)

| Permission | Resource | Zugriff |
|------------|----------|---------|
| **Cloudflare Pages** | *(Dropdown "Cloudflare Pages")* | **Edit** |
| **Account** | *(Optional, für Account-Info)* | **Read** |

**Wichtig:**
- **Cloudflare Pages:Edit** ist die **EINZIGE** zwingend erforderliche Permission
- **NICHT** "Workers Scripts:Edit" verwenden (das ist für Workers, nicht Pages)
- **NICHT** "Workers KV:Edit" - ist nicht nötig für Pages

### Account Resources

**Option 1 (Empfohlen):**
- **Account Resources:** Wähle "Specific account"
- **Account:** Wähle den Account mit ID `a279ad14be9df28106687cba845e2158`

**Option 2 (Alternative, weniger sicher):**
- **Account Resources:** "All accounts"
- **Nachteil:** Token hat Zugriff auf alle Accounts

### Zone Resources

- **Zone Resources:** Setze auf "All zones" ODER "Specific zone"
- **Für Pages:** Meist egal, da Pages Account-basiert ist, nicht Zone-basiert
- **Empfehlung:** "All zones" für Einfachheit

### Client IP Address Filtering (Optional)

- **Empfehlung für CI:** Leer lassen (keine IP-Beschränkung)
- **Grund:** GitHub Actions IPs ändern sich
- **Alternative:** GitHub Actions IP-Ranges eintragen (komplex, nicht empfohlen)

### TTL (Time to Live)

- **Empfehlung:** "1 year" oder "Custom" mit langem Zeitraum
- **Wichtig:** Notiere Ablaufdatum im Kalender für Erneuerung

---

## 🔐 Fix: CI Environment Variables

### Erforderliche GitHub Secrets

Gehe zu: `https://github.com/<username>/Orb/settings/secrets/actions`

#### 1. CLOUDFLARE_API_TOKEN (PFLICHT)

```
Name:  CLOUDFLARE_API_TOKEN
Value: <dein-erstellter-token>
```

**Format:** `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` (40 Zeichen)

**Wie Wrangler es nutzt:**
- Wrangler liest automatisch `CLOUDFLARE_API_TOKEN` aus Environment
- Wird für alle API-Calls zu Cloudflare verwendet
- Authentifiziert gegen `/accounts/<ID>/pages/projects/<name>`

#### 2. CLOUDFLARE_ACCOUNT_ID (PFLICHT für Pages Action)

```
Name:  CLOUDFLARE_ACCOUNT_ID
Value: a279ad14be9df28106687cba845e2158
```

**Format:** 32-stellige Hex-ID

**Wie Wrangler es nutzt:**
- Bei `cloudflare/pages-action@v1` erforderlich
- Bei manuellem `wrangler pages deploy`: Optional (Token muss dann Account-spezifisch sein)
- Spezifiziert welcher Account das Projekt enthält

#### 3. GITHUB_TOKEN (Automatisch vorhanden)

```
# Keine Aktion nötig - wird von GitHub bereitgestellt
${{ secrets.GITHUB_TOKEN }}
```

**Zweck:** Für Deployment-Status-Updates im GitHub-UI

### Vollständige Workflow-Konfiguration

Dein `.github/workflows/deploy.yml` ist bereits korrekt konfiguriert:

```yaml
- name: Deploy to Cloudflare Pages
  uses: cloudflare/pages-action@v1
  with:
    apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
    projectName: orb-studio
    directory: app/dist
    gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

**Keine Änderung nötig** - nur Secrets müssen korrekt gesetzt sein.

---

## ✅ Optional: Verifikation

### Schritt 1: Token-Validierung (Vor Deploy)

Füge diesen Step **vor** dem Deploy-Step hinzu:

```yaml
- name: Verify Cloudflare Token & Project
  env:
    CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
  run: |
    npx wrangler pages project list
```

**Erwartetes Ergebnis bei korrektem Token:**
```
┌─────────────┬─────────────────────────────┬──────────────────────┐
│ Project     │ Deployment URL              │ Latest Production    │
├─────────────┼─────────────────────────────┼──────────────────────┤
│ orb-studio  │ orb-studio.pages.dev        │ <latest-deployment>  │
└─────────────┴─────────────────────────────┴──────────────────────┘
```

**Bei Fehler (falscher Token/Scopes):**
```
✘ [ERROR] Authentication error [code: 10000]
```

### Schritt 2: Projekt-Existenz prüfen

```yaml
- name: Check if Project Exists
  env:
    CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
  run: |
    npx wrangler pages project list | grep -q "orb-studio" || \
      (echo "❌ Project 'orb-studio' not found!" && exit 1)
```

**Zweck:** Stellt sicher, dass Projekt im Account existiert

### Schritt 3: Manuelle Verifikation (Lokal)

```bash
# 1. Token setzen
export CLOUDFLARE_API_TOKEN="dein-token-hier"
export CLOUDFLARE_ACCOUNT_ID="a279ad14be9df28106687cba845e2158"

# 2. Projekte auflisten
npx wrangler pages project list

# 3. Projekt-Details abrufen
npx wrangler pages project info orb-studio

# 4. Test-Deploy (Dry-Run)
npm run build
npx wrangler pages deploy app/dist --project-name orb-studio --branch preview
```

---

## 📋 Checkliste: Deployment-Fix

Arbeite diese Schritte ab:

- [ ] **Token erstellen** mit `Cloudflare Pages:Edit` Permission
- [ ] **Account spezifisch** auf `a279ad14be9df28106687cba845e2158` setzen
- [ ] **Token kopieren** (nur einmal sichtbar!)
- [ ] **GitHub Secret hinzufügen:** `CLOUDFLARE_API_TOKEN`
- [ ] **GitHub Secret hinzufügen:** `CLOUDFLARE_ACCOUNT_ID` = `a279ad14be9df28106687cba845e2158`
- [ ] **Verifikation (optional):** Verifikation-Step in Workflow hinzufügen
- [ ] **Test:** Push zu `main` Branch → Workflow beobachten
- [ ] **Erfolg prüfen:** Deploy sollte erfolgreich sein
- [ ] **Deployment-URL testen:** `https://orb-studio.pages.dev`

---

## 🚨 Häufige Fehler

### Fehler 1: "Project not found"

**Ursache:** Projekt `orb-studio` existiert nicht im Account

**Lösung:**
```bash
# Projekt erstellen
npx wrangler pages project create orb-studio

# Oder im Dashboard: Workers & Pages → Create → Pages → Project name: orb-studio
```

### Fehler 2: "Invalid account ID"

**Ursache:** `CLOUDFLARE_ACCOUNT_ID` ist falsch

**Lösung:**
```bash
# Account ID herausfinden
npx wrangler whoami

# Oder im Dashboard: URL bei "Workers & Pages" ansehen
# Format: https://dash.cloudflare.com/<ACCOUNT_ID>/workers-and-pages
```

### Fehler 3: "Token hat Workers-Permissions statt Pages"

**Symptome:** Token funktioniert für `wrangler deploy` (Workers) aber nicht für `wrangler pages deploy`

**Lösung:** Neuen Token erstellen mit **Cloudflare Pages:Edit** (nicht Workers)

### Fehler 4: "Token abgelaufen"

**Symptome:** Token funktionierte früher, jetzt nicht mehr

**Lösung:**
1. Im Dashboard prüfen: https://dash.cloudflare.com/profile/api-tokens
2. Token-Status ansehen (Active/Expired)
3. Neuen Token erstellen falls abgelaufen
4. GitHub Secret aktualisieren

---

## 🎯 Zusammenfassung

| Komponente | Wert |
|------------|------|
| **Token Permission** | Cloudflare Pages:Edit |
| **Account Scope** | Specific: `a279ad14be9df28106687cba845e2158` |
| **Zone Scope** | All zones |
| **GitHub Secret 1** | `CLOUDFLARE_API_TOKEN` = `<dein-token>` |
| **GitHub Secret 2** | `CLOUDFLARE_ACCOUNT_ID` = `a279ad14be9df28106687cba845e2158` |
| **Projekt-Name** | `orb-studio` |
| **Deploy-Directory** | `app/dist` |
| **Verifikation Command** | `npx wrangler pages project list` |

---

## 📚 Weiterführende Links

- **Cloudflare Pages Docs:** https://developers.cloudflare.com/pages/
- **Wrangler Docs:** https://developers.cloudflare.com/workers/wrangler/
- **API Token Docs:** https://developers.cloudflare.com/fundamentals/api/get-started/create-token/
- **GitHub Actions Secrets:** https://docs.github.com/en/actions/security-guides/encrypted-secrets

---

**Status nach Fix:** ✅ CI sollte ohne Interaktion deployen können.
