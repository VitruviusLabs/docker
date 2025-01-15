FROM node:22-bookworm-slim

USER root

WORKDIR /home/node/app

RUN apt-get update && apt-get install -y --no-install-recommends \
	mosquitto \
	mosquitto-clients \
	build-essential \
	ca-certificates

RUN npm -g install pnpm

COPY ./services/core/files/mosquitto.conf /home/mosquitto/configuration/mosquitto.conf
COPY ./services/core/scripts/entrypoint.sh /home/mosquitto/scripts/entrypoint.sh

RUN chmod +x /home/mosquitto/scripts/entrypoint.sh \
	&& chown node:node /home/mosquitto/scripts/entrypoint.sh  \
	&& chown -R node:node /home/mosquitto \
	&& chown -R node:node /home/node

USER node

ENTRYPOINT [ "/home/mosquitto/scripts/entrypoint.sh" ]
