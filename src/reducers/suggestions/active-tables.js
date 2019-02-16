import createAction from '../utils/create-action';
import createReducer from '../utils/create-reducer';
import * as dataActions from './data';
import { clearRestoreList } from './actions';

function getDropdownTables(tables) {
  return tables.map(name => ({ key: name, value: name, text: name }));
}

const SUGGESTIONS_ACTIVE_TABLES_SET = 'SUGGESTIONS_ACTIVE_TABLES_SET';
const SUGGESTIONS_ACTIVE_TABLES_SET_ACTIVE_TABLE_NAME = 'SUGGESTIONS_ACTIVE_TABLES_SET_ACTIVE_TABLE_NAME';
const SUGGESTIONS_ACTIVE_TABLES_CLEAR = 'SUGGESTIONS_ACTIVE_TABLES_CLEAR';

export const setActiveTables = createAction(SUGGESTIONS_ACTIVE_TABLES_SET, 'data');
export const setActiveTableName = createAction(SUGGESTIONS_ACTIVE_TABLES_SET_ACTIVE_TABLE_NAME, 'activeTableName');
export const clearActiveTables = createAction(SUGGESTIONS_ACTIVE_TABLES_CLEAR);

export function passActiveTables(list) {
  const { length: count } = list;
  const [activeTableName] = list;
  const activeTableNameInLowerCase = activeTableName;

  const dropdownTables = getDropdownTables(list);

  return (dispatch) => {
    dispatch(setActiveTables({ list, count, dropdownTables, activeTableName: activeTableNameInLowerCase }));

    dispatch(dataActions.clearList());

    dispatch(dataActions.fetch());
  };
}

export const changeActiveTable = activeTableName => (dispatch) => {
  dispatch(setActiveTableName(activeTableName));

  dispatch(clearRestoreList());

  dispatch(dataActions.clearList());

  dispatch(dataActions.fetch());
};

const initialState = {
  list: [],
  count: 0,
  dropdownTables: [],
  activeTableName: undefined,
};

export default createReducer(initialState, {
  [SUGGESTIONS_ACTIVE_TABLES_SET]: (state, { data }) => ({ ...state, ...data }),
  [SUGGESTIONS_ACTIVE_TABLES_SET_ACTIVE_TABLE_NAME]: (state, { activeTableName }) => ({ ...state, activeTableName }),
  [SUGGESTIONS_ACTIVE_TABLES_CLEAR]: state => ({ ...state, list: [], count: 0, activeTableName: undefined }),
});
