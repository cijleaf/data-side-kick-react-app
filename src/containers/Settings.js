import React, { Component, PropTypes } from 'react';
import { Header, Menu } from 'semantic-ui-react';
import SettingsMenuLink from '../components/SettingsMenuLink';
import styles from './Settings.scss';

const { element } = PropTypes;

export default class Settings extends Component {
  static propTypes = {
    children: element.isRequired,
  };

  render() {
    const { props: { children } } = this;

    return (
      <div className={styles.settings}>
        <Menu pointing vertical attached>
          <Header className={styles.header} content="Settings" as="h1" color="grey" attached />
          <SettingsMenuLink title="User Settings" to="/settings/user-settings" icon="user" />
          <SettingsMenuLink title="Organization Settings" to="/settings/organization-settings" icon="building" />
          <SettingsMenuLink title="Connections" to="/settings/connections" icon="plug" />
        </Menu>
        <div className={styles.container}>{children}</div>
      </div>
    );
  }
}
