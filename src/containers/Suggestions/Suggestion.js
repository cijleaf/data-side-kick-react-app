import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Table, List, Button, Icon, Label, Popup } from 'semantic-ui-react';
import * as suggestionsDataActions from '../../reducers/suggestions/data';
import ApproveField from './ApproveField';
import styles from './Suggestion.scss';

const { isArray } = Array;

const { bool, string, number, func, arrayOf, shape, oneOf } = PropTypes;

@connect(({ suggestions: { data: { isMergingAllSubmitting } } }) => ({ isMergingAllSubmitting }), dispatch => bindActionCreators({
  setShowAllApproves: suggestionsDataActions.setShowAllApproves,
  setHideAllApproves: suggestionsDataActions.setHideAllApproves,
  merge: suggestionsDataActions.merge,
  ignore: suggestionsDataActions.ignore,
}, dispatch), (stateProps, {
  setShowAllApproves,
  setHideAllApproves,
  merge,
  ignore,
  ...dispatchProps
}, ownProps) => ({
  setShowAllApproves: setShowAllApproves.bind(undefined, ownProps.id),
  setHideAllApproves: setHideAllApproves.bind(undefined, ownProps.id),
  merge: merge.bind(undefined, { id: ownProps.id, dataSourceId: ownProps.dataSourceId }),
  ignore: ignore.bind(undefined, { id: ownProps.id, dataSourceId: ownProps.dataSourceId }),
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
}))

export default class Suggestion extends Component {
  static propTypes = {
    id: number.isRequired,
    records: arrayOf(shape({
      id: string.isRequired,
    })),
    approves: arrayOf(shape({
      primary: bool.isRequired,
      name: string.isRequired,
      value: string.isRequired,
      options: arrayOf(shape({
        key: string.isRequired,
        text: string.isRequired,
        value: string.isRequired,
      })),
    })),
    mergingStatus: oneOf(['PENDING', 'SUCCESS', 'ERROR']),
    showAllApproves: bool,
    mergeSubmitting: bool,
    mergeSubmittingError: string,
    isMergingAllSubmitting: bool,
    ignoreSubmitting: bool,
    setShowAllApproves: func.isRequired,
    setHideAllApproves: func.isRequired,
    merge: func.isRequired,
    ignore: func.isRequired,
  };

  getMergingStatusLabelColor = () => {
    const { props: { mergingStatus } } = this;

    switch (mergingStatus) {
      case 'SUCCESS': { return 'green'; }
      case 'ERROR': { return 'red'; }
      default: { return 'grey'; }
    }
  };

  render() {
    const {
      getMergingStatusLabelColor,
      props: {
        id,
        records,
        approves,
        mergingStatus,
        showAllApproves,
        mergeSubmitting,
        mergeSubmittingError,
        isMergingAllSubmitting,
        ignoreSubmitting,
        setShowAllApproves,
        setHideAllApproves,
        merge,
        ignore,
      },
    } = this;

    const isPending = mergingStatus === 'PENDING';

    return (
      <Table.Row disabled={isMergingAllSubmitting || mergeSubmitting || ignoreSubmitting || isPending}>
        <Table.Cell>
          <Popup
            trigger={<Icon circular name="fork" color="white" size="large" rotated="counterclockwise" loading={isMergingAllSubmitting || mergeSubmitting || ignoreSubmitting} />}
            content="Merge"
          />
        </Table.Cell>
        <Table.Cell verticalAlign="top">
          <span>{records.length} similar records:</span>
          <List>
            {isArray(records) && records.map(({ id: recordId }) => (
              <List.Item key={recordId}>
                <a
                  href={`https://na1.salesforce.com/${recordId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>{recordId}</span>
                  &nbsp;
                  <Icon name="external" />
                </a>
              </List.Item>
            ))}
          </List>
        </Table.Cell>
        <Table.Cell verticalAlign="top">
          <List>
            {isArray(approves) ? approves.map(approve => (approve.primary || showAllApproves) && (isArray(approve.options) ? (
              <ApproveField
                key={approve.name}
                duplicateGroupId={id}
                isDisabled={isMergingAllSubmitting || mergeSubmitting || ignoreSubmitting || isPending}
                {...approve}
              />) : (
                <List.Item key={approve.name}>
                  {approve.name}: <b>{approve.value}</b>
                </List.Item>
              ))) : 'No content'
            }
          </List>
          {isArray(approves) && approves.some(approve => !approve.primary) && (!showAllApproves ? (
            <Button
              size="mini"
              basic
              compact
              primary
              onClick={setShowAllApproves}
              disabled={isMergingAllSubmitting || mergeSubmitting || ignoreSubmitting || isPending}
            >
              Show all fields
            </Button>
          ) : (
            <Button
              size="mini"
              basic
              compact
              secondary
              onClick={setHideAllApproves}
              disabled={isMergingAllSubmitting || mergeSubmitting || ignoreSubmitting || isPending}
            >
              Hide all fields
            </Button>
          ))}
        </Table.Cell>
        <Table.Cell
          className={styles.controling}
          verticalAlign="top"
        >
          <Button.Group>
            <Button
              basic
              color="green"
              onClick={merge}
              disabled={isMergingAllSubmitting || mergeSubmitting || ignoreSubmitting || isPending}
              loading={mergeSubmitting || isPending}
            >
            Approve
            </Button>
            <Button
              basic
              color="grey"
              onClick={ignore}
              disabled={isMergingAllSubmitting || mergeSubmitting || ignoreSubmitting || isPending}
              loading={ignoreSubmitting}
            >
              Ignore
            </Button>
          </Button.Group>
          {mergingStatus && <Label
            attached="top right"
            color={getMergingStatusLabelColor()}
          >
            {mergingStatus}
          </Label>}
          {mergeSubmittingError && <Label
            attached="top right"
            color="red"
          >
            Merge error: {mergeSubmittingError}
          </Label>}
        </Table.Cell>
      </Table.Row>
    );
  }
}
