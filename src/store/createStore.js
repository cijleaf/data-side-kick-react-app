import { createStore, applyMiddleware, compose } from 'redux';
import { browserHistory } from 'react-router';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import asyncMiddleware from './middlewares/async-middleware';
import reducers from '../reducers';

const { env: { NODE_ENV } } = process;

function generateCompose(...middlewares) {
  if (NODE_ENV === 'development') {
    const { default: instrument } = require('redux-devtools-instrument');

    return compose(
      ...middlewares,
      instrument(),
    );
  }

  return compose(
    ...middlewares,
  );
}

export default (initialState = {}) => {
  const store = createStore(
    reducers,
    initialState,
    generateCompose(
      applyMiddleware(
        thunk,
        asyncMiddleware,
        routerMiddleware(browserHistory),
      ),
    ),
  );

  if (NODE_ENV === 'development') {
    if (module.hot) {
      module.hot.accept('../reducers', () => {
        const nextReducers = require('../reducers').default;

        store.replaceReducer(nextReducers);
      });
    }
  }

  return store;
};
