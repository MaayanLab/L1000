import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import LoginForm from 'containers/LoginForm';
import styles from './LoginView.scss';
import { loginUser } from 'actions';

const mapStateToProps = (state) => ({
  auth: state.auth,
});
export class LoginView extends Component {
  _handleLogin = (user) => {
    this.props.loginUser(user.email, user.password);
  };

  render() {
    return (
      <div className="container">
        <h2 className="text-xs-center">Login</h2>
        <div className={styles['form-wrapper']}>
          <LoginForm onSubmit={this._handleLogin}/>
        </div>
      </div>
    );
  }
}

LoginView.propTypes = {
  loginUser: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, {
  loginUser,
})(LoginView);
