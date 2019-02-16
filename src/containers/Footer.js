import React, { Component } from 'react';
import { Segment, Container, Grid, Header, List } from 'semantic-ui-react';
import { Link } from 'react-router';
import styles from './Footer.scss';

export default class Footer extends Component {
  render() {
    return (
      <Segment
        className={styles.footer}
        inverted
        vertical
      >
        <Container>
          <Grid
            className="inverted"
            stackable
            // color: rgba(255, 255, 255, 0.9);
            divided
            height
          >
            <Grid.Column width={3}>
              <Header as="h4" inverted>First</Header>
              <List inverted link>
                <Link className="item">Link</Link>
                <Link className="item">Link</Link>
                <Link className="item">Link</Link>
                <Link className="item">Link</Link>
              </List>
            </Grid.Column>
            <Grid.Column width={3}>
              <Header as="h4" inverted>Second</Header>
              <List inverted link>
                <Link className="item">Link</Link>
                <Link className="item">Link</Link>
                <Link className="item">Link</Link>
                <Link className="item">Link</Link>
              </List>
            </Grid.Column>
            <Grid.Column width={6}>
              <Header as="h4" inverted>Third</Header>
              <p>
                Description
              </p>
            </Grid.Column>
          </Grid>
        </Container>
      </Segment>
    );
  }
}
