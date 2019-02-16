import createAction from './utils/create-action';
import createAsyncAction from './utils/create-async-action';
import createReducer from './utils/create-reducer';
import axios from '../utils/axios';

const CONNECTIONS_REQUEST = 'CONNECTIONS_REQUEST';
const CONNECTIONS_SUCCESS_RESPONSE = 'CONNECTIONS_SUCCESS_RESPONSE';
const CONNECTIONS_RESPONSE_FAILURE = 'CONNECTIONS_RESPONSE_FAILURE';
const CONNECTIONS_NEW_CONNECTIONS_IS_ADDED_ACTIVATE = 'CONNECTIONS_NEW_CONNECTIONS_IS_ADDED_ACTIVATE';
const CONNECTIONS_NEW_CONNECTIONS_IS_ADDED_DEACTIVATE = 'CONNECTIONS_NEW_CONNECTIONS_IS_ADDED_DEACTIVATE';
const CONNECTIONS_ADD_NEW_CONNECTION_ERROR_ACTIVATE = 'CONNECTIONS_ADD_NEW_CONNECTION_ERROR_ACTIVATE';
const CONNECTIONS_ADD_NEW_CONNECTION_ERROR_DEACTIVATE = 'CONNECTIONS_ADD_NEW_CONNECTION_ERROR_DEACTIVATE';

export const fetch = createAsyncAction([
  CONNECTIONS_REQUEST,
  CONNECTIONS_SUCCESS_RESPONSE,
  CONNECTIONS_RESPONSE_FAILURE,
], async (dispatch, getState) => {
  try {
    const { user: { id } } = getState();

    const { data: connections, data: { length: count } } = await axios(`backup/datasource/${id}`);

    return { connections, count };
  } catch (error) {
    throw error;
  }
});

export const newConnectionIsAddedActivate = createAction(CONNECTIONS_NEW_CONNECTIONS_IS_ADDED_ACTIVATE);
export const newConnectionIsAddedDeactivate = createAction(CONNECTIONS_NEW_CONNECTIONS_IS_ADDED_DEACTIVATE);
export const addNewConnectionErrorActivate = createAction(CONNECTIONS_ADD_NEW_CONNECTION_ERROR_ACTIVATE);
export const addNewConnectionErrorDeactivate = createAction(CONNECTIONS_ADD_NEW_CONNECTION_ERROR_DEACTIVATE);

export function newConnectionIsAddedActivateWithDeactivateDelay() {
  return (dispatch) => {
    dispatch(newConnectionIsAddedActivate());

    setTimeout(() => {
      dispatch(newConnectionIsAddedDeactivate());
    }, 40000);
  };
}

export function addNewConnectionErrorActivateWithDeactivateDelay() {
  return (dispatch) => {
    dispatch(addNewConnectionErrorActivate());

    setTimeout(() => {
      dispatch(addNewConnectionErrorDeactivate());
    }, 40000);
  };
}

const initialState = {
  isFetching: false,
  isFailed: false,
  connections: [],
  count: 0,
  newConnectionIsAdded: false,
  addNewConnectionError: false,
  error: undefined,
};

export default createReducer(initialState, {
  [CONNECTIONS_REQUEST]: state => ({ ...state, isFetching: true, isFailed: false, error: null }),
  [CONNECTIONS_SUCCESS_RESPONSE]: (state, { response }) => ({ ...state, isFetching: false, ...response }),
  [CONNECTIONS_RESPONSE_FAILURE]: (state, { error }) => ({ ...state, isFetching: false, isFailed: true, error }),
  [CONNECTIONS_NEW_CONNECTIONS_IS_ADDED_ACTIVATE]: state => ({ ...state, newConnectionIsAdded: true }),
  [CONNECTIONS_NEW_CONNECTIONS_IS_ADDED_DEACTIVATE]: state => ({ ...state, newConnectionIsAdded: false }),
  [CONNECTIONS_ADD_NEW_CONNECTION_ERROR_ACTIVATE]: state => ({ ...state, addNewConnectionError: true }),
  [CONNECTIONS_ADD_NEW_CONNECTION_ERROR_DEACTIVATE]: state => ({ ...state, addNewConnectionError: false }),
});
