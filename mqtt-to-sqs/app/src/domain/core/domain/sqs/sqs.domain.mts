import { BaseDomain } from "@vitruvius-labs/architectura";
import { CoreDomain } from "../../core.domain.mjs";
import { AWSConfiguration } from "./configuration/aws/aws.configuration.mjs";
import { assertAWSConfigurationInstantiationInterface } from "./configuration/aws/predicate/assert-aws-configuration-instantiation-interface.mjs";
import { SQSService } from "@vitruvius-labs/aws-sqs";

class SQSDomain extends BaseDomain
{
	private static Initialized: boolean = false;

	private static SQSService: SQSService | undefined;

	public static override async Initialize(): Promise<void>
	{
		if (this.Initialized)
		{
			return;
		}

		await CoreDomain.Initialize();

		await super.Initialize();

		await this.LoadAWSConfiguration();

		this.Initialized = true;
	}

	public static GetSQSService(): SQSService
	{
		if (this.SQSService === undefined)
		{
			const awsConfiguration: AWSConfiguration = AWSConfiguration.GetInstance(AWSConfiguration);

			this.SQSService = new SQSService({
				accessKeyId: awsConfiguration.getAccessKeyId(),
				accessSecret: awsConfiguration.getAccessSecret(),
				region: awsConfiguration.getRegion(),
				host: `sqs.${awsConfiguration.getRegion()}.amazonaws.com`,
				accountId: awsConfiguration.getAccountId(),
				https: true,
			});
		}

		return this.SQSService;
	}

	private static async LoadAWSConfiguration(): Promise<AWSConfiguration>
	{
		const configuration: unknown = await CoreDomain.LoadConfiguration("sqs/aws");

		assertAWSConfigurationInstantiationInterface(configuration);

		return new AWSConfiguration(configuration);
	}
}

export { SQSDomain };
