import type { HTTPStatusCodeEnum } from "@vitruvius-labs/architectura";
import type { HTTPErrorInstantiationInterface } from "./definition/interface/http-error-instantiation.interface.mjs";

class HTTPError extends Error
{
	protected statusCode: HTTPStatusCodeEnum;

	public constructor(parameters: HTTPErrorInstantiationInterface)
	{
		super(parameters.message, parameters);

		this.statusCode = parameters.code;
	}

	public getStatusCode(): HTTPStatusCodeEnum
	{
		return this.statusCode;
	}
}

export { HTTPError };
