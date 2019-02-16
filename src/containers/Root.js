import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import { Segment } from 'semantic-ui-react';
import Menu from './Menu';
// import Footer from './Footer';
import * as uiActions from '../reducers/ui';
import * as userActions from '../reducers/user';
import styles from './Root.scss';

const { number, func, element } = PropTypes;

@asyncConnect([{
  promise({ store: { dispatch } }) {
    return dispatch(userActions.assign());
  },
}])

@connect(({ ui: { mainHeaderTop, mainHeaderHeight } }) => ({ mainHeaderTop, mainHeaderHeight }), dispatch => bindActionCreators({
  setMainHeader: uiActions.setMainHeader,
}, dispatch))

export default class Root extends Component {
  static propTypes = {
    children: element.isRequired,
    meeting: element,
    mainHeaderTop: number.isRequired,
    mainHeaderHeight: number.isRequired,
    setMainHeader: func.isRequired,
  };

  componentDidMount() {
    const { $header, props: { setMainHeader } } = this;
    const { top, height } = $header.getBoundingClientRect();

    setMainHeader(top, height);
  }

  render() {
    const { props: { children, meeting, mainHeaderTop, mainHeaderHeight } } = this;

    return (
      <div
        className={styles.app}
        style={{ paddingTop: mainHeaderHeight }}
      >
        <Segment
          className={styles.header}
          textAlign="center"
          color="blue"
          vertical
          inverted
          // masthead
          // center
          // aligned
        >
          <div
            className={styles.stickyHeader}
            style={{ top: mainHeaderTop }}
            ref={$header => (this.$header = $header)}
          >
            <Menu />
          </div>
          {meeting}
        </Segment>
        <div className={styles.content}>
          {children}
        </div>
        {/* <Footer /> */}
      </div>
    );
  }
}
