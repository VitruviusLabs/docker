#!/usr/bin/env bash
set -euo pipefail

while read line; do
  echo "Received message: ${line}"
  echo "Sending message to SQS on region ${AWS_REGION}, account ${AWS_ACCOUNT_ID} and queue ${AWS_SQS_QUEUE_NAME}"
  aws sqs send-message --queue-url "https://sqs.${AWS_REGION}.amazonaws.com/${AWS_ACCOUNT_ID}/${AWS_SQS_QUEUE_NAME}" --message-body "${line}"
  echo "Message sent to SQS"
done
