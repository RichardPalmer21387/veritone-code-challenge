
// eslint-disable-next-line @typescript-eslint/ban-types
export type Action<T = string, ExtraProps = {}> = {
	type: T;
} & ExtraProps;

export type JSONResponse<T> = {
	authenticated: boolean;
	data: T;
	error?: string;
	errors?: string[];
	hasMessage?: boolean;
	message: string;
	success: boolean;
};

export function actionIs<T extends Action>(action: Action, type: string | string[]): action is T {
	// The type can be either a string or array of strings.
	if (typeof type === 'string') {
		return (action as T).type === type;
	}

	return false;
}

export function assertNeverAction(action: never): never {
	throw new Error(`Unexpected action: ${action as string}`);
}
