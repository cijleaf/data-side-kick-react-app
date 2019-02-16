import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as reduxAsyncConnect } from 'redux-connect';
import ui from './ui';
import user from './user';
import oauth2 from './oauth2';
import connections from './connections';
import changes from './changes';
import suggestions from './suggestions';

export default combineReducers({
  routing,
  reduxAsyncConnect,
  form,
  ui,
  user,
  oauth2,
  connections,
  changes,
  suggestions,
});
