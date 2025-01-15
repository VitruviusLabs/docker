import { Singleton } from "@vitruvius-labs/architectura";
import type { EnvironmentServiceInstantiationInterface } from "./definition/interface/environment-service-instantiation.interface.mjs";

class EnvironmentService extends Singleton
{
	private readonly mqttUsername: string;
	private readonly mqttPassword: string;

	public constructor(parameters: EnvironmentServiceInstantiationInterface)
	{
		super();

		this.mqttUsername = parameters.MQTT_USERNAME;
		this.mqttPassword = parameters.MQTT_PASSWORD;
	}

	public getMQTTUsername(): string
	{
		return this.mqttUsername;
	}

	public getMQTTPassword(): string
	{
		return this.mqttPassword;
	}
}

export { EnvironmentService };
