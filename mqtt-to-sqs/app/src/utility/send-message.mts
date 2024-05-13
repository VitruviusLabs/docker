import { SQSService } from "@vitruvius-labs/aws-sqs";
import { log } from "./log.mjs";
// import { Hash, createHash } from "crypto";

const access_key_id = process.env['AWS_ACCESS_KEY_ID'] ?? '';
const secret_access_key = process.env['AWS_SECRET_ACCESS_KEY'] ?? '';
// const aws_sqs_queue_url = process.env['AWS_SQS_QUEUE_URL'] ?? '';
const aws_region = process.env['AWS_REGION'] ?? '';
const host = `sqs.${aws_region}.amazonaws.com`;

const sqsService: SQSService = new SQSService({
  accessKeyId: access_key_id,
  accessSecret: secret_access_key,
  region: aws_region,
  host: host,
  accountId: process.env['AWS_ACCOUNT_ID'] ?? '',
  https: true,
});

async function sendMessage(message: string) {
  log(`Sending message: ${message}`);

  const result: unknown = await sqsService.sendMessage(
    process.env['AWS_SQS_QUEUE_NAME'] ?? '',
    message
  );

  log(`Message sent: ${JSON.stringify(result)}`);

  // const hash: Hash = createHash('sha256');

  // hash.update(message);

  // const parameters: URLSearchParams = new URLSearchParams();

  // parameters.append('Action', 'SendMessage');
  // parameters.append('MessageBody', message);

  // const headers: Record<string, string> = {
  //   Accept: 'application/json',
  //   'Content-Type': 'application/x-www-form-urlencoded',
  //   Host: host,
  // };

  // log(`Using credentials: ${access_key_id} and ${secret_access_key} for region ${aws_region}`)

  // const signature = new Signature({
  //   accessKeyId: access_key_id,
  //   accessSecret: secret_access_key,
  //   region: aws_region,
  //   service: "sqs",
  //   method: HTTPMethodEnum.POST,
  //   headers: headers,
  //   url: `${aws_sqs_queue_url}?${parameters.toString()}`,
  //   body: parameters.toString(),
  // })
  // signature.generate();

  // log(`Sending SQS message on queue ${aws_sqs_queue_url}...`);

  // const finalHeaders: Headers = signature.getComputedHeaders();

  // finalHeaders.append('Authorization', signature.getAuthorizationHeader());

  // const response: Response = await fetch(aws_sqs_queue_url, {
  //   method: HTTPMethodEnum.POST,
  //   body: parameters,
  //   headers: finalHeaders,
  //   keepalive: true,
  // });

  // log(await response.text());
} 

export { sendMessage };

