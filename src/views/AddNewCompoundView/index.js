import React, { Component } from 'react';
// import { pushPath } from 'redux-simple-router';
import { connect } from 'react-redux';
import { fetchOneExperiment } from '../../redux/modules/experiment';
// import styles from './AddNewCompound.scss';

const mapStateToProps = (state) => ({
  experiments: state.experiments,
});
export class AddNewCompound extends Component {
  componentDidMount() {
    const { experimentId } = this.props.params;
    this.props.dispatch(fetchOneExperiment(experimentId));
  }

  render() {
    return (
      <div className="wrapper">
        <div className="container text-center">
          <h1>Welcome to Add Compound Page</h1>
          <p>The Experiment ID is: {this.props.params.experimentId}</p>
        </div>
      </div>
    );
  }
}

AddNewCompound.propTypes = {
  params: React.PropTypes.object.isRequired,
  dispatch: React.PropTypes.func.isRequired,
  experiment: React.PropTypes.object.isRequired,
};

AddNewCompound.defaultProps = {
  params: {},
  dispatch: () => {},
  experiment: {},
};

export default connect(mapStateToProps)(AddNewCompound);
