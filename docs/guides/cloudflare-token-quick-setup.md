# Cloudflare API Token - Quick Setup Guide

**Quick Reference für orb-studio Deployment**

---

## 🔐 Token erstellen (5 Minuten)

### Schritt 1: Dashboard öffnen
```
URL: https://dash.cloudflare.com/profile/api-tokens
```

### Schritt 2: Custom Token erstellen

1. **Klick:** "Create Token"
2. **Klick:** "Create Custom Token" (unten)

### Schritt 3: Token konfigurieren

| Feld | Wert |
|------|------|
| **Token name** | `GitHub Actions - Orb Studio Pages` |
| **Permissions** | `Cloudflare Pages` → `Edit` |
| **Account Resources** | `Specific account` → `(dein Account auswählen)` |
| **Zone Resources** | `All zones` |
| **Client IP Address Filtering** | *(leer lassen)* |
| **TTL** | `1 year` |

### Schritt 4: Token kopieren

⚠️ **WICHTIG:** Token wird nur EINMAL angezeigt!

```
Beispiel-Format: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Länge: 40 Zeichen
```

---

## 🔑 GitHub Secrets setzen (2 Minuten)

### URL
```
https://github.com/<username>/Orb/settings/secrets/actions
```

### Secret 1: CLOUDFLARE_API_TOKEN

```
Name:  CLOUDFLARE_API_TOKEN
Value: <token-aus-schritt-4>
```

### Secret 2: CLOUDFLARE_ACCOUNT_ID

```
Name:  CLOUDFLARE_ACCOUNT_ID
Value: a279ad14be9df28106687cba845e2158
```

**Account ID finden:**
- Im Cloudflare Dashboard: URL bei "Workers & Pages" ansehen
- Format: `https://dash.cloudflare.com/<ACCOUNT_ID>/workers-and-pages`
- Oder Command: `npx wrangler whoami`

---

## ✅ Testen (2 Minuten)

### Lokal testen (Optional)

```bash
# 1. Exportiere Tokens
export CLOUDFLARE_API_TOKEN="dein-token"
export CLOUDFLARE_ACCOUNT_ID="a279ad14be9df28106687cba845e2158"

# 2. Liste Projekte auf
npx wrangler pages project list

# Erwartetes Ergebnis:
# ✔ Zeigt "orb-studio" in der Liste
```

### CI testen

```bash
# 1. Commit & Push zu main
git add .
git commit -m "test: verify cloudflare deployment"
git push origin main

# 2. Workflow beobachten
# GitHub → Actions → "Deploy to Cloudflare Pages"

# Erwartetes Ergebnis:
# ✅ Alle Steps grün
# ✅ "Verify Cloudflare Token & Project" zeigt Projektliste
# ✅ "Deploy to Cloudflare Pages" erfolgreich
```

---

## 🎯 Minimal-Checkliste

- [ ] Token erstellt mit **Cloudflare Pages:Edit**
- [ ] Token kopiert (40 Zeichen)
- [ ] GitHub Secret `CLOUDFLARE_API_TOKEN` gesetzt
- [ ] GitHub Secret `CLOUDFLARE_ACCOUNT_ID` gesetzt
- [ ] Push zu `main` → Workflow läuft durch ✅

---

## 🔍 Troubleshooting

**Problem:** Token-Verifikation schlägt fehl

**Lösung:** Siehe [Vollständige Troubleshooting-Guide](cloudflare-pages-ci-troubleshooting.md)

**Häufigste Fehler:**
1. ❌ Token hat "Workers Scripts:Edit" statt "Cloudflare Pages:Edit"
2. ❌ Account Scope ist "All accounts" statt specific account
3. ❌ Projekt `orb-studio` existiert nicht im Account
4. ❌ Token ist abgelaufen

---

**Gesamtzeit:** ~10 Minuten  
**Erfolgsrate:** 99% wenn Schritte exakt befolgt werden
