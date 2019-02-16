import React, { Component } from 'react';
import { Link } from 'react-router';
import { Feed, Container, Header, Segment, Icon } from 'semantic-ui-react';

export default class ActivityFeed extends Component {
  render() {
    return (
      <Container>
        <Segment>
          <Header as="h2">Activity Feed</Header>
          <Feed>
            <Feed.Event>
              <Feed.Label>
                <Icon size="large" name="user" color="green" />
              </Feed.Label>
              <Feed.Content>
                <Feed.Date>
                  Today
                </Feed.Date>
                <Feed.Summary>
                  Thanks for creating an account&#33;  As your Data Sidekick, I am hoping to make it a LOT easier for you to manage your CRM data.
                  <br />
                  <br />
                  Next we need to <Link to="/settings/connections">set up a connection with your database</Link>.
                </Feed.Summary>
              </Feed.Content>
            </Feed.Event>
          </Feed>
        </Segment>
      </Container>
    );
  }
}
