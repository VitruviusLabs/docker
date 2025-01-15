#!/usr/bin/env bash
set -euo pipefail

# Basic path elements definition.

readonly FILE_PATH="$(realpath ${BASH_SOURCE})"
readonly CURRENT_DIR="$(dirname ${FILE_PATH})"
readonly PRODUCTION_DIRECTORY="$(realpath ${CURRENT_DIR}/..)"
readonly OPS_DIRECTORY="$(realpath ${PRODUCTION_DIRECTORY}/..)"
readonly ROOT_DIRECTORY="$(realpath ${OPS_DIRECTORY}/..)"
readonly APP_DIRECTORY="${ROOT_DIRECTORY}/app"
readonly PACKAGE_JSON_PATH="${APP_DIRECTORY}/package.json"
readonly DOCKER_FILE_PATH="${PRODUCTION_DIRECTORY}/services/core/Dockerfile"

image=""

while [[ "$#" -gt 0 ]]; do
    case $1 in
        -d|--image) image="$2"; shift ;;
        *) echo "Unknown parameter passed: $1"; exit 1 ;;
    esac
    shift
done

if [[ -z "${image}" ]]; then
  echo "Error: image name not provided."
  exit 1
fi

readonly IMAGE_NAME_PREFIX="${image}"

if ! [[ -f "${PACKAGE_JSON_PATH}" ]]; then
  echo "Error: package.json not found at ${PACKAGE_JSON_PATH}."
  exit 1
fi

if ! [[ -f "${DOCKER_FILE_PATH}" ]]; then
  echo "Error: Dockerfile not found at ${DOCKER_FILE_PATH}."
  exit 1
fi

readonly PACKAGE_VERSION=$(cat "${PACKAGE_JSON_PATH}" | grep version | cut -f4 -d'"')

echo "Building Docker image for backend service with version ${PACKAGE_VERSION}."

# Docker image build.

readonly IMAGE_NAME="${IMAGE_NAME_PREFIX}"
readonly IMAGE_TAG="${PACKAGE_VERSION}"
readonly IMAGE_FULL_NAME="${IMAGE_NAME}:${IMAGE_TAG}"

echo "Building Docker image ${IMAGE_FULL_NAME}."

docker buildx build -f "${DOCKER_FILE_PATH}" --tag "${IMAGE_FULL_NAME}" "${ROOT_DIRECTORY}" --platform linux/amd64

echo "Tagging Docker image ${IMAGE_FULL_NAME} as latest."

docker tag "${IMAGE_FULL_NAME}" "${IMAGE_NAME}:latest"

echo "Docker image ${IMAGE_FULL_NAME} built successfully."
