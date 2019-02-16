import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Table, Loader, Container } from 'semantic-ui-react';
import TopBar from './TopBar';
import Suggestion from './Suggestion';
import InfoPopup from '../../components/InfoPopup';
import * as uiActions from '../../reducers/ui';
import * as dataActions from '../../reducers/suggestions/data';
import styles from './index.scss';

const { isArray } = Array;

const { bool, string, number, func, arrayOf, shape, oneOf } = PropTypes;

@connect(({
  ui: { mainHeaderTop, mainHeaderHeight, subHeaderTop, subHeaderHeight },
  suggestions: { data: { isFetching, isSilent, list, count } },
}) => ({
  mainHeaderTop,
  mainHeaderHeight,
  subHeaderTop,
  subHeaderHeight,
  isFetching,
  isSilent,
  list,
  count,
}), dispatch => bindActionCreators({
  setSubHeader: uiActions.setSubHeader,
  setNextPage: dataActions.setNextPage,
  clearList: dataActions.clearList,
}, dispatch))

export default class Suggections extends Component {
  static propTypes = {
    mainHeaderTop: number.isRequired,
    mainHeaderHeight: number.isRequired,
    subHeaderHeight: number.isRequired,
    isFetching: bool,
    isSilent: bool,
    list: arrayOf(shape({
      id: number.isRequired,
      dataSourceId: number.isRequired,
      approves: arrayOf(shape({
        name: string.isRequired,
        value: string.isRequired,
        options: arrayOf(shape({
          key: string.isRequired,
          text: string.isRequired,
          value: string.isRequired,
        })),
        isSubmitting: bool,
      })),
      status: oneOf(['PENDING', 'SUCCESS', 'ERROR']),
    })),
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

  renderList = () => {
    const { props: { isFetching, isSilent, list, count } } = this;

    if (!isFetching && count === 0) {
      return (
        <Table.Body>
          <Table.Row>
            <Table.Cell colSpan="4">
              <div>No suggestions found for this table.</div>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      );
    }

    return (
      <Table.Body>
        {isArray(list) && list.map(suggestion => (<Suggestion key={suggestion.id} {...suggestion} />))}
        {!isSilent && isFetching && <Table.Row>
          <Table.Cell colSpan="4">
            <Loader size="big" inline="centered" active>Loading</Loader>
          </Table.Cell>
        </Table.Row>}
      </Table.Body>
    );
  }

  render() {
    const { renderList, props: { mainHeaderTop, mainHeaderHeight, subHeaderHeight } } = this;

    return (
      <div
        className={styles.list}
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
                <Table.HeaderCell>Type</Table.HeaderCell>
                <Table.HeaderCell>
                  <span>Current Data</span>
                  <InfoPopup content="What the record(s) in your CRM look like at the moment." />
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <span>Suggested Data</span>
                  <InfoPopup content="What the record in your CRM will look like when approved." />
                </Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            {renderList()}
          </Table>
        </Container>
      </div>
    );
  }
}
