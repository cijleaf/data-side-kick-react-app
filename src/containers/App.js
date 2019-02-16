import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { ReduxAsyncConnect } from 'redux-connect';

const { env: { NODE_ENV } } = process;

const { object } = PropTypes;

export default class App extends Component {
  static propTypes = {
    store: object.isRequired,
    history: object.isRequired,
    routes: object.isRequired,
  };

  render() {
    const { props: { store, history, routes } } = this;

    if (NODE_ENV === 'development') {
      const { AppContainer } = require('react-hot-loader');

      return (
        <AppContainer>
          <Provider store={store}>
            <Router
              history={history}
              routes={routes}
              render={props => <ReduxAsyncConnect {...props} />}
            />
          </Provider>
        </AppContainer>
      );
    }

    return (
      <Provider store={store}>
        <Router
          history={history}
          routes={routes}
          render={props => <ReduxAsyncConnect {...props} />}
        />
      </Provider>
    );
  }
}
