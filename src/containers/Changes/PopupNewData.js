import React, { Component } from 'react';
import { Icon, Popup } from 'semantic-ui-react';

export default class NewDataInfoPopup extends Component {
  render() {
    return (
      <Popup
        trigger={<Icon name="help circle" />}
        content="These are the current values for each record in your database."
        wide
        offset={40}
        positioning="bottom center"
      />
    );
  }
}
