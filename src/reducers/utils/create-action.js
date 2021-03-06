export default (type, ...argNames) => (...args) => {
  const payload = argNames.reduce((container, arg, index) => {
    const { [index]: argName } = argNames;
    const { [index]: argValue } = args;

    return Object.assign(container, { [argName]: argValue });
  }, {});

  return {
    type,
    ...payload,
  };
};

// This helper function also from Redux - http://redux.js.org/docs/recipes/ReducingBoilerplate.html
