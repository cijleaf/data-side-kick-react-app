import createAction from '../utils/create-action';
import createAsyncAction from '../utils/create-async-action';
import createReducer from '../utils/create-reducer';
import axios from '../../utils/axios';
import * as filtersActions from './filters';

const REQUEST_CHANGES = 'REQUEST_CHANGES';
const CHANGES_SUCCESS_RESPONSE = 'CHANGES_SUCCESS_RESPONSE';
const CHANGES_RESPONSE_FAILURE = 'CHANGES_RESPONSE_FAILURE';
const CHANGES_SET_PAGE = 'CHANGES_SET_PAGE';
const CHANGES_CLEAR_LIST = 'CHANGES_CLEAR_LIST';

export const setPage = createAction(CHANGES_SET_PAGE, 'page');
export const clearList = createAction(CHANGES_CLEAR_LIST);

export const fetch = createAsyncAction([
  REQUEST_CHANGES,
  CHANGES_SUCCESS_RESPONSE,
  CHANGES_RESPONSE_FAILURE,
], async (dispatch, getState) => {
  try {
    const {
      changes: {
        changesList: { limit, page },
        dataSources: { activeDataSourceId },
        activeTables: { activeTableName },
      },
    } = getState();

    const { fieldFilters } = dispatch(filtersActions.getCurrentFieldNames());

    const { data: { results: list, count } } = await axios({
      url: `backup/changes/${activeDataSourceId}/${activeTableName}`,
      params: {
        field_filters: fieldFilters,
        limit: page * limit,
        offset: 0,
      },
    });

    return {
      list,
      count,
    };
  } catch (error) {
    console.error(error);

    throw error;
  }
});

export function setNextPage() {
  return (dispatch, getState) => {
    const { changes: { changesList: { page: oldPage } } } = getState();

    const page = oldPage + 1;

    dispatch(setPage(page));

    dispatch(fetch());
  };
}

export function applyFilters() {
  return (dispatch) => {
    dispatch(clearList());

    dispatch(setPage(1));

    dispatch(fetch());
  };
}

const initialState = {
  isFetching: false,
  isFailed: false,
  list: [],
  count: 0,
  limit: 20,
  page: 1,
  error: undefined,
};

export default createReducer(initialState, {
  [CHANGES_SET_PAGE]: (state, { page }) => ({ ...state, page }),
  [REQUEST_CHANGES]: state => ({ ...state, isFetching: true, isFailed: false, error: null }),
  [CHANGES_SUCCESS_RESPONSE]: (state, { response: data }) => ({ ...state, isFetching: false, ...data }),
  [CHANGES_RESPONSE_FAILURE]: (state, { error }) => ({ ...state, isFetching: false, isFailed: true, error }),
  [CHANGES_CLEAR_LIST]: state => ({ ...state, list: [], count: 0, page: 1 }),
});
