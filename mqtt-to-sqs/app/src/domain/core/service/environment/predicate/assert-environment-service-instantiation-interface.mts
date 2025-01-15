import { assertString, assertStructuredData } from "@vitruvius-labs/ts-predicate/type-assertion";
import type { EnvironmentServiceInstantiationInterface } from "../definition/interface/environment-service-instantiation.interface.mjs";

function assertEnvironmentServiceInstantiationInterface(value: unknown): asserts value is EnvironmentServiceInstantiationInterface
{
	assertStructuredData<EnvironmentServiceInstantiationInterface>(
		value,
		{
			MQTT_USERNAME: {
				test: assertString,
			},
			MQTT_PASSWORD: {
				test: assertString,
			},
		},
		{
			allowExtraneousProperties: true,
		}
	);
}

export { assertEnvironmentServiceInstantiationInterface };
