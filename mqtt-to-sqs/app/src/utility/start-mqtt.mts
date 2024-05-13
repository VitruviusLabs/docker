import { ISubscriptionGrant, MqttClient, connect } from "mqtt";
import { randomUUID } from "crypto";
import { sendMessage } from "./send-message.mjs";
import { log } from "./log.mjs";

const mqtt_username = process.env["MQTT_USERNAME"] ?? "";
const mqtt_password = process.env["MQTT_PASSWORD"] ?? "";
const mqtt_topic = process.env["MQTT_TOPIC"] ?? "";

function startMQTT() {
  const client: MqttClient = connect(`mqtt://127.0.0.1:1883`, {
    clientId: `${randomUUID()}`,
    username: mqtt_username,
    password: mqtt_password,
  });

  client.on("message", async (topic: string, message: Buffer) => {
    log(`Received MQTT message on topic: ${topic}`);

    log(`Message: ${message.toString()}`);

    log(`Wrapping message...`);

    let messageContent: Record<string, unknown> = {};

    try {
      messageContent = JSON.parse(message.toString());
    } catch (error: unknown) {
      log(`Error parsing message: ${message.toString()}`);
      messageContent = { content: message.toString() }
    }

    const wrappedMessage: Record<string, unknown> = {
      time: new Date().toISOString(),
      topic: topic,
      message: messageContent,
    }

    await sendMessage(JSON.stringify(wrappedMessage));
  });

  client.subscribe(
    mqtt_topic,
    (
      error: Error | null,
      granted: Array<ISubscriptionGrant> | undefined
    ): void => {
      log(`Subscribed to topic: ${mqtt_topic}`);

      if (error !== null) {
        log(error.message);

        throw error;
      }

      log(`Subscription grants: ${JSON.stringify(granted)}`);
    }
  );
}

export { startMQTT };
