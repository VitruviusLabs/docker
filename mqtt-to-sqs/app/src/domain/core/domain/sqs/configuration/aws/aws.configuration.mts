import { Singleton } from "@vitruvius-labs/architectura";
import type { AWSConfigurationInstantiationInterface } from "./definition/interface/aws-configuration-instantiation.interface.mjs";

class AWSConfiguration extends Singleton
{
	private readonly accessKeyId: string;
	private readonly accessSecret: string;
	private readonly region: string;
	private readonly accountId: string;

	public constructor(parameters: AWSConfigurationInstantiationInterface)
	{
		super();

		this.accessKeyId = parameters.accessKeyId;
		this.accessSecret = parameters.accessSecret;
		this.region = parameters.region;
		this.accountId = parameters.accountId;
	}

	public getAccessKeyId(): string
	{
		return this.accessKeyId;
	}

	public getAccessSecret(): string
	{
		return this.accessSecret;
	}

	public getRegion(): string
	{
		return this.region;
	}

	public getAccountId(): string
	{
		return this.accountId;
	}
}

export { AWSConfiguration };
