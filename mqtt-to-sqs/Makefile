##
# Global
##

development.docker.mqtt-to-sqs.initialise:
	@bash ./_ops/development/scripts/initialise.sh ||:

development.docker.mqtt-to-sqs.start:
	@bash ./_ops/development/scripts/up.sh ||:

development.docker.mqtt-to-sqs.stop:
	@bash ./_ops/development/scripts/down.sh ||:

development.docker.mqtt-to-sqs.boot:
	@bash ./_ops/development/scripts/boot.sh ||:

# Short-hand style

initialise:
	@bash ./_ops/development/scripts/initialise.sh ||:

start:
	@bash ./_ops/development/scripts/up.sh ||:

stop:
	@bash ./_ops/development/scripts/down.sh ||:

boot:
	@bash ./_ops/development/scripts/boot.sh ||:

##
# Core
##

development.docker.mqtt-to-sqs.boot.log.core:
	@bash ./_ops/development/scripts/boot.sh && docker logs -f mqtt-to-sqs ||:

# Short-hand style

boot.log.core:
	@bash ./_ops/development/scripts/boot.sh && docker logs -f mqtt-to-sqs ||:

production.docker.build:
	@bash ./_ops/production/scripts/build.sh ||:

production.docker.push:
	@bash ./_ops/production/scripts/push.sh ||:
