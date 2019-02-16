import createAsyncAction from '../utils/create-async-action';
import createAction from '../utils/create-action';
import createReducer from '../utils/create-reducer';
import axios from '../../utils/axios';
import * as activeTablesActions from './active-tables';
import { clearRestoreList } from './actions';
import * as dataActions from './data';

const getDropdownDataSources = dataSources => dataSources.map(({ id, name }) => ({ key: id, value: id.toString(), text: name }));

const SUGGESTIONS_DATA_SOURCE_REQUEST = 'SUGGESTIONS_DATA_SOURCE_REQUEST';
const SUGGESTIONS_DATA_SOURCE_SUCCESS_RESPONSE = 'SUGGESTIONS_DATA_SOURCE_SUCCESS_RESPONSE';
const SUGGESTIONS_DATA_SOURCE_RESPONSE_FAILURE = 'SUGGESTIONS_DATA_SOURCE_RESPONSE_FAILURE';
const SUGGESTIONS_DATA_SOURCE_CHANGE = 'SUGGESTIONS_DATA_SOURCE_CHANGE';

export const fetch = createAsyncAction([
  SUGGESTIONS_DATA_SOURCE_REQUEST,
  SUGGESTIONS_DATA_SOURCE_SUCCESS_RESPONSE,
  SUGGESTIONS_DATA_SOURCE_RESPONSE_FAILURE,
], async (dispatch, getState) => {
  try {
    const { user: { id } } = getState();

    dispatch(activeTablesActions.clearActiveTables());
    dispatch(dataActions.clearList());

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
  try {
    if (list.length > 0) {
      const [{ active_table_names: activeTablesList }] = list;

      dispatch(activeTablesActions.passActiveTables(activeTablesList));
    }
  } catch (error) {
    console.error(error);

    throw error;
  }
});

export const changeDataSourceId = createAction(SUGGESTIONS_DATA_SOURCE_CHANGE, 'activeDataSourceId');

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
  [SUGGESTIONS_DATA_SOURCE_REQUEST]: state => ({ ...state, isFetching: true, isFailed: false, error: null }),
  [SUGGESTIONS_DATA_SOURCE_SUCCESS_RESPONSE]: (state, { response }) => ({ ...state, isFetching: false, ...response }),
  [SUGGESTIONS_DATA_SOURCE_RESPONSE_FAILURE]: (state, { error }) => ({ ...state, isFetching: false, isFailed: true, error }),
  [SUGGESTIONS_DATA_SOURCE_CHANGE]: (state, { activeDataSourceId }) => ({ ...state, activeDataSourceId }),
});
