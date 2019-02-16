import React from 'react';
import { render } from 'react-dom';
import { browserHistory } from 'react-router';
import App from './containers/App';
import store from './store';
import routes from './routes';
import './styles/index.scss';

const { env: { NODE_ENV } } = process;

function renderApp() {
  render(
    <App
      store={store}
      history={browserHistory}
      routes={routes}
    />,
    document.getElementById('app'),
  );
}

if (NODE_ENV === 'development') {
  if (module.hot) {
    module.hot.accept('./routes', () => {
      require('./routes');

      renderApp();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderApp();
});
