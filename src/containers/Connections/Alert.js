import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Header, Button, Icon } from 'semantic-ui-react';
import Modal from './Modal';
import * as modalActions from '../../reducers/oauth2/modal';
import styles from './Alert.scss';

const { string, number, func } = PropTypes;

@connect(({
  user: {
    first_name,
    organization_membership_with_admin_access: { length: availableMembershipsCount },
  },
  connections: { list, count },
}) => ({
  first_name,
  list,
  availableMembershipsCount,
  count,
}), dispatch => bindActionCreators({
  activateModal: modalActions.activate,
}, dispatch))

export default class Alert extends Component {
  static propTypes = {
    first_name: string.isRequired,
    availableMembershipsCount: number.isRequired,
    count: number.isRequired,
    activateModal: func.isRequired,
  };

  render() {
    const { props: { first_name, availableMembershipsCount, count, activateModal } } = this;

    return (
      <div className={styles.alert}>
        {count === 0 && availableMembershipsCount === 0 ? (
          <div className={styles.content}>
            <Header className={styles.header} as="h1" color="grey">
              You can&apos;t add new connections, {first_name} :(
            </Header>
          </div>
        ) : (
          <div className={styles.content}>
            <Header className={styles.header} as="h1" color="grey">
              {first_name}, you don&apos;t have any connected databases. Let&apos;s fix that!
            </Header>
            <Modal
              button={
                <Button
                  positive
                  size="big"
                  content="Connect a Database"
                  icon={<Icon name="plus" />}
                  onClick={activateModal}
                />
              }
            />
          </div>
        )}
      </div>
    );
  }
}
