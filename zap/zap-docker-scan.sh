#!/usr/bin/env bash
# Simple wrapper to run OWASP ZAP baseline + API scan using Docker
# Requires Docker installed.

TARGET=${1:-http://host.docker.internal:3000}
OUTPUT_DIR=${2:-./zap-report}
mkdir -p "$OUTPUT_DIR"

# Baseline scan
docker run --rm -v $(pwd):/zap/wrk/:rw -t owasp/zap2docker-stable zap-baseline.py -t $TARGET -r "$OUTPUT_DIR/baseline.html"

# If you have an OpenAPI spec, run API scan
# docker run --rm -v $(pwd):/zap/wrk/:rw -t owasp/zap2docker-stable zap-api-scan.py -t $TARGET/openapi.json -f openapi -r "$OUTPUT_DIR/api-scan.html"

echo "Reports available in $OUTPUT_DIR"
