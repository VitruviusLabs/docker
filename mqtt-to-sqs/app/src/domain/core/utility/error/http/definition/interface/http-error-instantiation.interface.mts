import type { HTTPStatusCodeEnum } from "@vitruvius-labs/architectura";

interface HTTPErrorInstantiationInterface extends ErrorOptions
{
	code: HTTPStatusCodeEnum;
	message: string;
}

export type { HTTPErrorInstantiationInterface };
