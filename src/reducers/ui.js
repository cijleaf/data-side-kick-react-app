import createAction from './utils/create-action';
import createReducer from './utils/create-reducer';

const UI_SET_MAIN_HEADERS = 'UI_SET_MAIN_HEADERS';
const UI_SET_SUB_HEADERS = 'UI_SET_SUB_HEADERS';

export const setMainHeader = createAction(UI_SET_MAIN_HEADERS, 'mainHeaderTop', 'mainHeaderHeight');
export const setSubHeader = createAction(UI_SET_SUB_HEADERS, 'subHeaderTop', 'subHeaderHeight');

const initialState = {
  mainHeaderTop: 0,
  mainHeaderHeight: 0,
  subHeaderTop: 0,
  subHeaderHeight: 0,
};

export default createReducer(initialState, {
  [UI_SET_MAIN_HEADERS]: (state, { mainHeaderTop, mainHeaderHeight }) => ({ ...state, mainHeaderTop, mainHeaderHeight }),
  [UI_SET_SUB_HEADERS]: (state, { subHeaderTop, subHeaderHeight }) => ({ ...state, subHeaderTop, subHeaderHeight }),
});
