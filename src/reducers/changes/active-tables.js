import createAction from '../utils/create-action';
import createReducer from '../utils/create-reducer';
import * as changesListActions from './changes-list';
import { clearRestoreList } from './to-restore';
import * as filtersActions from './filters';

function getDropdownTables(tables) {
  return tables.map(name => ({ key: name, value: name, text: name }));
}

const ACTIVE_TABLES_SET = 'ACTIVE_TABLES_SET';
const ACTIVE_TABLES_SET_ACTIVE_TABLE_NAME = 'ACTIVE_TABLES_SET_ACTIVE_TABLE_NAME';
const ACTIVE_TABLES_CLEAR = 'ACTIVE_TABLES_CLEAR';

export const setActiveTables = createAction(ACTIVE_TABLES_SET, 'data');
export const setActiveTableName = createAction(ACTIVE_TABLES_SET_ACTIVE_TABLE_NAME, 'activeTableName');
export const clearActiveTables = createAction(ACTIVE_TABLES_CLEAR);

export function passActiveTables(list) {
  const { length: count } = list;
  const [activeTableName] = list;
  const activeTableNameInLowerCase = activeTableName;

  const dropdownTables = getDropdownTables(list);

  return (dispatch) => {
    dispatch(setActiveTables({ list, count, dropdownTables, activeTableName: activeTableNameInLowerCase }));

    dispatch(changesListActions.clearList());

    dispatch(changesListActions.fetch());

    dispatch(filtersActions.fetch());
  };
}

export const changeActiveTable = activeTableName => (dispatch) => {
  dispatch(setActiveTableName(activeTableName));

  dispatch(clearRestoreList());

  dispatch(changesListActions.clearList());

  dispatch(changesListActions.fetch());

  dispatch(filtersActions.fetch());
};

const initialState = {
  list: [],
  count: 0,
  dropdownTables: [],
  activeTableName: undefined,
};

export default createReducer(initialState, {
  [ACTIVE_TABLES_SET]: (state, { data }) => ({ ...state, ...data }),
  [ACTIVE_TABLES_SET_ACTIVE_TABLE_NAME]: (state, { activeTableName }) => ({ ...state, activeTableName }),
  [ACTIVE_TABLES_CLEAR]: state => ({ ...state, list: [], count: 0, activeTableName: undefined }),
});
