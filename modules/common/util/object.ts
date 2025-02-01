import { camelCase, isArray, isObject, mapKeys, mapValues } from 'lodash';

export function camelize<T>(value: T): T {
  if (!isArray(value) && !isObject(value)) {
    return value;
  }

  if (isArray(value)) {
    return value.map(camelize) as T;
  }

  const camelObj = mapKeys(value as object, (_, key) => camelCase(key));

  return mapValues(camelObj, camelize) as T;
}
