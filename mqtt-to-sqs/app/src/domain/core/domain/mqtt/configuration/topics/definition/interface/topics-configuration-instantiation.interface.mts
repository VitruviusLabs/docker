import type { MQTTServiceTopicInterface } from "../../../../service/mqtt/definition/interface/mqtt-service-topic.interface.mjs";

interface TopicsConfigurationInstantiationInterface
{
	topics: Array<MQTTServiceTopicInterface>;
}

export type { TopicsConfigurationInstantiationInterface };
