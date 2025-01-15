import { assertArray, assertString, assertStructuredData } from "@vitruvius-labs/ts-predicate/type-assertion";
import type { MQTTServiceTopicInterface } from "../definition/interface/mqtt-service-topic.interface.mjs";

function assertMQTTServiceTopicInterface(value: unknown): asserts value is MQTTServiceTopicInterface
{
	assertStructuredData<MQTTServiceTopicInterface>(
		value,
		{
			identifier: {
				test: assertString,
			},
			queues: {
				test: (scopedValue: unknown): asserts scopedValue is Array<string> =>
				{
					assertArray<string>(scopedValue, {
						itemTest: assertString,
					});
				},
			},
		}
	);
}

export { assertMQTTServiceTopicInterface };
