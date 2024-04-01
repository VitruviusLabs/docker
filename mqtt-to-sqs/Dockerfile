FROM debian:bookworm-slim

USER root

RUN apt-get update && apt-get install -y --no-install-recommends \
    mosquitto \
    mosquitto-clients \
    build-essential \
    ca-certificates \
    unzip \
    curl \
    && curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" \
    && unzip awscliv2.zip \
    && ./aws/install

COPY ./files/mosquitto.conf /home/mosquitto/configuration/mosquitto.conf
COPY ./files/send_to_sqs_queue.sh /home/mosquitto/scripts/send_to_sqs_queue.sh
COPY ./files/entrypoint.sh /home/mosquitto/scripts/entrypoint.sh

RUN chmod +x /home/mosquitto/scripts/send_to_sqs_queue.sh \
    && chown mosquitto:mosquitto /home/mosquitto/scripts/send_to_sqs_queue.sh \
    && chmod +x /home/mosquitto/scripts/entrypoint.sh \
    && chown mosquitto:mosquitto /home/mosquitto/scripts/entrypoint.sh  \
    && chown -R mosquitto:mosquitto /home/mosquitto

USER mosquitto

ENTRYPOINT [ "/home/mosquitto/scripts/entrypoint.sh" ]

CMD { mosquitto -v -c /home/mosquitto/configuration/mosquitto.conf & mosquitto_sub -d -h localhost -u -t "#" -v | /home/mosquitto/scripts/send_to_sqs_queue.sh; }
