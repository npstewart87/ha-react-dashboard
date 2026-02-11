#!/bin/bash
set -euo pipefail

# build-addon.sh — Build the HA React Dashboard addon
# This script:
#   1. Runs the main build (dashboard + server)
#   2. Copies the dist/ output into addon/dist/
#   3. Generates a minimal package.json for native deps (sharp)
#   4. Builds the Docker image using addon/Dockerfile

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$SCRIPT_DIR"
ADDON_DIR="$ROOT_DIR/addon"

echo "==> Step 1: Running main build (dashboard + server)..."
bash "$ROOT_DIR/scripts/build.sh"

echo "==> Step 2: Copying dist/ into addon/dist/..."
rm -rf "$ADDON_DIR/dist"
cp -r "$ROOT_DIR/dist" "$ADDON_DIR/dist"

echo "==> Step 3: Generating package.json for native dependencies..."
cat > "$ADDON_DIR/dist/package.json" <<'EOF'
{
  "name": "ha-react-dashboard-addon",
  "version": "0.0.1",
  "private": true,
  "dependencies": {
    "sharp": "^0.33.3"
  }
}
EOF

echo "==> Step 4: Building Docker image..."
ADDON_VERSION=$(grep '^version:' "$ADDON_DIR/config.yaml" | awk '{print $2}')
ADDON_SLUG=$(grep '^slug:' "$ADDON_DIR/config.yaml" | awk '{print $2}')

docker build \
  -t "local/${ADDON_SLUG}:${ADDON_VERSION}" \
  -t "local/${ADDON_SLUG}:latest" \
  "$ADDON_DIR"

echo ""
echo "==> Done! Addon image built:"
echo "    local/${ADDON_SLUG}:${ADDON_VERSION}"
echo "    local/${ADDON_SLUG}:latest"
echo ""
echo "    To test locally:  docker run --rm -p 8099:8099 local/${ADDON_SLUG}:latest"
