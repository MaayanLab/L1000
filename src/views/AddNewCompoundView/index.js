import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushPath } from 'redux-simple-router';
import { initialize } from 'redux-form';
import { addCompound, loadExperiments } from 'actions';
import AddCompoundForm from 'containers/AddCompoundForm';
import Experiment from 'components/Experiment';
import styles from './AddNewCompoundView.scss';

const mapStateToProps = (state) => ({
  entities: state.entities,
});
export class AddNewCompound extends Component {
  componentWillMount() {
    this.props.loadExperiments();
  }

  _handleSubmit = (formData) => {
    const { experimentId } = this.props.params;
    this.props.addCompound(formData, experimentId);
    // Re-initialize AddCompound Form
    // TODO: Eventually go to an experiment or compound specific page
    // this.props.pushPath(`/experiments/${experimentId}/compounds/${compoundId}`);
    this.props.pushPath('/');
  }

  render() {
    const { entities } = this.props;
    const experiment = entities.experiments[this.props.params.experimentId];
    return (
      <div className="container">
        <h1 className="text-center">
          Reserve a Compound in <strong>{experiment.title}</strong>
        </h1>
        <div className={styles.wrapper}>
          <div className={styles.experiment}>
            {
              !!entities && !!experiment ?
              <Experiment
                width={300}
                experiment={experiment}
                compounds={entities.compounds}
              />
              : null
            }
          </div>
          <AddCompoundForm onSubmit={this._handleSubmit} />
        </div>
      </div>
    );
  }
}

AddNewCompound.propTypes = {
  params: PropTypes.object.isRequired,
  entities: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  pushPath: PropTypes.func.isRequired,
  initialize: PropTypes.func.isRequired,
  addCompound: PropTypes.func.isRequired,
  loadExperiments: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, {
  pushPath,
  initialize,
  addCompound,
  loadExperiments,
})(AddNewCompound);
