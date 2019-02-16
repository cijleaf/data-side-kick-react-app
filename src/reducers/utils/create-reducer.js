export default (initialState, handlers) => (state = initialState, { type, ...payload }) => {
  const { [type]: action } = handlers;

  if (action) {
    return action(state, payload);
  }

  return state;
};

// Is a best practices for creating reducers, instead of clear function.
// Is also make you life ease)
// Is official recomendation http://redux.js.org/docs/recipes/ReducingBoilerplate.html
