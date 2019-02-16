import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Menu, Button } from 'semantic-ui-react';
import DataSourceSelector from './DataSourceSelector';
import ActiveTablesSelector from './ActiveTablesSelector';
// import Filters from './Filters';
import * as suggestionsDataActions from '../../reducers/suggestions/data';

const { bool, number, func } = PropTypes;

@connect(({
  suggestions: {
    data: {
      count,
      isMergingAllSubmitting,
    },
  },
}) => ({ count, isMergingAllSubmitting }), dispatch => bindActionCreators({
  mergeAll: suggestionsDataActions.mergeAll,
}, dispatch))

export default class SuggestionsTopBar extends Component {
  static propTypes = {
    count: number,
    isMergingAllSubmitting: bool.isRequired,
    mergeAll: func.isRequired,
  };

  render() {
    const {
      props: {
        count,
        isMergingAllSubmitting,
        mergeAll,
      },
    } = this;

    return (
      <Menu attached>
        <Menu.Item>
          <div>Currently Viewing</div>
        </Menu.Item>
        <Menu.Item>
          <DataSourceSelector />
        </Menu.Item>
        <Menu.Item>
          <ActiveTablesSelector />
        </Menu.Item>
        {/*<Menu.Item>
          <Filters />
        </Menu.Item>*/}
        <Menu.Menu position="right">
          <Menu.Item>
            <div>
              <Button
                color="green"
                onClick={mergeAll}
                disabled={true || isMergingAllSubmitting || count === 0}
              >
                Approve all
              </Button>
              <Button
                color="grey"
                disabled={true || isMergingAllSubmitting || count === 0}
              >
                Ignore all
              </Button>
            </div>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}
