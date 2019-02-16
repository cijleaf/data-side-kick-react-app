import React, { Component, PropTypes } from 'react';
import { Dropdown } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as activeTablesActions from '../../reducers/suggestions/active-tables';

const { bool, string, func, shape, arrayOf } = PropTypes;

@connect(({
  suggestions: {
    dataSources: { isFetching },
    activeTables: { list, count, dropdownTables, activeTableName },
  },
}) => ({ isFetching, list, noTables: count === 0, dropdownTables, activeTableName }), dispatch => bindActionCreators({
  changeActiveTable: activeTablesActions.changeActiveTable,
}, dispatch))

export default class ActiveTablesSelector extends Component {
  static propTypes = {
    isFetching: bool.isRequired,
    changeActiveTable: func.isRequired,
    dropdownTables: arrayOf(shape({
      key: string.isRequired,
      value: string.isRequired,
      text: string.isRequired,
    })).isRequired,
    noTables: bool.isRequired,
    activeTableName: string,
  };

  onChangeTable = (event, { value }) => {
    const { props: { changeActiveTable } } = this;

    changeActiveTable(value);
  };

  getState = () => {
    const { props: { isFetching, noTables } } = this;

    if (isFetching) {
      return 'Loading';
    } else if (noTables) {
      return 'No available tables';
    }

    return 'Table not selected';
  };

  render() {
    const { onChangeTable, getState, props: { isFetching, dropdownTables, noTables, activeTableName } } = this;

    return (
      <Dropdown
        options={dropdownTables}
        placeholder={getState()}
        onChange={onChangeTable}
        value={activeTableName || ''}
        disabled={isFetching || noTables}
        selection
      />
    );
  }
}
