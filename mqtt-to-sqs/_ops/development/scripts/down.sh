#!/usr/bin/env bash
set -euo pipefail

# Basic path elements definition.

readonly FILE_PATH="$(realpath ${BASH_SOURCE})"
readonly CURRENT_DIR="$(dirname ${FILE_PATH})"
readonly OPS_DIRECTORY="$(realpath ${CURRENT_DIR}/..)"

docker compose -f "${OPS_DIRECTORY}"/docker-compose.yml -p "mqtt-to-sqs" down

echo ""
echo "Project 'mqtt-to-sqs' shutdown."
