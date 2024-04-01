#!/usr/bin/env bash
set -euo pipefail

echo "Checking environment..."

NOT_SET=false

if ! [[ -v AWS_ACCESS_KEY_ID ]]; then
  echo "AWS_ACCESS_KEY_ID is not set"
  NOT_SET=true
fi
if ! [[ -v AWS_SECRET_ACCESS_KEY ]]; then
  echo "AWS_SECRET_ACCESS_KEY is not set"
  NOT_SET=true
fi
if ! [[ -v AWS_REGION ]]; then
  echo "AWS_REGION is not set"
  NOT_SET=true
fi
if ! [[ -v AWS_ACCOUNT_ID ]]; then
  echo "AWS_ACCOUNT_ID is not set"
  NOT_SET=true
fi
if ! [[ -v AWS_SQS_QUEUE_NAME ]]; then
  echo "AWS_SQS_QUEUE_NAME is not set"
  NOT_SET=true
fi
if ! [[ -v MQTT_USERNAME ]]; then
  echo "MQTT_USERNAME is not set"
  NOT_SET=true
fi
if ! [[ -v MQTT_PASSWORD ]]; then
  echo "MQTT_PASSWORD is not set"
  NOT_SET=true
fi

if [ "$NOT_SET" = true ]; then
  echo "Some environment variables are not set. Exiting..."
  exit 1
fi


echo "Configuring AWS CLI"

aws configure set aws_access_key_id "${AWS_ACCESS_KEY_ID}"
aws configure set aws_secret_access_key "${AWS_SECRET_ACCESS_KEY}"
aws configure set region "${AWS_REGION}"
aws configure set output json

echo "AWS CLI Configured"

echo "Creating mosquitto password file"
echo "${MQTT_USERNAME}:${MQTT_PASSWORD}" > /home/mosquitto/configuration/passwd
echo "Created mosquitto password file"

echo "Registering MQTT passwd"
mosquitto_passwd -U /home/mosquitto/configuration/passwd
echo "MQTT passwd registered"

mkdir -p /home/mosquitto/logs
touch /home/mosquitto/logs/mosquitto.log

mosquitto -d -c /home/mosquitto/configuration/mosquitto.conf
{ tail -f /home/mosquitto/logs/mosquitto.log & mosquitto_sub -h localhost -u "${MQTT_USERNAME}" -P "${MQTT_PASSWORD}" -t "#" -F "%j" | /home/mosquitto/scripts/send_to_sqs_queue.sh; }
