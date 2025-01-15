import type { MQTTServiceTopicInterface } from "./mqtt-service-topic.interface.mjs";

interface MQTTServiceInstantiationInterface
{
	username: string;
	password: string;
	topics: Array<MQTTServiceTopicInterface>;
}

export type { MQTTServiceInstantiationInterface };
