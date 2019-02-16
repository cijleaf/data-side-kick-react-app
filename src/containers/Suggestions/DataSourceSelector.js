import React, { Component, PropTypes } from 'react';
import { Dropdown } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as DataSourcesActions from '../../reducers/suggestions/data-sources';

const { bool, string, number, func, shape, arrayOf } = PropTypes;

@connect(({
  suggestions: { dataSources: { isFetching, dropdownList, count, activeDataSourceId } },
}) => ({ isFetching, dropdownList, noSources: count === 0, activeDataSourceId }), dispatch => bindActionCreators({
  changeDataSource: DataSourcesActions.changeDataSource,
  fetchDataSources: DataSourcesActions.fetch,
}, dispatch))

export default class DataSourceSelector extends Component {
  static propTypes = {
    changeDataSource: func.isRequired,
    fetchDataSources: func.isRequired,
    isFetching: bool.isRequired,
    dropdownList: arrayOf(shape({
      key: number.isRequired,
      value: string.isRequired,
      text: string.isRequired,
    })).isRequired,
    noSources: bool.isRequired,
    activeDataSourceId: number,
  };

  componentDidMount() {
    const { props: { fetchDataSources } } = this;

    fetchDataSources();
  }

  onChangeDataSource = (event, { value }) => {
    const { props: { changeDataSource } } = this;

    changeDataSource(parseInt(value, 10));
  };

  getState = () => {
    const { props: { isFetching, noSources } } = this;

    if (isFetching) {
      return 'Loading';
    } else if (noSources) {
      return 'No available connections';
    }

    return 'Connection not selected';
  };

  render() {
    const { getState, onChangeDataSource, props: { isFetching, dropdownList, noSources, activeDataSourceId } } = this;

    return (
      <Dropdown
        options={dropdownList}
        placeholder={getState()}
        onChange={onChangeDataSource}
        value={activeDataSourceId ? activeDataSourceId.toString() : ''}
        disabled={isFetching || noSources}
        selection
      />
    );
  }
}
