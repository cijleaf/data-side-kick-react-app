import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Grid, Header, Modal, Dropdown, Button, Icon } from 'semantic-ui-react';
import * as changesListActions from '../../../reducers/changes/changes-list';
import * as filtersActions from '../../../reducers/changes/filters';

const { bool, string, func, arrayOf, shape } = PropTypes;

@connect(({
  changes: {
    dataSources: { activeDataSourceId },
    activeTables: { activeTableName },
    filters: { modalIsOpened, fieldNamesContainer },
  },
}) => {
  const props = {
    modalIsOpened,
  };

  const currentFieldNames = fieldNamesContainer.find(({
    activeDataSourceId: fieldNamesActiveDataSourceId,
    activeTableName: fieldNamesActiveTableName,
  }) => (
    fieldNamesActiveDataSourceId === activeDataSourceId && fieldNamesActiveTableName === activeTableName
  ));

  if (currentFieldNames) {
    const { dropdownList, fieldFilters } = currentFieldNames;

    return {
      ...props,
      dropdownList,
      fieldFilters,
    };
  }

  return {
    ...props,
    dropdownList: [],
    fieldFilters: [],
  };
}, dispatch => bindActionCreators({
  changeFieldFilters: filtersActions.changeFieldFilters,
  applyFilters: changesListActions.applyFilters,
  closeModal: filtersActions.closeModal,
}, dispatch))

export default class ChangesFiltersModal extends Component {
  static propTypes = {
    modalIsOpened: bool.isRequired,
    dropdownList: arrayOf(shape({
      key: string.isRequired,
      value: string.isRequired,
      text: string.isRequired,
    })).isRequired,
    fieldFilters: arrayOf(string).isRequired,
    changeFieldFilters: func.isRequired,
    applyFilters: func.isRequired,
    closeModal: func.isRequired,
  };

  onChangeFieldFilters = (event, { value }) => {
    const { props: { changeFieldFilters } } = this;

    changeFieldFilters(value);
  };

  onApplyFilters = () => {
    const { props: { applyFilters, closeModal } } = this;

    applyFilters();

    closeModal();
  };

  render() {
    const { onChangeFieldFilters, onApplyFilters, props: { modalIsOpened, dropdownList, fieldFilters, closeModal } } = this;

    return (
      <Modal
        dimmer="blurring"
        closeIcon="close"
        open={modalIsOpened}
        onClose={closeModal}
        size="small"
      >
        <Modal.Header>
          <Icon name="filter" /> Filters
        </Modal.Header>
        <Modal.Content>
          <Grid>
            <Grid.Row columns={1} padded>
              <Grid.Column>
                <Header size="small">Field(s) that changed:</Header>
                <Dropdown
                  search
                  selection
                  multiple
                  fluid
                  value={fieldFilters}
                  onChange={onChangeFieldFilters}
                  options={dropdownList}
                  placeholder="Select fields"
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
        <Modal.Actions>
          <Button
            positive
            content="Apply filters"
            onClick={onApplyFilters}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}
