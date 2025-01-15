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

if ! [[ -f "${PACKAGE_JSON_PATH}" ]]; then
  echo "Error: package.json not found at ${PACKAGE_JSON_PATH}."
  exit 1
fi

readonly IMAGE_NAME="${image}"

readonly PACKAGE_VERSION=$(cat "${PACKAGE_JSON_PATH}" | grep version | cut -f4 -d'"')

readonly REPOSITORY_URI=$(aws ecr describe-repositories --query 'repositories[].repositoryUri' | grep "${IMAGE_NAME}" | cut -f2 -d'"')

aws ecr get-login-password | docker login --username AWS --password-stdin "${REPOSITORY_URI}"
docker tag "${IMAGE_NAME}:${PACKAGE_VERSION}" "${REPOSITORY_URI}:${PACKAGE_VERSION}"
docker tag "${IMAGE_NAME}:${PACKAGE_VERSION}" "${REPOSITORY_URI}:latest"

docker push "${REPOSITORY_URI}:${PACKAGE_VERSION}"
docker push "${REPOSITORY_URI}:latest"
