import React, { Component } from 'react';
import RegisterForm from 'containers/RegisterForm';
import styles from './RegisterView.scss';

export default class RegisterView extends Component {
  render() {
    return (
      <div className="container">
        <h2 className="text-xs-center">Register</h2>
        <div className={styles['form-wrapper']}>
          <RegisterForm />
        </div>
      </div>
    );
  }
}
