export default function is(...validations) {
  return (value, ...options) => {
    const { length } = validations;

    for (let index = 0; index < length; index += 1) {
      const validation = validations[index];
      const validatonResult = validation(value, ...options);

      if (validatonResult) {
        return validatonResult;
      }
    }

    return undefined;
  };
}

export function createValidation(arg) {
  return (fields) => {
    if (typeof arg === 'function') {
      const validation = arg;

      return validation(fields);
    } else if (typeof arg === 'object') {
      const validators = arg;

      return Object.keys(validators).reduce((container, field) => {
        const { [field]: value } = fields;
        const { [field]: validator } = validators;

        if (validator) {
          return Object.assign(container, { [field]: validator(value) });
        }

        return container;
      }, {});
    }
  };
}
