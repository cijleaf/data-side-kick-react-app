import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Header, Button, Icon, Modal as SemanticModal, Grid } from 'semantic-ui-react';
import * as oauth2Actions from '../../reducers/oauth2';
import * as modalActions from '../../reducers/oauth2/modal';

const { bool, func, element } = PropTypes;

@connect(({
  oauth2: {
    modal: { isActive },
    salesforce: { isFetching: salesforceisFetching },
    salesforceSandbox: { isFetching: salesforceSandboxisFetching },
  },
}) => ({ isActive, salesforceisFetching, salesforceSandboxisFetching }), dispatch => bindActionCreators({
  activate: modalActions.activate,
  deactivate: modalActions.deactivate,
  handle: oauth2Actions.handle,
}, dispatch))

export default class Modal extends Component {
  static propTypes = {
    isActive: bool.isRequired,
    salesforceisFetching: bool.isRequired,
    salesforceSandboxisFetching: bool.isRequired,
    button: element.isRequired,
    handle: func.isRequired,
    // activate: func.isRequired,
    deactivate: func.isRequired,
  };

  onSalesforceOAuth2 = () => {
    const { props: { handle } } = this;

    handle('salesforce', 'original');
  };

  onSalesforceSandboxOAuth2 = () => {
    const { props: { handle } } = this;

    handle('salesforce', 'sandbox');
  };

  render() {
    const {
      onSalesforceOAuth2,
      onSalesforceSandboxOAuth2,
      props: { isActive, button, salesforceisFetching, salesforceSandboxisFetching, deactivate },
    } = this;

    return (
      <SemanticModal
        dimmer="blurring"
        closeIcon="close"
        trigger={button}
        open={isActive}
        onClose={deactivate}
      >
        <Header content="Connect a Database" />
        <SemanticModal.Content>
          <Grid>
            <Grid.Column width={8}>
              <Button
                size="big"
                icon={<Icon name="plus" />}
                content="Connect Salesforce"
                onClick={onSalesforceOAuth2}
                loading={salesforceisFetching}
                fluid
                primary
              />
              <br />
              <Button
                size="big"
                icon={<Icon name="plus" />}
                content="Connect Salesforce (Sandbox)"
                onClick={onSalesforceSandboxOAuth2}
                loading={salesforceSandboxisFetching}
                fluid
                primary
              />
            </Grid.Column>
            <Grid.Column width={8}>
              <Button
                size="big"
                icon={<Icon name="plus" />}
                content="Connect Microsoft Dynamics"
                fluid
                primary
                disabled
              />
              <br />
              <Button
                size="big"
                icon={<Icon name="plus" />}
                content="Connect Marketo"
                fluid
                primary
                disabled
              />
            </Grid.Column>
          </Grid>
        </SemanticModal.Content>
      </SemanticModal>
    );
  }
}
