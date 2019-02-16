import { combineReducers } from 'redux';
import createPopup from '../../utils/popup';
import { url, salesforceClientId } from '../../config';
import modal from './modal';
import organizationSelector from './organization-selector';
import salesforce, * as salesforceActions from './salesforce';
import salesforceSandbox, * as salesforceSandboxActions from './salesforce-sandbox';

const settings = {
  salesforce: {
    original: {
      url: 'https://login.salesforce.com/services/oauth2/authorize?'
        + 'response_type=code&'
        + `client_id=${salesforceClientId}&`
        + `redirect_uri=${url}/OAuth2/salesforce.html`,
      popupSize: {
        width: 500,
        height: 650,
      },
      action: salesforceActions.submit,
    },
    sandbox: {
      url: 'https://test.salesforce.com/services/oauth2/authorize?'
        + 'response_type=code&'
        + `client_id=${salesforceClientId}&`
        + `redirect_uri=${url}/OAuth2/salesforce.html`,
      popupSize: {
        width: 500,
        height: 560,
      },
      action: salesforceSandboxActions.submit,
    },
  },
};

export function handle(target, type) {
  const { [target]: { [type]: { url: oauth2Url, popupSize: { width, height }, action } } } = settings;

  const popup = createPopup(oauth2Url, { width, height });

  return (dispatch) => {
    function messageHandler({ origin, data }) {
      if (origin === url) {
        dispatch(action(data));

        window.removeEventListener('message', messageHandler);

        popup.close();
      }
    }

    window.addEventListener('message', messageHandler);
  };
}

export default combineReducers({
  modal,
  organizationSelector,
  salesforce,
  salesforceSandbox,
});
