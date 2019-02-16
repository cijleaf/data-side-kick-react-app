import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Table, Loader, Container, List } from 'semantic-ui-react';
import TopBar from './TopBar';
import ChangeListSelectableField from '../../components/ChangeListSelectableField';
import OldDataInfoPopup from './PopupOldData';
import NewDataInfoPopup from './PopupNewData';
import * as uiActions from '../../reducers/ui';
import * as changesListActions from '../../reducers/changes/changes-list';
import styles from './index.scss';

const { bool, number, array, func } = PropTypes;

@connect(({
  ui: { mainHeaderTop, mainHeaderHeight, subHeaderTop, subHeaderHeight },
  changes: { changesList: { isFetching, list, count } },
}) => ({
  mainHeaderTop, mainHeaderHeight, subHeaderTop, subHeaderHeight, isFetching, list, count,
}), dispatch => bindActionCreators({
  setSubHeader: uiActions.setSubHeader,
  setNextPage: changesListActions.setNextPage,
  clearList: changesListActions.clearList,
}, dispatch))

export default class ChangesList extends Component {
  static propTypes = {
    mainHeaderTop: number.isRequired,
    mainHeaderHeight: number.isRequired,
    subHeaderHeight: number.isRequired,
    isFetching: bool.isRequired,
    list: array.isRequired,
    count: number,
    setSubHeader: func.isRequired,
    setNextPage: func.isRequired,
    clearList: func.isRequired,
  };

  componentDidMount() {
    const { $header, onScrollHandler, props: { mainHeaderTop, mainHeaderHeight, setSubHeader } } = this;
    const { height } = $header.getBoundingClientRect();

    const subHeaderTop = mainHeaderTop + mainHeaderHeight;

    setSubHeader(subHeaderTop, height);

    window.addEventListener('scroll', onScrollHandler);
  }

  componentWillUnmount() {
    const { onScrollHandler, props: { clearList } } = this;

    clearList();

    window.removeEventListener('scroll', onScrollHandler);
  }

  onScrollHandler = () => {
    const { props: { count, isFetching, setNextPage, list: { length: loadedItems } } } = this;
    const { pageYOffset, innerHeight, document: { body: { clientHeight } } } = window;

    if (pageYOffset > clientHeight - innerHeight - 15 && !isFetching && count > loadedItems) {
      setNextPage();
    }
  };

  renderChangesList = () => {
    const { props: { isFetching, list, count } } = this;

    if (!isFetching && count === 0) {
      return (
        <Table.Body>
          <Table.Row>
            <Table.Cell colSpan="3">
              <div>No changes found for this table.</div>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      );
    }

    return (
      <Table.Body>
        {list.map(({ id, rid, old_data, new_data }) => (
          <Table.Row key={id}>
            <Table.Cell>{rid}</Table.Cell>
            <Table.Cell>
              <List>
                {Object.keys(old_data).map(key => (
                  <ChangeListSelectableField key={key} id={id} rid={rid} field={{ key, value: old_data[key] }} />
                ))}
              </List>
            </Table.Cell>
            <Table.Cell>
              <List>
                {Object.keys(new_data).map((key) => {
                  const { [key]: value } = new_data;

                  return (
                    <List.Item key={key}>
                      <span>{key}</span>
                      <span>:&nbsp;</span>
                      <span>{value || '*empty*'}</span>
                    </List.Item>
                  );
                })}
              </List>
            </Table.Cell>
          </Table.Row>
        ))}
        {isFetching && <Table.Row>
          <Table.Cell colSpan="3">
            <Loader size="big" inline="centered" active>Loading</Loader>
          </Table.Cell>
        </Table.Row>}
      </Table.Body>
    );
  }

  render() {
    const { renderChangesList, props: { mainHeaderTop, mainHeaderHeight, subHeaderHeight } } = this;

    return (
      <div
        className={styles.changesList}
        style={{ paddingTop: subHeaderHeight }}
      >
        <header
          className={styles.stickySubHeader}
          style={{ top: mainHeaderTop + mainHeaderHeight }}
          ref={$header => (this.$header = $header)}
        >
          <TopBar />
        </header>
        <br />
        <Container>
          <Table structured striped>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Record Id </Table.HeaderCell>
                <Table.HeaderCell>Old Values <OldDataInfoPopup /></Table.HeaderCell>
                <Table.HeaderCell>New Values <NewDataInfoPopup /></Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            {renderChangesList()}
          </Table>
        </Container>
      </div>
    );
  }
}
