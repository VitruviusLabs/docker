import { log } from './utility/log.mjs';
import { startMQTT } from './utility/start-mqtt.mjs';
import { startServer } from './utility/start-server.mjs';

log(`Environment: ${JSON.stringify(process.env)}`);

startMQTT();
startServer();
