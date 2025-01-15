FROM node:22-bookworm-slim AS build-image

WORKDIR /home/node/app

COPY ./app/package.json /home/node/app/package.json
COPY ./app/src /home/node/app/src
COPY ./app/tsconfig*.json /home/node/app/

RUN npm install -g pnpm && \
	pnpm install --node-linker hoisted && \
	pnpm build && \
	pnpm install --prod --node-linker hoisted

FROM node:22-bookworm-slim

USER root

RUN apt-get update && apt-get install -y --no-install-recommends \
	mosquitto \
	mosquitto-clients \
	build-essential \
	ca-certificates

COPY --from=build-image /home/node/app/node_modules /home/node/app/node_modules
COPY --from=build-image /home/node/app/build /home/node/app/build
COPY --from=build-image /home/node/app/package.json /home/node/app/package.json
COPY ./app/configuration.production/ /home/node/app/configuration/

COPY ./_ops/production/services/core/files/mosquitto.conf /home/mosquitto/configuration/mosquitto.conf
COPY ./_ops/production/services/core/scripts/entrypoint.sh /home/mosquitto/scripts/entrypoint.sh

RUN chmod +x /home/mosquitto/scripts/entrypoint.sh \
	&& chown mosquitto:mosquitto /home/mosquitto/scripts/entrypoint.sh  \
	&& chown -R mosquitto:mosquitto /home/mosquitto \
	&& chown -R mosquitto:mosquitto /home/node

USER mosquitto

ENTRYPOINT [ "/home/mosquitto/scripts/entrypoint.sh" ]
