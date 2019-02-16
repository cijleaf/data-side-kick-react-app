import React, { Component } from 'react';
import { Container, Header, Button } from 'semantic-ui-react';
import { Link } from 'react-router';
import styles from './MarketingHome.scss';

export default class MarketingHome extends Component {
  render() {
    return (
      <Container
        className={styles.meeting}
        text
      >
        <Header as="h1" inverted>
          Auto-magically improve data in Salesforce.
        </Header>
        <Header as="h2" inverted>
          Data Sidekick uses artificial intelligence to <br />
          clean and enrich your database.
        </Header>
        <Link to="new-account">
          <Button
            content="Get Started"
            icon="magic"
            labelPosition="right"
            size="huge"
            color="green"
          />
        </Link>
      </Container>
    );
  }
}
