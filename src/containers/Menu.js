import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Menu, Icon } from 'semantic-ui-react';
import MenuItemLink from '../components/MenuItemLink';
import styles from './Menu.scss';

const { bool, string } = PropTypes;

@connect(({ user: { isFetching, first_name, isAuthenticated } }) => ({ isFetching, first_name, isAuthenticated }))

export default class StackableMenu extends Component {
  static propTypes = {
    isFetching: bool.isRequired,
    first_name: string,
    isAuthenticated: bool.isRequired,
  };

  renderUser = () => {
    const { props: { isFetching, first_name, isAuthenticated } } = this;

    if (isAuthenticated && isFetching) {
      return (
        <Menu.Item>
          Loading...
          {/*
            <Loader />
            FIXME: Maybe is possible to use Loader instead?
          */}
        </Menu.Item>
      );
    }

    if (isAuthenticated) {
      return (
        <Menu.Item>
          <div>
            Logged in as {first_name}&nbsp;&nbsp;&nbsp;
            <Icon circular name="user" />
          </div>
        </Menu.Item>
      );
    }

    return null;
  }

  render() {
    const { renderUser, props: { isAuthenticated } } = this;

    return (
      <Menu
        className={styles.menu}
        color="blue"
        inverted
        attached
        stackable
        borderless
      >
        <Menu.Item as={Link} to="/">
          <Icon name="database" />
          Data Sidekick
        </Menu.Item>
        {isAuthenticated && <MenuItemLink to="/changes">
          Changes
        </MenuItemLink>}
        {isAuthenticated && <MenuItemLink to="/suggestions">
          Suggestions
        </MenuItemLink>}
        {isAuthenticated && <MenuItemLink to="/settings">
          Settings
        </MenuItemLink>}
        <Menu.Menu position="right">
          {!isAuthenticated && <MenuItemLink to="/login">
            Login
          </MenuItemLink>}
          {!isAuthenticated && <MenuItemLink to="/new-account">
            Sign Up
          </MenuItemLink>}
          {renderUser()}
        </Menu.Menu>
      </Menu>
    );
  }
}
