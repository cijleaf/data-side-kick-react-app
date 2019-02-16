function resolveRequest(request, dispatch, getState, payload) {
  const { cancels } = request;
  const isHaveCancelsContainer = Array.isArray(cancels);

  const settings = {
    cancelable(cancel) {
      if (isHaveCancelsContainer) {
        cancels.push(cancel);
      } else {
        Object.assign(request, { cancels: [cancel] });
      }
    },
  };

  if (isHaveCancelsContainer && cancels.length > 0) {
    cancels.forEach(cancel => cancel());

    cancels.length = 0;
  }

  const promise = request(dispatch, getState, settings, ...payload);

  Object.assign(request, { promise });

  return new Promise(async (res, rej) => {
    try {
      const response = await promise;

      if (request.promise === promise) {
        if (typeof response === 'function') {
          const responseResult = response();

          res(responseResult);
        } else {
          res(response);
        }
      }
    } catch (error) {
      if (request.promise === promise) {
        rej(error);
      }
    }
  });
}

export default store => next => async (action) => {
  const { types, request, success, failure, payload } = action;

  if (types && request) {
    if (!Array.isArray(types) || types.length !== 3 || !types.every(type => typeof type === 'string')) {
      throw new Error('Expected an array of three string types.');
    }

    if (typeof request !== 'function') {
      throw new Error('Expected request to be a function.');
    }

    const { dispatch, getState } = store;

    const [REQUEST_TYPE, SUCCESS_TYPE, FAILURE_TYPE] = types;

    try {
      dispatch({ type: REQUEST_TYPE });

      const response = await resolveRequest(request, dispatch, getState, payload);

      dispatch({ type: SUCCESS_TYPE, response });

      if (success) {
        success(dispatch, getState, response, ...payload);
      }
    } catch (error) {
      dispatch({ type: FAILURE_TYPE, error });

      if (failure) {
        failure(dispatch, getState, error, ...payload);
      }
    }
  } else {
    next(action);
  }
};
