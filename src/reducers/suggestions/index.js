import { combineReducers } from 'redux';
import dataSources from './data-sources';
import activeTables from './active-tables';
import data from './data';
import actions from './actions';

export default combineReducers({
  dataSources,
  activeTables,
  data,
  actions,
});
