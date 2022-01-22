import {
	createContext,
	createElement,
	Dispatch,
	FC,
	PropsWithChildren,
	ReactElement,
	useContext,
	useReducer,
} from 'react';

import {useLoggerReducerWrapper} from './logger/use-log-reducer-wrapper';
import {Action} from './util-types';

interface PrepareContextOptions {
	allowUndefinedState: boolean;
}

export function prepareContext<State = Record<string, unknown>, T extends Action = Action>(
	reducer: (state: State, action: T) => State,
	initialState: State,
	options?: PrepareContextOptions,
): [FC<PropsWithChildren<Record<string, unknown>>>, () => State, () => Dispatch<T>] {
	// State & Dispatch Contexts
	// =============================================================================
	const StateContext = createContext<State | undefined>(undefined);
	const DispatchContext = createContext<Dispatch<T> | undefined>(undefined);

	// Provider
	// =============================================================================

	const PreparedProvider: FC<PropsWithChildren<Record<string, unknown>>> = ({children}): ReactElement => {
		const [state, dispatch] = useReducer(useLoggerReducerWrapper(reducer), initialState);
		return createElement(
			StateContext.Provider,
			{
				value: state,
			},
			createElement(
				DispatchContext.Provider,
				{
					value: dispatch,
				},
				children,
			),
		);
	};

	// Custom Hooks
	// =============================================================================
	function useState(): State {
		const context = useContext(StateContext);
		if (context === undefined && !options?.allowUndefinedState) {
			throw new Error('useState must be used with Provider.');
		}

		return context!;
	}

	function useDispatch(): Dispatch<T> {
		const context = useContext(DispatchContext);
		if (context === undefined) {
			throw new Error('useDispatch must be used with Provider.');
		}

		return context;
	}

	return [PreparedProvider, useState, useDispatch];
}
