import * as log from 'loglevel';
import moment, {Moment} from 'moment';
import {Reducer, useCallback} from 'react';
import {cloneDeep} from 'lodash';
import {Action} from '../util-types';
import {difference, timer} from '../util';

import {useLogGroups} from './log-groups';

log.setDefaultLevel('info');
window.log = log;

export function useLoggerReducerWrapper<T, ActionType extends Action>(
	reducer: Reducer<T, ActionType>,
): Reducer<T, ActionType> {
	const [groupCollapsed, groupEnd] = useLogGroups();
	return useCallback((state: T, action: ActionType): T => {
		let preState: T;
		let startTime: number;
		let timestamp: Moment;
		const doLogging = log.getLevel() <= log.levels.DEBUG;
		if (doLogging) {
			preState = cloneDeep(state);
			startTime = timer.now();
			timestamp = moment();
		}

		const nextState = reducer(state, action);

		if (doLogging) {
			const exeTime = timer.now() - startTime!;
			groupCollapsed(
				`%caction %c${action.type} %c@ ${timestamp!.format('kk:mm:ss:SSS')} (in ${(
					exeTime
				).toFixed(2)}ms)`,
				'color:slateblue',
				'color:teal',
				'color:grey',
			);
			log.debug('%cprev state:%c%o', 'font-weight:bold; color:royalblue;', 'font-weight:normal;', preState!);
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
				JSON.stringify(difference(nextState, preState!), undefined, 4),
			);
			groupCollapsed('%cstack trace', 'color:slategrey;');
			log.trace();
			groupEnd();
			groupEnd();
		}

		return nextState;
	}, [reducer, groupCollapsed, groupEnd]);
}
