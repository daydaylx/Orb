#!/bin/bash
# Deployment Pre-flight Check Script
# Validates that the project is ready for Cloudflare Pages deployment

set -e

echo "🔍 Cloudflare Pages Deployment Pre-flight Check"
echo "================================================"
echo ""

# Check 1: Build output exists
echo "✓ Checking build output..."
if [ ! -d "app/dist" ]; then
    echo "❌ Error: app/dist directory does not exist"
    echo "   Run: npm run build"
    exit 1
fi

if [ ! -f "app/dist/index.html" ]; then
    echo "❌ Error: app/dist/index.html not found"
    echo "   Run: npm run build"
    exit 1
fi

echo "  ✓ Build output exists: app/dist/"
echo ""

# Check 2: wrangler.jsonc configuration
echo "✓ Checking wrangler.jsonc..."
if [ ! -f "wrangler.jsonc" ]; then
    echo "❌ Error: wrangler.jsonc not found"
    exit 1
fi

if ! grep -q "pages_build_output_dir" wrangler.jsonc; then
    echo "❌ Error: wrangler.jsonc missing pages_build_output_dir"
    exit 1
fi

if ! grep -q "app/dist" wrangler.jsonc; then
    echo "⚠️  Warning: pages_build_output_dir may not point to app/dist"
fi

echo "  ✓ Configuration valid"
echo ""

# Check 3: Verify it's a Pages project (not Workers)
echo "✓ Checking project type..."
if grep -q '"main"' wrangler.jsonc 2>/dev/null; then
    echo "❌ Error: wrangler.jsonc contains 'main' (Workers config)"
    echo "   This is a Pages project, not a Workers project"
    exit 1
fi

echo "  ✓ Configured for Cloudflare Pages"
echo ""

# Check 4: Node modules
echo "✓ Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "⚠️  Warning: node_modules not found. Run: npm ci"
else
    echo "  ✓ Dependencies installed"
fi
echo ""

# Summary
echo "================================================"
echo "✅ All checks passed!"
echo ""
echo "Ready to deploy with:"
echo "  npx wrangler pages deploy app/dist --project-name orb-studio"
echo ""
echo "Or use GitHub Actions (automatic on push to main)"
