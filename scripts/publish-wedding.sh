#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
APP_DIR="$ROOT_DIR/wedding-invitation"
DIST_DIR="$APP_DIR/dist"

if [ ! -d "$DIST_DIR/assets" ] || [ ! -f "$DIST_DIR/index.html" ]; then
  echo "Missing $DIST_DIR. Run: (cd wedding-invitation && npm run build)"
  exit 1
fi

rm -rf "$APP_DIR/assets"
cp -R "$DIST_DIR/assets" "$APP_DIR/assets"

for icon in favicon.svg favicon.png; do
  if [ -f "$DIST_DIR/$icon" ]; then
    cp "$DIST_DIR/$icon" "$APP_DIR/$icon"
    cp "$DIST_DIR/$icon" "$APP_DIR/assets/$icon"
  fi
done

{
  printf '%s\n' '---' 'permalink: /wedding-invitation/' 'layout: null' '---'
  cat "$DIST_DIR/index.html"
} > "$ROOT_DIR/wedding-invitation.html"

if [ -d "$ROOT_DIR/_site" ]; then
  rm -rf "$ROOT_DIR/_site/wedding-invitation"
  mkdir -p "$ROOT_DIR/_site/wedding-invitation"
  cp -R "$DIST_DIR"/. "$ROOT_DIR/_site/wedding-invitation/"
fi

echo "Published wedding invitation to /wedding-invitation/"
