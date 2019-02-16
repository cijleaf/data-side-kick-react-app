import createAction from '../utils/create-action';
import createAsyncAction from '../utils/create-async-action';
import createReducer from '../utils/create-reducer';
import axios from '../../utils/axios';
import repeatIf from '../../utils/repeat-if';

const { isArray } = Array;

const priorityFields = {
  Lead: [
    'Status',
    'Phone',
    'Title',
    'Company',
    'Email',
    'LastName',
    'FirstName',
  ],
};

const normalize = list => (dispatch, getState) => list.map(({ id, data_source: dataSourceId, results, diffs }) => {
  const suggestion = {
    id,
    dataSourceId,
  };

  if (isArray(results)) {
    const records = results.map(result => ({ id: result }));

    Object.assign(suggestion, { records });
  }

  if (diffs) {
    const { suggestions: { activeTables: { activeTableName } } } = getState();

    const priorityTableFields = priorityFields[activeTableName];

    const approves = Object.keys(diffs).map(key => ({
      name: key,
      values: diffs[key],
    })).map(({ name, values: [value], values }) => {
      const approve = {
        primary: priorityTableFields.includes(name),
        name,
        value,
      };

      if (values.length > 1) {
        Object.assign(approve, {
          options: values.map(optionValue => ({
            key: optionValue,
            text: optionValue,
            value: optionValue,
          })),
        });
      }

      return approve;
    }).sort((prevApprove, nextApprove) => {
      const prevApproveIndex = priorityTableFields.indexOf(prevApprove.name);
      const nextApproveIndex = priorityTableFields.indexOf(nextApprove.name);

      if (nextApproveIndex > prevApproveIndex) {
        return 1;
      }

      if (nextApproveIndex < prevApproveIndex) {
        return -1;
      }

      return 0;
    });

    Object.assign(suggestion, { approves });
  }

  return suggestion;
});

const SUGGESTIONS_DATA_REQUEST = 'SUGGESTIONS_DATA_REQUEST';
const SUGGESTIONS_DATA_SUCCESS_RESPONSE = 'SUGGESTIONS_DATA_SUCCESS_RESPONSE';
const SUGGESTIONS_DATA_RESPONSE_FAILURE = 'SUGGESTIONS_DATA_RESPONSE_FAILURE';
const SUGGESTIONS_DATA_SET_PAGE = 'SUGGESTIONS_DATA_SET_PAGE';
const SUGGESTIONS_DATA_CLEAR_LIST = 'SUGGESTIONS_DATA_CLEAR_LIST';
const SUGGESTIONS_DATA_SET_SHOW_ALL_APPROVES = 'SUGGESTIONS_DATA_SET_SHOW_ALL_APPROVES';
const SUGGESTIONS_DATA_SET_HIDE_ALL_APPROVES = 'SUGGESTIONS_DATA_SET_HIDE_ALL_APPROVES';
const SUGGESTIONS_DATA_SET_MERGE_SUBMITTING = 'SUGGESTIONS_DATA_SET_MERGE_SUBMITTING';
const SUGGESTIONS_DATA_SET_MERGE_SUBMITTING_SUCCESS = 'SUGGESTIONS_DATA_SET_MERGE_SUBMITTING_SUCCESS';
const SUGGESTIONS_DATA_SET_MERGE_SUBMITTING_FAILURE = 'SUGGESTIONS_DATA_SET_MERGE_SUBMITTING_FAILURE';
const SUGGESTIONS_DATA_SET_MERGING_STATUS = 'SUGGESTIONS_DATA_SET_MERGING_STATUS';
const SUGGESTIONS_DATA_SET_MERGE_ALL_SUBMITTING = 'SUGGESTIONS_DATA_SET_MERGE_ALL_SUBMITTING';
const SUGGESTIONS_DATA_SET_MERGE_ALL_SUBMITTING_SUCCESS = 'SUGGESTIONS_DATA_SET_MERGE_ALL_SUBMITTING_SUCCESS';
const SUGGESTIONS_DATA_SET_MERGE_ALL_SUBMITTING_FAILURE = 'SUGGESTIONS_DATA_SET_MERGE_ALL_SUBMITTING_FAILURE';
const SUGGESTIONS_DATA_SET_IGNORE_SUBMITTING = 'SUGGESTIONS_DATA_SET_IGNORE_SUBMITTING';
const SUGGESTIONS_DATA_SET_IGNORE_SUBMITTING_SUCCESS = 'SUGGESTIONS_DATA_SET_IGNORE_SUBMITTING_SUCCESS';
const SUGGESTIONS_DATA_SET_IGNORE_SUBMITTING_FAILURE = 'SUGGESTIONS_DATA_SET_IGNORE_SUBMITTING_FAILURE';
const SUGGESTIONS_DATA_SET_APPROVE_SUBMITTING = 'SUGGESTIONS_DATA_SET_APPROVE_SUBMITTING';
const SUGGESTIONS_DATA_SET_APPROVE_SUBMITTING_SUCCESS = 'SUGGESTIONS_DATA_SET_APPROVE_SUBMITTING_SUCCESS';
const SUGGESTIONS_DATA_SET_APPROVE_SUBMITTING_FAILURE = 'SUGGESTIONS_DATA_SET_APPROVE_SUBMITTING_FAILURE';
const SUGGESTIONS_DATA_SET_SILENT_FETCHING = 'SUGGESTIONS_DATA_SET_SILENT_FETCHING';

