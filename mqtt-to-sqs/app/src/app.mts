import { ISubscriptionGrant, MqttClient, connect } from 'mqtt';
import { HTTPMethodEnum, Signature } from "@vitruvius-labs/aws-signature-v4";
import { Hash, createHash, randomUUID } from "crypto";

const access_key_id = process.env['AWS_ACCESS_KEY_ID'] ?? '';
const secret_access_key = process.env['AWS_SECRET_ACCESS_KEY'] ?? '';
const aws_region = process.env['AWS_REGION'] ?? '';
const aws_sqs_queue_url = process.env['AWS_SQS_QUEUE_URL'] ?? '';
const mqtt_username = process.env['MQTT_USERNAME'] ?? '';
const mqtt_password = process.env['MQTT_PASSWORD'] ?? '';
const mqtt_topic = process.env['MQTT_TOPIC'] ?? '';

const host = `sqs.${aws_region}.amazonaws.com`;

function log(message: string) {
  const date: Date = new Date();

  const year: number = date.getUTCFullYear();
  const month: number = date.getUTCMonth() + 1;
  const day: number = date.getUTCDate();
  const hours: number = date.getUTCHours();
  const minutes: number = date.getUTCMinutes();
  const seconds: number = date.getUTCSeconds();

  const paddedMonth: string = month.toString().padStart(2, '0');
  const paddedDay: string = day.toString().padStart(2, '0');
  const paddedHours: string = hours.toString().padStart(2, '0');
  const paddedMinutes: string = minutes.toString().padStart(2, '0');
  const paddedSeconds: string = seconds.toString().padStart(2, '0');

  console.log(`[${year}-${paddedMonth}-${paddedDay}_${paddedHours}:${paddedMinutes}:${paddedSeconds}]: ${message}`);
}

log(`Environment: ${JSON.stringify(process.env)}`);

async function sendMessage(message: string) {
  
  const hash: Hash = createHash('sha256');

  hash.update(message);


  const parameters: URLSearchParams = new URLSearchParams();

  parameters.append('Action', 'SendMessage');
  parameters.append('MessageBody', message);

  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
    Host: host,
  };

  log(`Using credentials: ${access_key_id} and ${secret_access_key} for region ${aws_region}`)

  const signature = new Signature({
    accessKeyId: access_key_id,
    accessSecret: secret_access_key,
    region: aws_region,
    service: "sqs",
    method: HTTPMethodEnum.POST,
    headers: headers,
    url: `${aws_sqs_queue_url}?${parameters.toString()}`,
    body: parameters.toString(),
  })
  signature.generate();

  log(`Sending SQS message on queue ${aws_sqs_queue_url}...`);

  const finalHeaders: Headers = signature.getComputedHeaders();

  finalHeaders.append('Authorization', signature.getAuthorizationHeader());

  const response: Response = await fetch(aws_sqs_queue_url, {
    method: HTTPMethodEnum.POST,
    body: parameters,
    headers: finalHeaders,
    keepalive: true,
  });

  log(await response.text());
} 

const client: MqttClient = connect(
  `mqtt://127.0.0.1:1883`,
  {
    clientId: `${randomUUID()}`,
    username: mqtt_username,
    password: mqtt_password,
  },
);

client.on('message', async (topic: string, message: Buffer) => {
    log(
      `Received MQTT message on topic: ${topic}`
    );

    log(`Message: ${message.toString()}`);

    await sendMessage(message.toString());
});

client.subscribe(
  mqtt_topic,
  (
    error: Error | null,
    granted: Array<ISubscriptionGrant> | undefined,
  ): void => {
    log(`Subscribed to topic: ${mqtt_topic}`);

    if (error !== null) {
      log(error.message);

      throw error;
    }

    log(
      `Subscription grants: ${JSON.stringify(granted)}`,
    );
  },
);
