import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Menu, Button } from 'semantic-ui-react';
import DataSourceSelector from './DataSourceSelector';
import ActiveTablesSelector from './ActiveTablesSelector';
import Filters from './Filters';
import * as toRestoreActions from '../../reducers/changes/to-restore';

const { bool, number, func } = PropTypes;

@connect(({ changes: { toRestore: { isSubmitting: restoresIsSubmitting, count: restoresCount } },
}) => ({ restoresIsSubmitting, restoresCount }), dispatch => bindActionCreators({
  sendToRestore: toRestoreActions.sendToRestore,
}, dispatch))

export default class ChangesTopBar extends Component {
  static propTypes = {
    sendToRestore: func.isRequired,
    restoresIsSubmitting: bool.isRequired,
    restoresCount: number,
  };

  onSendToStore = () => {
    const { props: { sendToRestore } } = this;

    sendToRestore();
  };

  render() {
    const { onSendToStore, props: { restoresIsSubmitting, restoresCount } } = this;

    return (
      <Menu attached>
        <Menu.Item>
          <div>Currently Viewing</div>
        </Menu.Item>
        <Menu.Item>
          <DataSourceSelector />
        </Menu.Item>
        <Menu.Item>
          <ActiveTablesSelector />
        </Menu.Item>
        <Menu.Item>
          <Filters />
        </Menu.Item>
        <Menu.Menu position="right">
          <Menu.Item>
            <Button
              color="green"
              onClick={onSendToStore}
              disabled={restoresIsSubmitting || restoresCount === 0}
            >
              Restore selected values
            </Button>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}
