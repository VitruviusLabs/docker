function computeErrorMessage(message: string, replacements: Record<string, string>): string
{
	let output: string = message;

	const replacements_keys: Array<string> = Object.keys(replacements);

	for (const key of replacements_keys)
	{
		output = output.replace(`{{${key}}}`, replacements[key] ?? "");
	}

	return output;
}

export { computeErrorMessage };
