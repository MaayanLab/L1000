import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { routeActions } from 'react-router-redux';
import Modal from 'react-modal';

import { loginUser } from 'actions/auth';
import { loadExperiments } from 'actions/entities';
import { addToCart } from 'actions/cart';
import AddCompoundForm from 'containers/AddCompoundForm';
import LoginForm from 'containers/LoginForm';
// import Experiment from 'components/Experiment';
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

  _handleSubmit = (compound) => {
    // Rest of compound is taken from user object
    const { params, auth } = this.props;
    const newCompound = {
      ...compound,
      submitter: auth.user._id,
      status: 'reserved',
    };

    this.props.addToCart(newCompound, params.experimentId);
    this.props.push('/user/cart');
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
        <h3 className={styles.header}>
          Reserve a Compound in <strong>{experiment.title}</strong>
        </h3>
        <div className={styles.wrapper}>
          <AddCompoundForm user={auth.user} onSubmit={this._handleSubmit} />
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
  addToCart: PropTypes.func.isRequired,
  loadExperiments: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, {
  addToCart,
  loginUser,
  loadExperiments,
  ...routeActions,
})(AddNewCompoundView);
