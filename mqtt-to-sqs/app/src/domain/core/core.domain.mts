import { realpath } from "node:fs/promises";
import { BaseDomain, FileSystemService } from "@vitruvius-labs/architectura";
import { ErrorMessageEnum } from "./utility/error/definition/enum/error-message.enum.mjs";
import { computeErrorMessage } from "./utility/error/compute-error-message.mjs";
import { assertEnvironmentServiceInstantiationInterface } from "./service/environment/predicate/assert-environment-service-instantiation-interface.mjs";
import { EnvironmentService } from "./service/environment/environment.service.mjs";

class CoreDomain extends BaseDomain
{
	private static RootDirectory: string;
	private static Initialized: boolean = false;

	public static override async Initialize(): Promise<void>
	{
		if (this.Initialized)
		{
			return;
		}

		await super.Initialize();
		await this.ComputeRootDirectory();

		this.InitialiseEnvironmentService();

		this.Initialized = true;
	}

	public static GetRootDirectory(): string
	{
		return this.RootDirectory;
	}

	public static async LoadConfiguration(name: string): Promise<unknown>
	{
		const configuration_path: string = `${this.GetRootDirectory()}/configuration/${name}.json`;
		const configuration_exists: boolean = await FileSystemService.FileExists(configuration_path);

		if (!configuration_exists)
		{
			const error_message: string = computeErrorMessage(ErrorMessageEnum.MISSING_CONFIGURATION_FILE, { path: configuration_path });

			throw new Error(error_message);
		}

		const file_content: string = await FileSystemService.ReadTextFile(configuration_path);
		const parsed_file_content: unknown = JSON.parse(file_content);

		return parsed_file_content;
	}

	private static async ComputeRootDirectory(): Promise<void>
	{
		this.RootDirectory = await realpath(`${import.meta.dirname}/../../..`);
	}

	private static InitialiseEnvironmentService(): EnvironmentService
	{
		const environment: unknown = { ...process.env };

		assertEnvironmentServiceInstantiationInterface(environment);

		return new EnvironmentService(environment);
	}
}

export { CoreDomain };
