import * as log from 'loglevel';
import moment, {Moment} from 'moment';
import {useCallback, Reducer} from 'react';
import {Action} from '../util-types';
import {difference, timer} from '../util';

import {useLogGroups} from './log-groups';

export function useLoggerReducerWrapper<T, ActionType extends Action>(
	reducer: Reducer<T, ActionType>,
): Reducer<T, ActionType> {
	const [groupCollapsed, groupEnd] = useLogGroups();
	return useCallback(
		(state: T, action: ActionType): T => {
			const startTime: number = timer.now();
			const timestamp: Moment = moment();
			const nextState = reducer(state, action);

			if (log.getLevel() <= log.levels.DEBUG) {
				groupCollapsed(
					`%caction %c${action.type} %c@ ${timestamp.format('kk:mm:ss:SSS')} (in ${(
						timer.now() - startTime
					).toFixed(2)}ms)`,
					'color:slateblue',
					'color:teal',
					'color:grey',
				);
				log.debug('%cprev state:%c%o', 'font-weight:bold; color:royalblue;', 'font-weight:normal;', state);
				log.debug('%caction:%c%o', 'font-weight:bold; color:slateblue;', 'font-weight:normal;', action);
				log.debug(
					'%cnext state: %c%o',
					'font-weight:bold; color:forestgreen;',
					'font-weight:normal;',
					nextState,
				);
				log.debug(
					'%cdiff: %c%o',
					'font-weight:bold; color:sienna;',
					'font-weight:normal;',
					JSON.stringify(difference(nextState, state), undefined, 4),
				);
				groupCollapsed('%cstack trace', 'color:slategrey;');
				log.trace();
				groupEnd();
				groupEnd();
			}

			return nextState;
		},
		[reducer, groupCollapsed, groupEnd],
	);
}
