import React, { Component, PropTypes } from 'react';
import { pushPath } from 'redux-simple-router';
import { connect } from 'react-redux';
import { loadExperiments } from '../../actions';
import Experiment from '../../components/Experiment';
import styles from './HomeView.scss';

// We define mapStateToProps where we'd normally use
// the @connect decorator so the data requirements are clear upfront, but then
// export the decorated component after the main class definition so
// the component can be tested w/ and w/o being connected.
// See: http://rackt.github.io/redux/docs/recipes/WritingTests.html
const mapStateToProps = (state) => ({
  entities: state.entities,
});
export class HomeView extends Component {
  componentDidMount() {
    this.props.loadExperiments();
  }

  _handleSelectTile = (experimentId, compoundIndex) => {
    this.props.pushPath(`/experiments/${experimentId}/compounds/create?index=${compoundIndex}`);
  }

  render() {
    const { entities } = this.props;
    return (
      <div className="wrapper">
        <div className="container">
          <h1 className="text-center">Welcome to the L1000 Ordering System</h1>
          <div className={styles['experiment-wrapper']}>
          {
            // Iterate over entities.experiments if it exists, and create a grid for each one
            !!entities && Object.keys(entities.experiments).map((experimentId, index) =>
              <Experiment
                key={index}
                experiment={entities.experiments[experimentId]}
                compounds={entities.compounds}
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
  entities: PropTypes.object,
  pushPath: PropTypes.func.isRequired,
  loadExperiments: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, {
  pushPath,
  loadExperiments,
})(HomeView);
