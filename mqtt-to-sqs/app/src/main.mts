import { DomainService } from "@vitruvius-labs/architectura";

async function main(): Promise<void>
{
	await DomainService.LoadMultipleFromRootDirectory(`${import.meta.dirname}/domain`);
	await DomainService.LoadMultipleFromRootDirectory(`${import.meta.dirname}/domain/core/domain`);
}

export { main };
