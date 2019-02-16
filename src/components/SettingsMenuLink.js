import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

const { string } = PropTypes;

export default class SettingsMenuTab extends Component {
  static propTypes = {
    title: string.isRequired,
    to: string.isRequired,
    icon: string.isRequired,
  };

  render() {
    const { props: { title, to, icon } } = this;

    return (
      <Link className="item" to={to} activeClassName="active">
        <span>{title}</span>
        <i className={classNames('icon', icon)} />
      </Link>
    );
  }
}
