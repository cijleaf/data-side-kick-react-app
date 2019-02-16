import { SubmissionError } from 'redux-form';
import createAction from './utils/create-action';
import createAsyncAction from './utils/create-async-action';
import createReducer from './utils/create-reducer';
import axios, { setGlobalHeader } from '../utils/axios';

const USER_SET_AUTHENTICATED = 'USER_SET_AUTHENTICATED';
const USER_SET = 'USER_SET';
const USER_REMOVE = 'USER_REMOVE';
const USER_LOGOUT_REQUEST = 'USER_LOGOUT_REQUEST';
const USER_LOGOUT_SUCCESS_RESPONSE = 'USER_LOGOUT_SUCCESS_RESPONSE';
const USER_LOGOUT_RESPONSE_FAILURE = 'USER_LOGOUT_RESPONSE_FAILURE';
const REQUEST_USER = 'REQUEST_USER';
const USER_SUCCESS_RESPONSE = 'USER_SUCCESS_RESPONSE';
const USER_RESPONSE_FAILURE = 'USER_RESPONSE_FAILURE';

const setAuthorized = createAction(USER_SET_AUTHENTICATED, 'id');
const removeUser = createAction(USER_REMOVE);
const setUser = createAction(USER_SET, 'user');

export function store({ token, ...user }) {
  const { id: userId } = user;

  setGlobalHeader('Authorization', `Token ${token}`);

  localStorage.setItem('userId', userId);
  localStorage.setItem('token', token);

  return (dispatch) => {
    dispatch(setUser(user));
  };
}

export const logout = createAsyncAction([
  USER_LOGOUT_REQUEST,
  USER_LOGOUT_SUCCESS_RESPONSE,
  USER_LOGOUT_RESPONSE_FAILURE,
], async (userId, dispatch) => {
  try {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');

    dispatch(removeUser());

    await axios('accounts/logout');
  } catch (error) {
    throw error;
  }
});

export const fetch = createAsyncAction([
  REQUEST_USER,
  USER_SUCCESS_RESPONSE,
  USER_RESPONSE_FAILURE,
], async (dispatch, getState) => {
  try {
    const { user: { id } } = getState();

    const { data: user } = await axios(`accounts/user/${id}`);

    dispatch(setUser(user));
  } catch (error) {
    dispatch(logout());

    throw error;
  }
});

export async function create(values, dispatch) {
  try {
    const { data: { id, token } } = await axios.post('accounts/user/create', values);

    dispatch(store({ id, token }));

    dispatch(fetch());
  } catch (error) {
    if (error.response && error.response.data) {
      throw new SubmissionError(error.response.data);
    }

    throw new SubmissionError({ _error: 'Submit error.' });
  }
}

export async function login(values, dispatch) {
  try {
    const { data: { id, token } } = await axios.post('accounts/user/login', values);

    dispatch(store({ id, token }));

    dispatch(fetch());
  } catch (error) {
    if (error.response && typeof error.response.data === 'object') {
      throw new SubmissionError(error.response.data);
    }

    throw new SubmissionError({ _error: 'Submit error.' });
  }
}

export function assign() {
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  return async (dispatch, getState) => {
    if (typeof userId === 'string' && typeof token === 'string') {
      setGlobalHeader('Authorization', `Token ${token}`);

      dispatch(setAuthorized(userId));

      const { user: { isFetching, isLoaded, isAuthenticated } } = getState();

      if (!isLoaded && !isFetching && isAuthenticated) {
        await dispatch(fetch());
      }
    }
  };
}

const initialState = {
  isFetching: false,
  isFailed: false,
  isLoaded: false,
  id: undefined,
  email: undefined,
  first_name: undefined,
  last_name: undefined,
  org_created: undefined,
  organization_id: undefined,
  organization_name: undefined,
  organization_membership: [],
  organization_membership_with_admin_access: [],
  isAuthenticated: false,
  error: null,
};

export default createReducer(initialState, {
  [USER_SET_AUTHENTICATED]: (state, { id }) => ({ ...state, isAuthenticated: true, id }),
  [USER_SET]: (state, { user }) => ({ ...state, isLoaded: true, isAuthenticated: true, ...user }),
  [REQUEST_USER]: state => ({ ...state, isFetching: true, isLoaded: false, isFailed: false, error: null }),
  [USER_SUCCESS_RESPONSE]: state => ({ ...state, isFetching: false, isLoaded: true, isAuthenticated: true }),
  [USER_RESPONSE_FAILURE]: (state, { error }) => ({ ...state, isFetching: false, isLoaded: false, isFailed: true, isAuthenticated: false, error }),
});