export const setPage = createAction(SUGGESTIONS_DATA_SET_PAGE, 'page');
export const clearList = createAction(SUGGESTIONS_DATA_CLEAR_LIST);
export const setShowAllApproves = createAction(SUGGESTIONS_DATA_SET_SHOW_ALL_APPROVES, 'id');
export const setHideAllApproves = createAction(SUGGESTIONS_DATA_SET_HIDE_ALL_APPROVES, 'id');
export const setMergeSubmitting = createAction(SUGGESTIONS_DATA_SET_MERGE_SUBMITTING, 'id');
export const setMergeSubmittingSuccess = createAction(SUGGESTIONS_DATA_SET_MERGE_SUBMITTING_SUCCESS, 'id');
export const setMergeSubmittingFailure = createAction(SUGGESTIONS_DATA_SET_MERGE_SUBMITTING_FAILURE, 'id', 'error');
export const setMergingStatus = createAction(SUGGESTIONS_DATA_SET_MERGING_STATUS, 'id', 'status');
export const setIgnoreSubmitting = createAction(SUGGESTIONS_DATA_SET_IGNORE_SUBMITTING, 'id');
export const setIgnoreSubmittingSuccess = createAction(SUGGESTIONS_DATA_SET_IGNORE_SUBMITTING_SUCCESS, 'id');
export const setIgnoreSubmittingFailure = createAction(SUGGESTIONS_DATA_SET_IGNORE_SUBMITTING_FAILURE, 'id', 'error');
export const setApproveSubmitting = createAction(SUGGESTIONS_DATA_SET_APPROVE_SUBMITTING, 'id', 'name');
export const setApproveSubmittingSuccess = createAction(SUGGESTIONS_DATA_SET_APPROVE_SUBMITTING_SUCCESS, 'id', 'name', 'value');
export const setApproveSubmittingFailure = createAction(SUGGESTIONS_DATA_SET_APPROVE_SUBMITTING_FAILURE, 'id', 'name', 'error');
export const setSilentFetching = createAction(SUGGESTIONS_DATA_SET_SILENT_FETCHING);

export const fetch = createAsyncAction([
  SUGGESTIONS_DATA_REQUEST,
  SUGGESTIONS_DATA_SUCCESS_RESPONSE,
  SUGGESTIONS_DATA_RESPONSE_FAILURE,
], async (dispatch, getState) => {
  try {
    const {
      suggestions: {
        data: { limit, page },
        dataSources: { activeDataSourceId },
        activeTables: { activeTableName },
      },
    } = getState();

    const { data: { results: list, count } } = await axios({
      url: `backup/dup-group-list/${activeDataSourceId}/${activeTableName}`,
      params: {
        status: 'PENDING',
        confidence: 'high',
        limit: page * limit,
        offset: 0,
      },
    });

    return {
      list: dispatch(normalize(list)),
      count,
    };
  } catch (error) {
    console.error(error);

    throw error;
  }
});

