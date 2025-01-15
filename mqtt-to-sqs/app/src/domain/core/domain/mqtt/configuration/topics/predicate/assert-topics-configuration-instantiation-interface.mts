import { assertArray, assertStructuredData } from "@vitruvius-labs/ts-predicate/type-assertion";
import type { TopicsConfigurationInstantiationInterface } from "../definition/interface/topics-configuration-instantiation.interface.mjs";
import type { MQTTServiceTopicInterface } from "../../../service/mqtt/definition/interface/mqtt-service-topic.interface.mjs";
import { assertMQTTServiceTopicInterface } from "../../../service/mqtt/predicate/assert-mqtt-service-topic-interface.mjs";

function assertTopicsConfigurationInstantiationInterface(value: unknown): asserts value is TopicsConfigurationInstantiationInterface
{
	assertStructuredData<TopicsConfigurationInstantiationInterface>(value, {
		topics: {
			test: (scopedValue: unknown): asserts scopedValue is Array<MQTTServiceTopicInterface> =>
			{
				assertArray<MQTTServiceTopicInterface>(scopedValue, {
					itemTest: assertMQTTServiceTopicInterface,
				});
			},
		},
	});
}

export { assertTopicsConfigurationInstantiationInterface };
