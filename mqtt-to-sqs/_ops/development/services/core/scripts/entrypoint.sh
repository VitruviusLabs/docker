#!/usr/bin/env bash
set -euo pipefail

function log() {
	local date_format="%Y-%m-%d_%T"
	local current_date="[$(date +${date_format})]"

	if [[ "$#" -eq 0 ]]; then

		echo "${current_date}: No argument to print."

	else

		echo "${current_date}: $@"

	fi
}

log "Checking environment..."

NOT_SET=false

if ! [[ -v MQTT_USERNAME ]]; then
  log "MQTT_USERNAME is not set"
  NOT_SET=true
fi

if ! [[ -v MQTT_PASSWORD ]]; then
  log "MQTT_PASSWORD is not set"
  NOT_SET=true
fi

if [ "$NOT_SET" = true ]; then
  log "Some environment variables are not set. Exiting..."
  exit 1
fi

log "Creating mosquitto password file"
echo "${MQTT_USERNAME}:${MQTT_PASSWORD}" > /home/mosquitto/configuration/passwd
log "Created mosquitto password file"

log "Registering MQTT passwd"
mosquitto_passwd -U /home/mosquitto/configuration/passwd
log "MQTT passwd registered"

mkdir -p /home/mosquitto/logs
touch /home/mosquitto/logs/mosquitto.log

log "Starting mosquitto"

mosquitto -d -c /home/mosquitto/configuration/mosquitto.conf

log "Mosquitto started"

log "Installing dependencies"

pnpm install

log "Dependencies installed"

log "Starting application"

{ tail -f /home/mosquitto/logs/mosquitto.log & pnpm start:dev; }
