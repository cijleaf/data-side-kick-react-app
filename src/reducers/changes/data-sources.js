import createAsyncAction from '../utils/create-async-action';
import createAction from '../utils/create-action';
import createReducer from '../utils/create-reducer';
import axios from '../../utils/axios';
import * as activeTablesActions from './active-tables';
import { clearRestoreList } from './to-restore';
import * as changesListActions from './changes-list';

function getDropdownDataSources(dataSources) {
  return dataSources.map(({ id, name }) => ({ key: id, value: id.toString(), text: name }));
}

const REQUEST_DATA_SOURCE = 'REQUEST_DATA_SOURCE';
const DATA_SOURCE_SUCCESS_RESPONSE = 'DATA_SOURCE_SUCCESS_RESPONSE';
const DATA_SOURCE_RESPONSE_FAILURE = 'DATA_SOURCE_RESPONSE_FAILURE';
const CHANGE_SELECTED_DATA_SOURCE = 'CHANGE_SELECTED_DATA_SOURCE';

export const fetch = createAsyncAction([
  REQUEST_DATA_SOURCE,
  DATA_SOURCE_SUCCESS_RESPONSE,
  DATA_SOURCE_RESPONSE_FAILURE,
], async (dispatch, getState) => {
  try {
    const { user: { id } } = getState();

    dispatch(activeTablesActions.clearActiveTables());
    dispatch(changesListActions.clearList());

    const {
      data: list,
      data: { length: count },
    } = await axios(`backup/datasource/${id}`);

    const dropdownList = getDropdownDataSources(list);

    if (count > 0) {
      const [{ id: activeDataSourceId }] = list;

      return { list, count, activeDataSourceId, dropdownList };
    }

    return { list, count, dropdownList };
  } catch (error) {
    console.error(error);

    throw error;
  }
}, (dispatch, getState, { list }) => {
  const [{ active_table_names: activeTablesList }] = list;

  dispatch(activeTablesActions.passActiveTables(activeTablesList));
});

export const changeDataSourceId = createAction(CHANGE_SELECTED_DATA_SOURCE, 'activeDataSourceId');

export function changeDataSource(activeDataSourceId) {
  return (dispatch, getState) => {
    const { changes: { dataSources: { list } } } = getState();

    dispatch(changeDataSourceId(activeDataSourceId));

    dispatch(clearRestoreList());

    const { active_table_names: activeTablesList } = list.find(({ id }) => id === activeDataSourceId);

    if (activeTablesList) {
      dispatch(activeTablesActions.passActiveTables(activeTablesList));
    }
  };
}

const initialState = {
  isFetching: false,
  isFailed: false,
  list: [],
  count: 0,
  activeDataSourceId: undefined,
  dropdownList: [],
  error: undefined,
};

export default createReducer(initialState, {
  [REQUEST_DATA_SOURCE]: state => ({ ...state, isFetching: true, isFailed: false, error: null }),
  [DATA_SOURCE_SUCCESS_RESPONSE]: (state, { response }) => ({ ...state, isFetching: false, ...response }),
  [DATA_SOURCE_RESPONSE_FAILURE]: (state, { error }) => ({ ...state, isFetching: false, isFailed: true, error }),
  [CHANGE_SELECTED_DATA_SOURCE]: (state, { activeDataSourceId }) => ({ ...state, activeDataSourceId }),
});
