#!/usr/bin/env bash
set -euo pipefail

# Basic path elements definition.

readonly FILE_PATH="$(realpath ${BASH_SOURCE})"
readonly CURRENT_DIR="$(dirname ${FILE_PATH})"
readonly SERVICE_DIRECTORY="$(realpath ${CURRENT_DIR}/..)"

if [[ ! -f "${SERVICE_DIRECTORY}"/.env ]]; then
  cp "${SERVICE_DIRECTORY}"/.env.example "${SERVICE_DIRECTORY}"/.env
fi
