import {transform, isEqual, isObject, get, set} from 'lodash';

/**
 * Deep diff between two object, using lodash
 **/
export function difference<T0, T1>(object: T0, base: T1): (T0 & T1) | T1 {
	function changes<P0, P1>(object: P0, base: P1): (P0 & P1) | P1 {
		if (isObject(object)) {
			return transform(object, (result, value, key) => {
				if (!isEqual(value, get(base, key))) {
					if (isObject(base) && isObject(result)) {
						return set(
							result,
							key,
							isObject(value) && isObject(get(base, key)) ? changes(value, get(base, key)) : value,
						);
					}

					return base;
				}
			});
		}

		return base;
	}

	if (isObject(object) && isObject(base)) {
		return changes(object, base);
	}

	return base;
}

export const timer = typeof performance !== 'undefined'
&& performance !== null
&& typeof performance.now === 'function'
	? performance
	: Date;
