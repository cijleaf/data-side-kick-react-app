import createAsyncAction from '../utils/create-async-action';
import createReducer from '../utils/create-reducer';
import axios from '../../utils/axios';
import { deactivate as deactivateModal } from './modal';
import * as connectionsActions from '../connections';

const OAUTH2_SALESFORCE_REQUEST = 'OAUTH2_SALESFORCE_REQUEST';
const OAUTH2_SALESFORCE_SUCCESS_RESPONSE = 'OAUTH2_SALESFORCE_SUCCESS_RESPONSE';
const OAUTH2_SALESFORCE_RESPONSE_FAILURE = 'OAUTH2_SALESFORCE_RESPONSE_FAILURE';

export const submit = createAsyncAction([
  OAUTH2_SALESFORCE_REQUEST,
  OAUTH2_SALESFORCE_SUCCESS_RESPONSE,
  OAUTH2_SALESFORCE_RESPONSE_FAILURE,
], async (dispatch, getState, settings, { code }) => {
  try {
    const { user: { organization_membership_with_admin_access: [firstOrganizationMembershipId] } } = getState();
    // const { oauth2: { organizationSelector: { selectedOrganizationId } } } = getState();
    // FIXME: in future use it

    await axios.post('salesforce/accounts/upsert', {
      organization_pk: firstOrganizationMembershipId,
      // organization_pk: selectedOrganizationId,
      // FIXME: in future use it
      is_sandbox: false,
      code,
    });

    dispatch(deactivateModal());

    dispatch(connectionsActions.newConnectionIsAddedActivateWithDeactivateDelay());

    dispatch(connectionsActions.fetch());
  } catch (error) {
    try {
      dispatch(deactivateModal());

      dispatch(connectionsActions.addNewConnectionErrorActivateWithDeactivateDelay());

      throw error;
    } catch (nestedError) {
      console.error(nestedError);

      throw nestedError;
    }
  }
});

const initialState = {
  isFetching: false,
  isFailed: false,
  error: undefined,
};

export default createReducer(initialState, {
  [OAUTH2_SALESFORCE_REQUEST]: state => ({ ...state, isFetching: true, isFailed: false, error: null }),
  [OAUTH2_SALESFORCE_SUCCESS_RESPONSE]: state => ({ ...state, isFetching: false }),
  [OAUTH2_SALESFORCE_RESPONSE_FAILURE]: (state, { error }) => ({ ...state, isFetching: false, isFailed: true, error }),
});
