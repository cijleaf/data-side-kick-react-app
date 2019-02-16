import React, { Component, PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Header, Form, Message, Button, Segment, Grid, Container, List, Label, Modal } from 'semantic-ui-react';
import FormField from '../components/FormField';
import { createAccountValidation } from '../utils/is';
import * as userActions from '../reducers/user';
import styles from './NewAccount.scss';

const { bool, string, func } = PropTypes;

@reduxForm({
  form: 'newAccount',
  validate: createAccountValidation,
})

export default class NewAccount extends Component {
  static propTypes = {
    submitting: bool.isRequired,
    submitFailed: bool.isRequired,
    error: string,
    handleSubmit: func.isRequired,
  };

  render() {
    const { props: { handleSubmit, submitting, submitFailed, error } } = this;

    return (
      <Container>
        <br />
        <Grid>
          <Grid.Column width={10}>
            <div className={styles.marketingHeader}>
              <Header as="h2" color="blue">
                You focus on being a marketing superhero.<br />
                Let us worry about the data.</Header>
              <p className={styles.marketingParagraph}>Here is what you can do with Data Sidekick:</p>
            </div>
            <List>
              <List.Item className={styles.marketingList}>
                <List.Icon name="plug" />
                <List.Content >
                    Connect with Salesforce in just a few clicks.
                </List.Content>
              </List.Item>
              <List.Item className={styles.marketingList}>
                <List.Icon name="history" />
                <List.Content>
                  Undo accidental changes &nbsp;&nbsp;&nbsp;
                </List.Content>
              </List.Item>
              <List.Item className={styles.marketingList}>
                <List.Icon name="fork" rotated="right" />
                <List.Content>
                    Dedupe, intelligently and easily &nbsp;&nbsp;&nbsp;
                </List.Content>
              </List.Item>
              <List.Item className={styles.marketingList}>
                <List.Icon name="delete" />
                <List.Content>
                    Remove junk &nbsp;&nbsp;&nbsp;
                    <Label size="tiny" tag color="gray">Coming Soon!</Label>
                </List.Content>
              </List.Item>
              <List.Item className={styles.marketingList}>
                <List.Icon name="puzzle" />
                <List.Content>
                    Fill missing company & contact data &nbsp;&nbsp;&nbsp;
                    <Label size="tiny" tag color="gray">Coming Soon!</Label>
                </List.Content>
              </List.Item>
            </List>
            <p className={styles.marketingParagraph}>...and <strong>Data Sidekick is 100% free</strong> during our beta - no credit card required!  So...what are you waiting for?</p>
          </Grid.Column>
          <Grid.Column width={6}>
            <Segment textAlign="center">
              <Header as="h1">Create Your Free Account</Header>
              <Form
                onSubmit={handleSubmit(userActions.create)}
                loading={submitting}
                error={submitFailed}
              >
                <Field
                  name="first_name"
                  type="text"
                  label="First Name"
                  component={FormField}
                />
                <Field
                  name="last_name"
                  type="text"
                  label="Last Name"
                  component={FormField}
                />
                <Field
                  name="email"
                  type="email"
                  label="Email address"
                  component={FormField}
                />
                <Field
                  name="password"
                  type="password"
                  label="Create a password"
                  component={FormField}
                />
                <Field
                  name="confirmPassword"
                  type="password"
                  label="Enter your password again"
                  component={FormField}
                />
                {submitFailed && error && (
                  <Message
                    header="Registration failed"
                    error={submitFailed}
                    content={error}
                  />
                )}
                <Button
                  type="submit"
                  size="huge"
                  positive
                >
                  Get started!
                </Button>
                <br />
                <br />
                <div>By creating an account you agree to our&nbsp;
                  <Modal trigger={<a>terms of service</a>}>
                    <Modal.Content image>
                      <Modal.Description>
                        <iframe width="100%" height="400px" src="https://docs.google.com/document/d/1JEJ8IZY5grM7lnl8fH-JyRTi7yrDFI7YDHUFtvBZKQg/pub?embedded=true" />
                      </Modal.Description>
                    </Modal.Content>
                  </Modal>
                </div>
              </Form>
            </Segment>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}
