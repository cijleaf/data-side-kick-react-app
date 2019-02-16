import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

const { string, array, element, oneOfType } = PropTypes;

export default class MenuItemLink extends Component {
  static propTypes = {
    to: string.isRequired,
    children: oneOfType([string, element, array]).isRequired,
  };

  render() {
    const { props: { to, children } } = this;

    return (
      <Link className="item" to={to} activeClassName="active">
        {children}
      </Link>
    );
  }
}
