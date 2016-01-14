import React, { Component, PropTypes } from 'react';
// import { pushPath } from 'redux-simple-router';
import { connect } from 'react-redux';
import { pushPath } from 'redux-simple-router';
import { initialize } from 'redux-form';
import { addCompound } from '../../actions';
import AddCompoundForm from '../../containers/AddCompoundForm';
// import { addCompound, fetchOneExperiment } from '../../redux/modules/experiment';
// import styles from './AddNewCompound.scss';

const mapStateToProps = (state) => ({
  entities: state.entities,
});
export class AddNewCompound extends Component {
  componentDidMount() {
    // const { experimentId } = this.props.params;
  }

  _handleSubmit = (formData) => {
    const { compoundName } = formData;
    const { experimentId } = this.props.params;
    const { index } = this.props.location.query;
    // TODO: Add compound to experiment at index
    this.props.addCompound(compoundName, experimentId, index);
    // Re-initialize AddCompound Form
    this.props.initialize('AddCompound');
    this.props.pushPath(`/experiments/${experimentId}/compounds/${index}`);
  }

  render() {
    return (
      <div className="wrapper">
        <div className="container text-center">
          <h1>Welcome to Add Compound Page</h1>
          <p>The Experiment ID is: {this.props.params.experimentId}</p>
          <AddCompoundForm onSubmit={this._handleSubmit} />
        </div>
      </div>
    );
  }
}

AddNewCompound.propTypes = {
  params: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  pushPath: PropTypes.func.isRequired,
  initialize: PropTypes.func.isRequired,
  addCompound: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, {
  pushPath,
  initialize,
  addCompound,
})(AddNewCompound);
