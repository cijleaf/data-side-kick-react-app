import React from 'react';
import { IndexRoute, IndexRedirect, Route } from 'react-router';
import { routerActions } from 'react-router-redux';
import { UserAuthWrapper } from 'redux-auth-wrapper';
import Root from './containers/Root';
import Home from './containers/Home';
import MarketingHome from './containers/MarketingHome';
import Changes from './containers/Changes';
import Suggestions from './containers/Suggestions';
import Login from './containers/Login';
import NewAccount from './containers/NewAccount';
// import ActivityFeed from './containers/ActivityFeed';
import Main from './containers/Main';
import Settings from './containers/Settings';
import Connections from './containers/Connections/Connections';

const UserIsAuthenticated = UserAuthWrapper({
  authSelector: ({ user }) => user,
  predicate: ({ isAuthenticated }) => isAuthenticated,
  redirectAction: routerActions.replace,
  wrapperDisplayName: 'UserIsAuthenticated',
  failureRedirectPath: (state, ownProps) => ownProps.location.query.redirect || '/login',
});

const UserIsNotAuthenticated = UserAuthWrapper({
  authSelector: ({ user }) => user,
  predicate: ({ isAuthenticated }) => !isAuthenticated,
  redirectAction: routerActions.replace,
  wrapperDisplayName: 'UserIsNotAuthenticated',
  failureRedirectPath: (state, ownProps) => ownProps.location.query.redirect || '/main',
  allowRedirectBack: false,
});

export default (
  <Route path="/" component={Root}>
    <IndexRoute components={{ children: UserIsNotAuthenticated(Home), meeting: UserIsNotAuthenticated(MarketingHome) }} />
    <Route path="/main" component={UserIsAuthenticated(Main)} />
    <Route path="/changes" component={UserIsAuthenticated(Changes)} />
    <Route path="/suggestions" component={UserIsAuthenticated(Suggestions)} />
    <Route path="/settings" component={UserIsAuthenticated(Settings)}>
      <IndexRedirect to="/settings/connections" />
      {/* FIXME: Set redirect to right default route when we add more */}
      <Route path="/settings/connections" component={Connections} />
    </Route>
    <Route path="/login" component={UserIsNotAuthenticated(Login)} />
    <Route path="/new-account" component={UserIsNotAuthenticated(NewAccount)} />
  </Route>
);
