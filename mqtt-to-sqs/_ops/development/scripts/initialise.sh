#!/usr/bin/env bash
set -euo pipefail

# Basic path elements definition.

readonly FILE_PATH="$(realpath ${BASH_SOURCE})"
readonly CURRENT_DIR="$(dirname ${FILE_PATH})"
readonly OPS_DIRECTORY="$(realpath ${CURRENT_DIR}/..)"

bash "${OPS_DIRECTORY}"/services/core/scripts/initialise.sh
bash "${OPS_DIRECTORY}"/services/core-postgresql/scripts/initialise.sh
