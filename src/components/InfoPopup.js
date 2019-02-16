import React, { Component, PropTypes } from 'react';
import { Icon, Popup } from 'semantic-ui-react';

const { string } = PropTypes;

export default class InfoPopup extends Component {
  static propTypes = {
    content: string.isRequired,
  }

  render() {
    return (
      <Popup
        trigger={<Icon name="help circle" />}
        content={this.props.content}
        wide
        offset={40}
        positioning="bottom center"
      />
    );
  }
}
