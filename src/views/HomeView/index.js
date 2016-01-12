import React, { Component } from 'react';
import { pushPath } from 'redux-simple-router';
import { connect } from 'react-redux';
import { fetchExperiments } from '../../redux/modules/experiments';
import Navigation from '../../containers/Navigation';
import Grid from '../../components/Grid';
import styles from './HomeView.scss';

// We define mapStateToProps where we'd normally use
// the @connect decorator so the data requirements are clear upfront, but then
// export the decorated component after the main class definition so
// the component can be tested w/ and w/o being connected.
// See: http://rackt.github.io/redux/docs/recipes/WritingTests.html
const mapStateToProps = (state) => ({
  experiments: state.experiments,
});
export class HomeView extends Component {
  componentDidMount() {
    this.props.dispatch(fetchExperiments());
  }

  _handleSelectTile = (experimentId, /* compoundIndex */) => {
    this.props.dispatch(pushPath(`/experiments/${experimentId}/compounds/new`));
  }

  render() {
    return (
      <div className="wrapper">
        <Navigation />
        <div className="container text-center">
          <h1>Welcome to the L1000 Ordering System</h1>
          <div className={styles['grid-wrapper']}>
          {
            this.props.experiments.data.map((experiment, index) =>
              <Grid
                key={index}
                experiment={experiment}
                onSelectTile={this._handleSelectTile}
              />
            )
          }
          </div>
        </div>
      </div>
    );
  }
}

HomeView.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  experiments: React.PropTypes.object.isRequired,
};

HomeView.defaultProps = {
  dispatch: () => {},
  experiments: {},
};

export default connect(mapStateToProps)(HomeView);
