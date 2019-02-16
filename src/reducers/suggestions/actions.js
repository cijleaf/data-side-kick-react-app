import createAction from '../utils/create-action';
import createAsyncAction from '../utils/create-async-action';
import createReducer from '../utils/create-reducer';
import axios from '../../utils/axios';
import * as dataActions from './data';

const SUGGESTIONS_ACTIONS_MERGE_REQUEST = 'SUGGESTIONS_ACTIONS_MERGE_REQUEST';
const SUGGESTIONS_ACTIONS_MERGE_SUCCESS_RESPONSE = 'SUGGESTIONS_ACTIONS_MERGE_SUCCESS_RESPONSE';
const SUGGESTIONS_ACTIONS_MERGE_RESPONSE_FAILURE = 'SUGGESTIONS_ACTIONS_MERGE_RESPONSE_FAILURE';
const SUGGESTIONS_ACTIONS_CHANGE = 'SUGGESTIONS_ACTIONS_CHANGE';
const SUGGESTIONS_ACTIONS_CLEAR = 'SUGGESTIONS_ACTIONS_CLEAR';
const SUGGESTIONS_ACTIONS_REQUEST = 'SUGGESTIONS_ACTIONS_REQUEST';
const SUGGESTIONS_ACTIONS_SUCCESS_RESPONSE = 'SUGGESTIONS_ACTIONS_SUCCESS_RESPONSE';
const SUGGESTIONS_ACTIONS_RESPONSE_FAILURE = 'SUGGESTIONS_ACTIONS_RESPONSE_FAILURE';

export const toRestore = createAction(SUGGESTIONS_ACTIONS_CHANGE, 'change');
export const clearRestoreList = createAction(SUGGESTIONS_ACTIONS_CLEAR, 'change');

export const merge = createAsyncAction([
  SUGGESTIONS_ACTIONS_MERGE_REQUEST,
  SUGGESTIONS_ACTIONS_MERGE_SUCCESS_RESPONSE,
  SUGGESTIONS_ACTIONS_MERGE_RESPONSE_FAILURE,
], async (dispatch, getState, props, { dataSourceId, duplicateGroupId }) => {
  try {
    await axios.post('backup/merge', [{ data_source_pk: dataSourceId, duplicate_group_pk: duplicateGroupId }]);

    dispatch(dataActions.fetch());
  } catch (error) {
    throw error;
  }
});

export const sendToRestore = createAsyncAction([
  SUGGESTIONS_ACTIONS_REQUEST,
  SUGGESTIONS_ACTIONS_SUCCESS_RESPONSE,
  SUGGESTIONS_ACTIONS_RESPONSE_FAILURE,
], async (dispatch, getState) => {
  try {
    const { changes: { toRestore: { list: changesToRestore } } } = getState();

    await axios.post('backup/restore', changesToRestore);

    dispatch(clearRestoreList());

    dispatch(dataActions.fetch());
  } catch (error) {
    throw error;
  }
});

function selectChangeToRestore(list, change) {
  const { id, rid, field: { key, value } } = change;

  let isIncludesInSameChange;
  const newListState = list.reduce((newRestoreList, restoreChange) => {
    const { pk, restoreChangeRid, restore_to } = restoreChange;

    if (key in restore_to) {
      if (pk === id && restoreChangeRid === rid) {
        if (restore_to[key] === value) {
          const restore_toState = { ...restore_to };

          delete restore_toState[key];

          const { length } = Object.keys(restore_toState);

          if (length > 0) {
            newRestoreList.push({
              ...restoreChange,
              restore_to: restore_toState,
            });
          }
        } else {
          newRestoreList.push({
            ...restoreChange,
            restore_to: {
              ...restore_to,
              [key]: value,
            },
          });
        }

        isIncludesInSameChange = true;
      } else {
        newRestoreList.push({
          ...restoreChange,
          restore_to: { ...restore_to },
        });
      }
    } else {
      newRestoreList.push({
        ...restoreChange,
        restore_to: { ...restore_to },
      });
    }

    return newRestoreList;
  }, []);

  if (!isIncludesInSameChange) {
    const alreadyCreatedRestore = newListState.find(({ pk, restoreChangeRid }) => {
      return id === pk && rid === restoreChangeRid;
    });

    if (alreadyCreatedRestore) {
      const { restore_to } = alreadyCreatedRestore;

      Object.assign(alreadyCreatedRestore, {
        restore_to: {
          ...restore_to,
          [key]: value,
        },
      });
    } else {
      newListState.push({
        pk: id,
        restoreChangeRid: rid,
        restore_to: { [key]: value },
      });
    }
  }

  return newListState;
}

const initialState = {
  isSubmitting: false,
  isFailed: false,
  list: [],
  count: 0,
  error: undefined,
};

export default createReducer(initialState, {
  [SUGGESTIONS_ACTIONS_CHANGE]: ({ list, ...otherStateData }, { change }) => {
    const newListState = selectChangeToRestore(list, change);
    const { length: count } = newListState;

    return {
      ...otherStateData,
      list: newListState,
      count,
    };
  },
  [SUGGESTIONS_ACTIONS_CLEAR]: state => ({ ...state, list: [], count: 0 }),
  [SUGGESTIONS_ACTIONS_REQUEST]: state => ({ ...state, isSubmitting: true, isFailed: false, error: null }),
  [SUGGESTIONS_ACTIONS_SUCCESS_RESPONSE]: state => ({ ...state, isSubmitting: false }),
  [SUGGESTIONS_ACTIONS_RESPONSE_FAILURE]: (state, { error }) => ({ ...state, isSubmitting: false, isFailed: true, error }),
});
