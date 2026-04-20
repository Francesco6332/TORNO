export const removeUndefinedValues = <T>(value: T): T => {
  if (Array.isArray(value)) {
    return value.map((item) => removeUndefinedValues(item)) as T;
  }

  if (value && typeof value === 'object' && !(value instanceof Date)) {
    return Object.entries(value).reduce<Record<string, unknown>>((result, [key, item]) => {
      if (item !== undefined) {
        result[key] = removeUndefinedValues(item);
      }

      return result;
    }, {}) as T;
  }

  return value;
};
