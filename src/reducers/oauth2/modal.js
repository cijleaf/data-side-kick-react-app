import createAction from '../utils/create-action';
import createReducer from '../utils/create-reducer';

const OAUTH2_MODAL_ACTIVATE_MODAL = 'OAUTH2_MODAL_ACTIVATE_MODAL';
const OAUTH2_MODAL_DEACTIVATE_MODAL = 'OAUTH2_MODAL_DEACTIVATE_MODAL';

export const activate = createAction(OAUTH2_MODAL_ACTIVATE_MODAL);
export const deactivate = createAction(OAUTH2_MODAL_DEACTIVATE_MODAL);

const initialState = {
  isActive: false,
};

export default createReducer(initialState, {
  [OAUTH2_MODAL_ACTIVATE_MODAL]: state => ({ ...state, isActive: true }),
  [OAUTH2_MODAL_DEACTIVATE_MODAL]: state => ({ ...state, isActive: false }),
});
