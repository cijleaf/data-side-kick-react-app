import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Segment, Message, Header, Button, Icon, Loader, Grid } from 'semantic-ui-react';
import classNames from 'classnames';
import Alert from './Alert';
import Modal from './Modal';
import * as connectionsActions from '../../reducers/connections';
import * as modalActions from '../../reducers/oauth2/modal';
import styles from './Connections.scss';

const { bool, number, array, func } = PropTypes;

@connect(({
  user: { organization_membership_with_admin_access: { length: availableMembershipsCount } },
  connections: { isFetching, connections, count, newConnectionIsAdded, addNewConnectionError },
}) => ({
  isFetching,
  connections,
  count,
  availableMembershipsCount,
  newConnectionIsAdded,
  addNewConnectionError,
}), dispatch => bindActionCreators({
  fetch: connectionsActions.fetch,
  activateModal: modalActions.activate,
}, dispatch))

export default class Connections extends Component {
  static propTypes = {
    isFetching: bool.isRequired,
    connections: array.isRequired,
    count: number,
    availableMembershipsCount: number.isRequired,
    newConnectionIsAdded: bool.isRequired,
    addNewConnectionError: bool.isRequired,
    fetch: func.isRequired,
    activateModal: func.isRequired,
  };

  static renderStatus(status) {
    return (
      <span
        className={classNames(styles.status, {
          [styles.active]: status,
          [styles.deactivated]: !status,
        })}
      >
        {status ? 'Active' : 'Deactivated'}
      </span>
    );
  }

  static parseType(type) {
    switch (type) {
      case 'salesforce': {
        return 'Salesforce';
      }
      default: {
        return 'Unknown';
      }
    }
  }

  componentDidMount() {
    const { props: { fetch } } = this;

    fetch();
  }

  renderContent = () => {
    const { renderStatus, parseType } = Connections;
    const { props: { isFetching, connections, count } } = this;

    if (isFetching) {
      return <Loader active />;
    } else if (!(count > 0)) {
      return <Alert />;
    }

    return (
      connections.map(({ id, name, active, details: { type, is_sandbox } }) => (
        <Segment
          key={id}
          className={styles.connection}
        >
          <Grid columns="equal" divided>
            <Grid.Column width={3} textAlign="center" >
              <Icon.Group size="big">
                <Icon name="database" color="grey" />
              </Icon.Group>
              <div color="green">{parseType(type)}{is_sandbox && ' (Sandbox)'}</div>
            </Grid.Column>
            <Grid.Column width={10}>
              <div className={styles.settings}>
                <p>Name: {name}</p>
                <p>Status: {renderStatus(active)}</p>
              </div>
            </Grid.Column>
            <Grid.Column>
              <div className={styles.iconsBar}>
                <Icon size="large" name="pencil" disabled />
                <Icon size="large" name="trash outline" disabled />
              </div>
            </Grid.Column>
          </Grid>
        </Segment>
      ))
    );
  };

  render() {
    const {
      renderContent,
      props: {
        availableMembershipsCount,
        activateModal,
        newConnectionIsAdded,
        addNewConnectionError,
      },
    } = this;

    return (
      <div className={styles.connections}>
        <Segment clearing basic>
          <Header content="Connections" as="h1" color="grey" floated="left" />
          {availableMembershipsCount > 0 && <Modal
            button={
              <Button
                positive
                content="Add a new connection"
                icon={<Icon name="plus" />}
                floated="right"
                onClick={activateModal}
              />
            }
          />}
        </Segment>
        <div className={styles.content}>
          <Message
            positive
            hidden={!newConnectionIsAdded}
          >
            <Message.Header>Successfully connected with Salesforce <Icon name="check circle" /></Message.Header>
            <Message.Content>
                  Wohoo&#33; Now I&#39;ll begin to analyze your data. This
                  usually takes 15 or 30 minutes depending on the size of your
                  database.  When I&#39;m done I&#39;ll send you an email
                  letting you know.   Hang tight&#33;
            </Message.Content>
          </Message>
          <Message
            negative
            hidden={!addNewConnectionError}
          >
            <Message.Header>Hmm...We couldn&#39;t add your connection.</Message.Header>
            <p> Sorry but there was an error when we tried to connect
            your database.  Our engineers have been notified and will work on
            a fix as soon as possible.</p>
          </Message>
          {renderContent()}
        </div>
      </div>
    );
  }
}
