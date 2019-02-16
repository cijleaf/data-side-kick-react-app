import React, { Component } from 'react';
import { Icon, Popup } from 'semantic-ui-react';

export default class OldDataInfoPopup extends Component {
  render() {
    return (
      <Popup
        trigger={<Icon name="help circle" />}
        content="These are the old values for each record. Want to undo some of these changes?  Select any value(s) and then click 'Restore selected values' at the top right."
        wide
        offset={40}
        positioning="bottom center"
      />
    );
  }
}
