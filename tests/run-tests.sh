#!/usr/bin/env bash
# Run the KCR site test suite.
# Usage: ./tests/run-tests.sh [base_url]
# Default base_url: http://host.docker.internal:8081

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"
BASE_URL="${1:-http://host.docker.internal:8081}"

MSYS_NO_PATHCONV=1 docker run --rm \
  -v "$REPO_DIR:/work" \
  --add-host=host.docker.internal:host-gateway \
  python:3-alpine python3 /work/tests/test_site.py "$BASE_URL"
