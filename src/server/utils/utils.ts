export const getErrorMessage = (
	error: unknown,
	customUnkownErrorMessage = "Unkown error",
): string =>
	error instanceof Error
		? error.message
		: typeof error === "string"
			? error
			: customUnkownErrorMessage;
