import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import RegisterForm from 'containers/RegisterForm';
import styles from './RegisterView.scss';
import { registerUser } from 'actions';

const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default class RegisterView extends Component {
  _handleRegister = ({ email, password, name, address, phoneNumber }) => {
    this.props.registerUser(email, password, name, address, phoneNumber);
  };

  render() {
    return (
      <div className="container">
        <h2 className="text-xs-center">Register</h2>
        <div className={styles['form-wrapper']}>
          <RegisterForm onSubmit={this._handleRegister} />
        </div>
      </div>
    );
  }
}

RegisterView.propTypes = {
  registerUser: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, {
  registerUser,
})(RegisterView);
