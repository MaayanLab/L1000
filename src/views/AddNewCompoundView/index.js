import React, { Component, PropTypes } from 'react';
// import { pushPath } from 'redux-simple-router';
import { connect } from 'react-redux';
import { pushPath } from 'redux-simple-router';
import { initialize } from 'redux-form';
import { addCompound, loadExperiments } from '../../actions';
import AddCompoundForm from '../../containers/AddCompoundForm';
import Experiment from '../../components/Experiment';
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
    const { index } = this.props.location.query;
    console.log(formData);
    this.props.addCompound(formData, experimentId, index);
    // Re-initialize AddCompound Form
    this.props.initialize('AddCompound');
    // TODO: Eventually go to an experiment or  compound specific page
    // this.props.pushPath(`/experiments/${experimentId}/compounds/${index}`);
    this.props.pushPath('/');
  }

  _handleSelectTile = (experimentId, compoundIndex) => {
    this.props.pushPath(`/experiments/${experimentId}/compounds/create?index=${compoundIndex}`);
  }

  render() {
    const { entities } = this.props;
    const experiment = entities.experiments[this.props.params.experimentId];
    return (
      <div className="wrapper">
        <div className="container">
          <h1 className="text-center">Add a Compound</h1>
          <div className={styles['form-wrapper']}>
            <AddCompoundForm onSubmit={this._handleSubmit} />
          </div>
          <div className={styles.experiment}>
            {
              !!entities && !!experiment ?
              <Experiment
                experiment={experiment}
                compounds={entities.compounds}
                selectedIndex={parseInt(this.props.location.query.index, 10)}
                onSelectTile={this._handleSelectTile}
              />
              : null
            }
          </div>
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
