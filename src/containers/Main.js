import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import ActivityFeed from './ActivityFeed';

export default class Main extends Component {
  render() {
    return (
      <div>
        <Container>
          <br />
          <ActivityFeed />
          <br />
        </Container>
      </div>
    );
  }
}