export const setNextPage = () => (dispatch, getState) => {
  const { suggestions: { data: { page: oldPage } } } = getState();

  const page = oldPage + 1;

  dispatch(setPage(page));

  dispatch(fetch());
};

export const applyFilters = () => (dispatch) => {
  dispatch(clearList());

  dispatch(setPage(1));

  dispatch(fetch());
};

export const merge = ({ id, dataSourceId }) => async (dispatch) => {
  try {
    dispatch(setMergeSubmitting(id));

    const { data: { task_id, status: mergeStatus } } = await axios.post('backup/merge', [{ data_source_pk: dataSourceId, duplicate_group_pk: id }]);

    dispatch(setMergeSubmittingSuccess(id));

    dispatch(setMergingStatus(id, mergeStatus));

    if (mergeStatus === 'PENDING') {
      const { data: { status } } = await repeatIf(
        async () => await axios.get(`backup/get-task-status/${task_id}`),
        ({ status: handlerStatus }) => handlerStatus === 'PENDING',
        5000,
      );

      dispatch(setMergingStatus(id, status));
    }

    dispatch(setSilentFetching());

    dispatch(fetch());
  } catch (error) {
    console.error(error.config);

    if (error.response) {
      console.error(error.response.data);

      dispatch(setMergeSubmittingFailure(id, error.response.data));
    } else {
      console.error(error.message);

      dispatch(setMergeSubmittingFailure(id));
    }

    dispatch(setMergingStatus(id, 'ERROR'));

    throw error;
  }
};

export const mergeAll = createAsyncAction([
  SUGGESTIONS_DATA_SET_MERGE_ALL_SUBMITTING,
  SUGGESTIONS_DATA_SET_MERGE_ALL_SUBMITTING_SUCCESS,
  SUGGESTIONS_DATA_SET_MERGE_ALL_SUBMITTING_FAILURE,
], async (dispatch, getState) => {
  try {
    const { suggestions: { data: { list } } } = getState();

    const suggestions = list.map(({ id, dataSourceId }) => ({ duplicate_group_pk: id, data_source_pk: dataSourceId }));

    await axios.post('backup/merge', suggestions);

    dispatch(clearList());

    dispatch(fetch());
  } catch (error) {
    console.error(error);

    throw error;
  }
});

export const ignore = ({ id, dataSourceId }) => async (dispatch) => {
  try {
    dispatch(setIgnoreSubmitting(id));

    await axios.put(`backup/dup-group/${id}`, { status: 'IGNORED', data_source: dataSourceId });

    dispatch(setIgnoreSubmittingSuccess(id));

    dispatch(clearList());

    dispatch(fetch());
  } catch (error) {
    dispatch(setIgnoreSubmittingFailure(id, error));

    throw error;
  }
};

export const approve = (id, name, value) => async (dispatch) => {
  try {
    dispatch(setApproveSubmitting(id, name));

    await axios.post('backup/set-surviving-value', {
      duplicate_group_pk: id,
      field_name: name,
      zero_value: value,
    });

    dispatch(setApproveSubmittingSuccess(id, name, value));
  } catch (error) {
    dispatch(setApproveSubmittingFailure(id, name, error));

    throw error;
  }
};

const initialState = {
  isFetching: false,
  isFailed: false,
  isSilent: false,
  list: undefined,
  count: 0,
  limit: 20,
  page: 1,
  error: undefined,
  isMergingAllSubmitting: false,
  isMergingAllSubmittingError: undefined,
};

const updateSuggestion = (list, id, update) => list.map(suggestion => (suggestion.id === id ? { ...suggestion, ...update } : { ...suggestion }));

const updateSuggestionApprove = (list, id, name, update) => list.map(suggestion => (suggestion.id === id ? {
  ...suggestion,
  approves: suggestion.approves.map(approveItem => (approveItem.name === name ? { ...approveItem, ...update } : { ...approveItem })),
} : { ...suggestion }));

