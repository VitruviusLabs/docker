import { LoggerProxy, Singleton } from "@vitruvius-labs/architectura";
import { type ISubscriptionGrant, type MqttClient, connect } from "mqtt";
import type { MQTTServiceInstantiationInterface } from "./definition/interface/mqtt-service-instantiation.interface.mjs";
import { randomUUID } from "crypto";
import type { WrappedMessageInterface } from "./definition/interface/wrapped-message.interface.mjs";
import { assertRecord } from "@vitruvius-labs/ts-predicate/type-assertion";
import type { MQTTServiceTopicInterface } from "./definition/interface/mqtt-service-topic.interface.mjs";
import { SQSDomain } from "../../../sqs/sqs.domain.mjs";

class MQTTService extends Singleton
{
	protected readonly client: MqttClient;
	protected readonly topics: Array<MQTTServiceTopicInterface> = [];

	public constructor(instantiationInterface: MQTTServiceInstantiationInterface)
	{
		super();

		this.topics = instantiationInterface.topics;

		this.client = connect("mqtt://127.0.0.1:1883", {
			clientId: randomUUID(),
			username: instantiationInterface.username,
			password: instantiationInterface.password,
		});

		this.client.on("message", this.onMessage.bind(this));

		this.subscribeToTopics();
	}

	private subscribeToTopics(): void
	{
		for (const topic of this.topics)
		{
			this.client.subscribe(topic.identifier, this.onSubscribe.bind(this));
		}
	}

	// eslint-disable-next-line @ts/class-methods-use-this
	private onSubscribe(error: Error | null, granted: Array<ISubscriptionGrant> | undefined): void
	{
		if (error !== null)
		{
			LoggerProxy.Informational(error.message);

			throw error;
		}

		LoggerProxy.Informational(`Subscription grants: ${JSON.stringify(granted)}`);
	}

	// eslint-disable-next-line @ts/class-methods-use-this
	private extractMessageContent(message: Buffer): Record<string, unknown>
	{
		try
		{
			const messageContent: unknown = JSON.parse(message.toString());

			assertRecord(messageContent);

			return messageContent;
		}
		catch (error: unknown)
		{
			LoggerProxy.Error(`Error parsing message: ${message.toString()}`);
			LoggerProxy.Error(error);

			throw new Error("Error parsing message");
		}
	}

	private wrapMessage(topic: string, message: Buffer): WrappedMessageInterface
	{
		return {
			time: new Date().toISOString(),
			topic: topic,
			message: this.extractMessageContent(message),
		};
	}

	private getTopicFromIdentifier(identifier: string): MQTTServiceTopicInterface | undefined
	{
		for (const topic of this.topics)
		{
			if (topic.identifier === identifier)
			{
				return topic;
			}
		}

		return undefined;
	}

	private onMessage(topic: string, message: Buffer): void
	{
		LoggerProxy.Informational(`Received MQTT message on topic: ${topic}`);
		LoggerProxy.Informational(`Message: ${message.toString()}`);
		LoggerProxy.Informational("Wrapping message...");

		const wrappedMessage: WrappedMessageInterface = this.wrapMessage(topic, message);

		const matchedTopic: MQTTServiceTopicInterface | undefined = this.getTopicFromIdentifier(topic);

		if (matchedTopic === undefined)
		{
			LoggerProxy.Error(`No matching topic found for: ${topic}`);

			return;
		}

		for (const queue of matchedTopic.queues)
		{
			SQSDomain.GetSQSService().sendMessage(queue, JSON.stringify(wrappedMessage))
			.catch((error: Error): void =>
			{
				LoggerProxy.Error(error);
			});
		}
	}
}

export { MQTTService };
