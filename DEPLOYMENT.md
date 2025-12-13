# Cloudflare Pages Deployment Guide

## Project Type: Static SPA (Vite)

This project is a **static single-page application** built with Vite and React. It uses **Cloudflare Pages** for hosting (not Cloudflare Workers).

---

## ✅ Correct Deployment Command

```bash
# Build the project first
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy app/dist --project-name orb-studio
```

---

## ❌ Common Mistake

**DO NOT USE:**
```bash
npx wrangler deploy  # ❌ This is for Workers, not Pages!
```

**Error you'll get:**
```
✘ [ERROR] Missing entry-point to Worker script or to assets directory
```

**Why this fails:**
- `wrangler deploy` is for **Cloudflare Workers** (serverless functions)
- Workers require an entry-point script (e.g., `worker.js`)
- This project has no Worker script - it's just static assets

---

## Technical Decision: Pages vs Workers

### Why Cloudflare Pages? ✅
- Project is a static SPA (HTML/CSS/JS only)
- No server-side logic needed
- Build output is static files in `app/dist/`
- Pages is optimized for static sites
- Cheaper and simpler than Workers

### Why NOT Workers? ❌
- Workers require entry-point script
- Workers + Assets is for hybrid apps (we're pure static)
- Unnecessary complexity for static content
- Would need additional configuration

---

## Configuration

The project includes `wrangler.jsonc` for Pages:

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/cloudflare/workers-sdk/main/schemas/wrangler.jsonc",
  "pages_build_output_dir": "app/dist"
}
```

This tells Wrangler that:
- This is a **Pages** project
- Build output is in `app/dist/`

---

## CI/CD (GitHub Actions)

The project uses `.github/workflows/deploy.yml` which correctly uses:

```yaml
- name: Deploy to Cloudflare Pages
  uses: cloudflare/pages-action@v1
  with:
    directory: app/dist
    projectName: orb-studio
```

This is the **recommended approach** for automated deployments.

---

## Manual Deployment Steps

### Prerequisites
```bash
# Install dependencies (if not already done)
npm ci

# Verify wrangler is available
npx wrangler --version
```

### Build & Deploy
```bash
# 1. Build the project (from root directory)
npm run build

# 2. Verify build output exists
ls -la app/dist/

# 3. Deploy to Cloudflare Pages
npx wrangler pages deploy app/dist --project-name orb-studio

# Optional: Deploy to specific branch
npx wrangler pages deploy app/dist --project-name orb-studio --branch preview
```

### First-time Setup
```bash
# Authenticate with Cloudflare (if not already done)
npx wrangler login

# Create the Pages project (if not already created via dashboard)
npx wrangler pages project create orb-studio
```

---

## Monorepo Context

This is an **npm workspace monorepo**:
- Root: `/` (workspace orchestrator)
- App: `/app` (Vite SPA)

**Important:** 
- Always run `npm run build` from **root** (uses workspace)
- Build output is in `app/dist/` (not root `dist/`)
- Deploy directory is always `app/dist/`

---

## Troubleshooting

### Error: "Missing entry-point to Worker script"
**Cause:** Using `wrangler deploy` instead of `wrangler pages deploy`  
**Fix:** Use `wrangler pages deploy app/dist --project-name orb-studio`

### Error: "Directory app/dist does not exist"
**Cause:** Project not built yet  
**Fix:** Run `npm run build` first

### Error: "Unknown project name"
**Cause:** Project not created in Cloudflare  
**Fix:** 
1. Go to https://dash.cloudflare.com/
2. Navigate to Pages
3. Create project named `orb-studio`
4. Or use: `npx wrangler pages project create orb-studio`

---

## Summary

| Aspect | Solution |
|--------|----------|
| **Platform** | Cloudflare Pages (not Workers) |
| **Build Command** | `npm run build` |
| **Output Directory** | `app/dist/` |
| **Deploy Command** | `npx wrangler pages deploy app/dist --project-name orb-studio` |
| **CI/CD** | GitHub Actions (already configured) |

---

## Quick Reference

```bash
# Complete deployment workflow
npm ci                                                                    # Install
npm run build                                                             # Build
npx wrangler pages deploy app/dist --project-name orb-studio             # Deploy
```

**That's it. Ready to commit and deploy. ✅**
