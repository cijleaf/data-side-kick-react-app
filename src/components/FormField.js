import React, { Component, PropTypes } from 'react';
import { Form } from 'semantic-ui-react';
import styles from './FormField.scss';

const { bool, string, array, shape, oneOfType } = PropTypes;

export default class FormField extends Component {
  static propTypes = {
    label: string.isRequired,
    type: string.isRequired,
    input: shape({
      name: string.isRequired,
      value: string,
    }).isRequired,
    meta: shape({
      touched: bool.isRequired,
      error: oneOfType([string, array]),
    }).isRequired,
  };

  renderInput = () => {
    const { props: { type, input, label, meta: { touched, error } } } = this;

    switch (type) {
      default: {
        return (
          <Form.Input
            className={styles.input}
            type={type}
            placeholder={label}
            error={touched && !!error}
            {...input}
          />
        );
      }
    }
  }

  render() {
    const { renderInput, props: { meta: { touched, error } } } = this;

    return (
      <Form.Field className={styles.field}>
        {renderInput()}
        {touched && error && <span className={styles.error}>{error}</span>}
      </Form.Field>
    );
  }
}
