import React, { Component, PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Header, Form, Message, Button, Container, Grid, Segment } from 'semantic-ui-react';
import FormField from '../components/FormField';
import { loginValidation } from '../utils/is';
import * as userActions from '../reducers/user';

const { bool, string, func } = PropTypes;

@reduxForm({
  form: 'login',
  validate: loginValidation,
})

export default class Login extends Component {
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
        <Grid>
          <Grid.Column mobile={16} tablet={16} computer={4} />
          <Grid.Column mobile={16} tablet={16} computer={8}>
            <br />
            <Segment basic textAlign="center">
              <Header as="h1">Login</Header>
              <Form
                onSubmit={handleSubmit(userActions.login)}
                loading={submitting}
                error={submitFailed}
              >
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
                {submitFailed && error && (
                  <Message
                    header="Login failed"
                    error={submitFailed}
                    content={error}
                  />
                )}
                <Button
                  type="submit"
                  positive
                >
                  Login
                </Button>
              </Form>
            </Segment>
          </Grid.Column>
          <Grid.Column mobile={16} tablet={16} computer={4} />
        </Grid>
      </Container>
    );
  }
}
