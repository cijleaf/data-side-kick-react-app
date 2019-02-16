import { combineReducers } from 'redux';
import dataSources from './data-sources';
import activeTables from './active-tables';
import filters from './filters';
import changesList from './changes-list';
import toRestore from './to-restore';

export default combineReducers({
  dataSources,
  activeTables,
  filters,
  changesList,
  toRestore,
});
