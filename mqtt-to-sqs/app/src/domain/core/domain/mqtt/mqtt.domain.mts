import { BaseDomain } from "@vitruvius-labs/architectura";
import { TopicsConfiguration } from "./configuration/topics/topics.configuration.mjs";
import { CoreDomain } from "../../core.domain.mjs";
import { assertTopicsConfigurationInstantiationInterface } from "./configuration/topics/predicate/assert-topics-configuration-instantiation-interface.mjs";
import { MQTTService } from "./service/mqtt/mqtt.service.mjs";
import { EnvironmentService } from "../../service/environment/environment.service.mjs";
import { SQSDomain } from "../sqs/sqs.domain.mjs";

class MQTTDomain extends BaseDomain
{
	private static Initialized: boolean = false;

	public static override async Initialize(): Promise<void>
	{
		if (this.Initialized)
		{
			return;
		}

		await CoreDomain.Initialize();

		await super.Initialize();
		await SQSDomain.Initialize();

		await this.LoadTopicsConfiguration();

		this.StartMQTTService();

		this.Initialized = true;
	}

	private static async LoadTopicsConfiguration(): Promise<TopicsConfiguration>
	{
		const configuration: unknown = await CoreDomain.LoadConfiguration("mqtt/topics");

		assertTopicsConfigurationInstantiationInterface(configuration);

		return new TopicsConfiguration(configuration);
	}

	private static StartMQTTService(): MQTTService
	{
		const environmentService: EnvironmentService = EnvironmentService.GetInstance(EnvironmentService);
		const topicsConfiguration: TopicsConfiguration = TopicsConfiguration.GetInstance(TopicsConfiguration);

		return new MQTTService({
			username: environmentService.getMQTTUsername(),
			password: environmentService.getMQTTPassword(),
			topics: topicsConfiguration.getTopics(),
		});
	}
}

export { MQTTDomain };