export default createReducer(initialState, {
  [SUGGESTIONS_DATA_SET_PAGE]: (state, { page }) => ({ ...state, page }),
  [SUGGESTIONS_DATA_REQUEST]: state => ({ ...state, isFetching: true, isFailed: false, error: null }),
  [SUGGESTIONS_DATA_SUCCESS_RESPONSE]: (state, { response: data }) => ({ ...state, isFetching: false, isSilent: false, ...data }),
  [SUGGESTIONS_DATA_RESPONSE_FAILURE]: (state, { error }) => ({ ...state, isFetching: false, isFailed: true, isSilent: false, error }),
  [SUGGESTIONS_DATA_SET_SILENT_FETCHING]: state => ({ ...state, isSilent: true }),
  [SUGGESTIONS_DATA_CLEAR_LIST]: state => ({ ...state, list: [], count: 0, page: 1 }),
  [SUGGESTIONS_DATA_SET_SHOW_ALL_APPROVES]: ({ list, ...state }, { id }) =>
    ({ ...state, list: updateSuggestion(list, id, { showAllApproves: true }) }),
  [SUGGESTIONS_DATA_SET_HIDE_ALL_APPROVES]: ({ list, ...state }, { id }) =>
    ({ ...state, list: updateSuggestion(list, id, { showAllApproves: false }) }),
  [SUGGESTIONS_DATA_SET_MERGE_SUBMITTING]: ({ list, ...state }, { id }) =>
    ({ ...state, list: updateSuggestion(list, id, { mergeSubmitting: true, mergeSubmittingError: null }) }),
  [SUGGESTIONS_DATA_SET_MERGE_SUBMITTING_SUCCESS]: ({ list, ...state }, { id }) =>
    ({ ...state, list: updateSuggestion(list, id, { mergeSubmitting: false }) }),
  [SUGGESTIONS_DATA_SET_MERGE_SUBMITTING_FAILURE]: ({ list, ...state }, { id, error }) =>
    ({ ...state, list: updateSuggestion(list, id, { mergeSubmitting: false, mergeSubmittingError: error }) }),
  [SUGGESTIONS_DATA_SET_MERGING_STATUS]: ({ list, ...state }, { id, status }) =>
    ({ ...state, list: updateSuggestion(list, id, { mergingStatus: status }) }),
  [SUGGESTIONS_DATA_SET_MERGE_ALL_SUBMITTING]: state => ({
    ...state,
    isMergingAllSubmitting: true,
    isMergingAllSubmittingError: null,
  }),
  [SUGGESTIONS_DATA_SET_MERGE_ALL_SUBMITTING_SUCCESS]: state => ({
    ...state,
    isMergingAllSubmitting: false,
  }),
  [SUGGESTIONS_DATA_SET_MERGE_ALL_SUBMITTING_FAILURE]: (state, { error }) => ({
    ...state,
    isMergingAllSubmitting: false,
    isMergingAllSubmittingError: error,
  }),
  [SUGGESTIONS_DATA_SET_IGNORE_SUBMITTING]: ({ list, ...state }, { id }) =>
    ({ ...state, list: updateSuggestion(list, id, { ignoreSubmitting: true, ignoreSubmittingError: null }) }),
  [SUGGESTIONS_DATA_SET_IGNORE_SUBMITTING_SUCCESS]: ({ list, ...state }, { id }) =>
    ({ ...state, list: updateSuggestion(list, id, { ignoreSubmitting: false }) }),
  [SUGGESTIONS_DATA_SET_IGNORE_SUBMITTING_FAILURE]: ({ list, ...state }, { id, error }) =>
    ({ ...state, list: updateSuggestion(list, id, { ignoreSubmitting: false, ignoreSubmittingError: error }) }),
  [SUGGESTIONS_DATA_SET_APPROVE_SUBMITTING]: ({ list, ...state }, { id, name }) =>
    ({ ...state, list: updateSuggestionApprove(list, id, name, { isSubmitting: true, isSubmittingError: null }) }),
  [SUGGESTIONS_DATA_SET_APPROVE_SUBMITTING_SUCCESS]: ({ list, ...state }, { id, name, value }) =>
    ({ ...state, list: updateSuggestionApprove(list, id, name, { isSubmitting: false, value }) }),
  [SUGGESTIONS_DATA_SET_APPROVE_SUBMITTING_FAILURE]: ({ list, ...state }, { id, error }) =>
    ({ ...state, list: updateSuggestionApprove(list, id, name, { isSubmitting: false, isSubmittingError: error }) }),
});
