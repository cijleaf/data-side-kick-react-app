import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { List, Dropdown } from 'semantic-ui-react';
import classNames from 'classnames';
import * as suggestionsDataActions from '../../reducers/suggestions/data';
import styles from './ApproveField.scss';

const { string, bool, func, arrayOf, shape } = PropTypes;

@connect(undefined, dispatch => bindActionCreators({
  approve: suggestionsDataActions.approve,
}, dispatch), (stateProps, {
  approve,
  ...dispatchProps
}, ownProps) => ({
  approve: approve.bind(undefined, ownProps.duplicateGroupId, ownProps.name),
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
}))

export default class SuggectionsApproveField extends Component {
  static propTypes = {
    name: string.isRequired,
    value: string.isRequired,
    options: arrayOf(shape({
      key: string.isRequired,
      text: string.isRequired,
      value: string.isRequired,
    })),
    isDisabled: bool,
    isSubmitting: bool,
    approve: func.isRequired,
  };

  onApproveHandler = (event, { value }) => {
    const { props: { approve } } = this;

    approve(value);
  };

  render() {
    const {
      onApproveHandler,
      props: {
        name,
        options,
        value,
        isDisabled,
        isSubmitting,
      },
    } = this;

    return (
      <List.Item>
        <div className={styles.approveField}>
          <span className={classNames(styles.name, { [styles.disabled]: isDisabled || isSubmitting })}>
            {name}:
          </span>
          &nbsp;<b>
            <Dropdown
              options={options}
              value={value}
              onChange={onApproveHandler}
              loading={isSubmitting}
              disabled={isDisabled || isSubmitting}
              simple
            />
          </b>
        </div>
      </List.Item>
    );
  }
}
