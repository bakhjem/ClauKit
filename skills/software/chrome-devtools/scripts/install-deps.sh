#!/usr/bin/env bash
# Install Chrome system libraries required by Puppeteer on Linux/WSL.
# Safe to re-run.

set -e

if [[ "$(uname)" != "Linux" ]]; then
  echo "install-deps.sh is only needed on Linux/WSL. Skipping."
  exit 0
fi

if ! command -v apt-get >/dev/null 2>&1; then
  echo "Warning: this script targets apt-based distros (Debian/Ubuntu)."
  echo "For other distros, install Chrome dependencies manually."
  echo "See: https://pptr.dev/troubleshooting"
  exit 0
fi

SUDO=""
if [[ $EUID -ne 0 ]]; then
  if command -v sudo >/dev/null 2>&1; then
    SUDO="sudo"
  else
    echo "Error: need root or sudo to install system packages."
    exit 1
  fi
fi

echo "Installing Chrome system dependencies..."
$SUDO apt-get update
$SUDO apt-get install -y --no-install-recommends \
  ca-certificates \
  fonts-liberation \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libc6 \
  libcairo2 \
  libcups2 \
  libdbus-1-3 \
  libexpat1 \
  libfontconfig1 \
  libgbm1 \
  libgcc1 \
  libglib2.0-0 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libpango-1.0-0 \
  libpangocairo-1.0-0 \
  libstdc++6 \
  libx11-6 \
  libx11-xcb1 \
  libxcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxext6 \
  libxfixes3 \
  libxi6 \
  libxrandr2 \
  libxrender1 \
  libxss1 \
  libxtst6 \
  lsb-release \
  wget \
  xdg-utils

echo "Done. Chrome dependencies installed."
