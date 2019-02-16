import createAction from '../utils/create-action';
import createAsyncAction from '../utils/create-async-action';
import createReducer from '../utils/create-reducer';
import axios from '../../utils/axios';
import * as changesListActions from './changes-list';

const CHANGE_TO_RESTORE = 'CHANGE_TO_RESTORE';
const CLEAR_RESTORE = 'CLEAR_RESTORE';
const REQUEST_TO_RESTORE = 'REQUEST_TO_RESTORE';
const TO_RESTORE_SUCCESS_RESPONSE = 'TO_RESTORE_SUCCESS_RESPONSE';
const TO_RESTORE_RESPONSE_FAILURE = 'TO_RESTORE_RESPONSE_FAILURE';

export const toRestore = createAction(CHANGE_TO_RESTORE, 'change');
export const clearRestoreList = createAction(CLEAR_RESTORE, 'change');

export const sendToRestore = createAsyncAction([
  REQUEST_TO_RESTORE,
  TO_RESTORE_SUCCESS_RESPONSE,
  TO_RESTORE_RESPONSE_FAILURE,
], async (dispatch, getState) => {
  try {
    const { changes: { toRestore: { list: changesToRestore } } } = getState();

    await axios.post('backup/restore', changesToRestore);

    dispatch(clearRestoreList());

    dispatch(changesListActions.fetch());
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
  [CHANGE_TO_RESTORE]: ({ list, ...otherStateData }, { change }) => {
    const newListState = selectChangeToRestore(list, change);
    const { length: count } = newListState;

    return {
      ...otherStateData,
      list: newListState,
      count,
    };
  },
  [CLEAR_RESTORE]: state => ({ ...state, list: [], count: 0 }),
  [REQUEST_TO_RESTORE]: state => ({ ...state, isSubmitting: true, isFailed: false, error: null }),
  [TO_RESTORE_SUCCESS_RESPONSE]: state => ({ ...state, isSubmitting: false }),
  [TO_RESTORE_RESPONSE_FAILURE]: (state, { error }) => ({ ...state, isSubmitting: false, isFailed: true, error }),
});
