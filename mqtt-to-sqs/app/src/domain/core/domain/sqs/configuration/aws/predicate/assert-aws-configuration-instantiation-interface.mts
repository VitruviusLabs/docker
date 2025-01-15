import { assertString, assertStructuredData } from "@vitruvius-labs/ts-predicate/type-assertion";
import type { AWSConfigurationInstantiationInterface } from "../definition/interface/aws-configuration-instantiation.interface.mjs";

function assertAWSConfigurationInstantiationInterface(value: unknown): asserts value is AWSConfigurationInstantiationInterface
{
	assertStructuredData<AWSConfigurationInstantiationInterface>(value, {
		accessKeyId: {
			test: assertString,
		},
		accessSecret: {
			test: assertString,
		},
		region: {
			test: assertString,
		},
		accountId: {
			test: assertString,
		},
	});
}

export { assertAWSConfigurationInstantiationInterface };
