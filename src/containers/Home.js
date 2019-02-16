import React, { Component } from 'react';
import { Container, Segment, Header, Button, Label } from 'semantic-ui-react';
import { Link } from 'react-router';
import styles from './Home.scss';

export default class Home extends Component {
  render() {
    return (
      <div>
        <Segment
          className={styles.segment}
          vertical
        >
          <Container text>
            <Header as="h3">Dedupe, Intelligently and Easily</Header>
            <p>
              Soon after you connect with Salesforce, Data Sidekick auto-magically
              identifies duplicate Lead and Contact records and makes it easy
              to merge them. There&#39;s no need for complicated matching rules
              or configuration - we take all of the complicated steps out of
              the process&#33;
            </p>
          </Container>
        </Segment>
        <Segment
          className={styles.segment}
          vertical
        >
          <Container text>
            <Header as="h3">Undo Accidental Changes</Header>
            <p>
              Accidentally make a mistake and overwrite some important data&#63;
              We&#39;ve got you covered.  Data Sidekick performs a daily backup
              and makes it incredibly easy to undo changes.
            </p>
          </Container>
        </Segment>
        <Segment
          className={styles.segment}
          vertical
        >
          <Container text>
            <Header as="h3">Remove Junk <Label color="grey" horizontal>Coming Soon</Label> </Header>
            <p>
              Data Sidekick identifies junk & spam and gives you an easy way
              to classify or delete pesky junk records that accumulate over
              time.  Records with email addresses like jt123@mailinator.com and
              aaa@bbb.com, or records with names like Joe Tester and Mickey Mouse.
            </p>
          </Container>
        </Segment>
        <Segment
          className={styles.segment}
          vertical
        >
          <Container text>
            <Header as="h3">Fill in the Gaps <Label color="grey" horizontal>Coming Soon</Label> </Header>
            <p>
              Missing important company or contact information&#63; Data Sidekick
              makes suggestions to improve the completeness and accuracy of as
              many records as possible, making it easier to segment and report
              on your database.
            </p>
          </Container>
        </Segment>
        <Segment
          className={styles.segment}
          vertical
        >
          <Container text textAlign="center">
            <Header as="h3">End the battle with dirty data. <br />Click below and join the beta!</Header>
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
        </Segment>
      </div>
    );
  }
}
