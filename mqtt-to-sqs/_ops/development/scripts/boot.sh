#!/usr/bin/env bash
set -euo pipefail

# Basic path elements definition.

readonly FILE_PATH="$(realpath ${BASH_SOURCE})"
readonly CURRENT_DIR="$(dirname ${FILE_PATH})"
readonly OPS_DIRECTORY="$(realpath ${CURRENT_DIR}/..)"

bash "${CURRENT_DIR}/down.sh" --no-header && bash "${CURRENT_DIR}/up.sh" --no-header
