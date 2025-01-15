import { Singleton } from "@vitruvius-labs/architectura";
import type { TopicsConfigurationInstantiationInterface } from "./definition/interface/topics-configuration-instantiation.interface.mjs";
import type { MQTTServiceTopicInterface } from "../../service/mqtt/definition/interface/mqtt-service-topic.interface.mjs";

class TopicsConfiguration extends Singleton
{
	private readonly topics: Array<MQTTServiceTopicInterface>;

	public constructor(parameters: TopicsConfigurationInstantiationInterface)
	{
		super();

		this.topics = parameters.topics;
	}

	public getTopics(): Array<MQTTServiceTopicInterface>
	{
		return this.topics;
	}
}

export { TopicsConfiguration };
