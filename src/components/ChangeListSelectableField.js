import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { List, Icon } from 'semantic-ui-react';
import classNames from 'classnames';
import * as toRestoreActions from '../reducers/changes/to-restore';
import styles from './ChangeListSelectableField.scss';

const { bool, string, number, func, shape, oneOfType } = PropTypes;

@connect(({ changes: { toRestore: { list } } }, { id, rid, field: { key, value } }) => {
  const isIncluded = list.some(({ pk, restoreChangeRid, restore_to }) => {
    return id === pk && rid === restoreChangeRid && key in restore_to && restore_to[key] === value;
  });

  return { selected: isIncluded };
}, dispatch => bindActionCreators({
  toRestore: toRestoreActions.toRestore,
}, dispatch))

export default class ChangeListSelectibleField extends Component {
  static propTypes = {
    toRestore: func.isRequired,
    id: number.isRequired,
    rid: string.isRequired,
    field: shape({
      key: string.isRequired,
      value: oneOfType([string, number]),
    }).isRequired,
    selected: bool.isRequired,
  };

  onClickSelectChange = () => {
    const { props: { toRestore, id, rid, field: { key, value } } } = this;

    toRestore({ id, rid, field: { key, value } });
  };

  render() {
    const { onClickSelectChange, props: { field: { key, value }, selected } } = this;

    return (
      <List.Item
        className={classNames(styles.changesFieldContainer, { [styles.active]: selected })}
        onClick={onClickSelectChange}
      >
        <div className={styles.changesField}>
          <span>{key}: {value || '*empty*'}</span>
          <span className={styles.icon}><Icon name="undo" /></span>
        </div>
      </List.Item>
    );
  }
}
