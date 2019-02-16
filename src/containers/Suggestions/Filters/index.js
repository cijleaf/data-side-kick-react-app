import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';
import ChangesFiltersModal from './Modal';
import * as filtersActions from '../../../reducers/suggestions/filters';

const { bool, func } = PropTypes;

@connect(({
  suggestions: {
    dataSources: { activeDataSourceId, count: dataSourcesCount },
    activeTables: { activeTableName, count: activeTablesCount },
    filters: { isFetching, fieldNamesContainer },
  },
}) => {
  const props = {
    isFetching,
    noData: dataSourcesCount === 0 || activeTablesCount === 0,
  };

  const currentFieldNames = fieldNamesContainer.find(({
    activeDataSourceId: fieldNamesActiveDataSourceId,
    activeTableName: fieldNamesActiveTableName,
  }) => (
    fieldNamesActiveDataSourceId === activeDataSourceId && fieldNamesActiveTableName === activeTableName
  ));

  if (currentFieldNames) {
    const { fieldFilters: { length: fieldFiltersLength } } = currentFieldNames;

    return {
      ...props,
      filterIsAccepted: fieldFiltersLength > 0,
    };
  }

  return {
    ...props,
    filterIsAccepted: false,
  };
}, dispatch => bindActionCreators({
  openModal: filtersActions.openModal,
}, dispatch))

export default class ChangesFilters extends Component {
  static propTypes = {
    noData: bool.isRequired,
    isFetching: bool.isRequired,
    filterIsAccepted: bool.isRequired,
    openModal: func.isRequired,
  };

  render() {
    const { props: { noData, isFetching, filterIsAccepted, openModal } } = this;

    return (
      <div>
        <Button
          basic
          disabled={noData}
          loading={isFetching}
          onClick={openModal}
          active={filterIsAccepted}
        >
          <Icon name="filter" /> Filters
        </Button>
        <ChangesFiltersModal />
      </div>
    );
  }
}
