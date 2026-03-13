#!/usr/bin/env bash
# Run the KCR site test suite against the local dev server.
# Usage: ./tests/run-tests.sh [base_url]
# Default: http://localhost:8081
set -euo pipefail

BASE_URL="${1:-http://localhost:8081}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"

# Detect if we need to use Docker to get Python
if command -v python3 &>/dev/null; then
  python3 "$SCRIPT_DIR/test_site.py" "$BASE_URL"
else
  # Fall back to Docker
  MSYS_NO_PATHCONV=1 docker run --rm \
    -v "$REPO_DIR:/work" \
    --add-host=host.docker.internal:host-gateway \
    python:3-alpine python3 /work/tests/test_site.py "$BASE_URL"
fi
