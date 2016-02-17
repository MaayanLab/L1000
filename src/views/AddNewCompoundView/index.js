import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { routeActions } from 'react-router-redux';
import Modal from 'react-modal';

import { loginUser } from 'actions/auth';
import { addCompound, loadExperiments } from 'actions/entities';
import AddCompoundForm from 'containers/AddCompoundForm';
import LoginForm from 'containers/LoginForm';
import Experiment from 'components/Experiment';
import styles from './AddNewCompoundView.scss';
import modalStyles from './modalStyles';

const mapStateToProps = (state) => ({
  auth: state.auth,
  entities: state.entities,
});
export class AddNewCompoundView extends Component {
  _handleLogin = (user) => {
    const { location } = this.props;
    this.props.loginUser(user.email, user.password, location.pathname, true);
  };

  _handleModalCloseRequest = () => {
    this.props.goBack();
  };

  _handleSubmit = (formData) => {
    const { params } = this.props;
    this.props.addCompound(formData, params.experimentId);
    // TODO: Eventually go to an experiment or compound specific page
    // this.props.push(`/experiments/${experimentId}/compounds/${compoundId}`);
    this.props.push('/');
  };

  render() {
    const { auth, entities, params } = this.props;
    const experiment = entities.experiments[params.experimentId];
    return (
      <div className="container">
        <Modal
          className="modal-dialog"
          isOpen={!auth.isAuthenticated}
          onRequestClose={this.handleModalCloseRequest}
          style={modalStyles}
        >
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" onClick={this._handleModalCloseRequest}>
                <span aria-hidden="true">&times;</span>
                <span className="sr-only">Close</span>
              </button>
              <h4 className="modal-title">You must be logged in to continue.</h4>
            </div>
            <div className="modal-body">
              <LoginForm onSubmit={this._handleLogin} />
              <p>Not signed up? <Link to="/register">Register</Link> today!</p>
            </div>
          </div>
        </Modal>
        <h1 className="text-xs-center">
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
          <AddCompoundForm user={this.props.auth.user} onSubmit={this._handleSubmit} />
        </div>
      </div>
    );
  }
}

AddNewCompoundView.propTypes = {
  params: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  entities: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  push: PropTypes.func.isRequired, // Extracted from ...routeActions below
  goBack: PropTypes.func.isRequired, // Extracted from ...routeActions below
  loginUser: PropTypes.func.isRequired,
  addCompound: PropTypes.func.isRequired,
  loadExperiments: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, {
  addCompound,
  loginUser,
  loadExperiments,
  ...routeActions,
})(AddNewCompoundView);
