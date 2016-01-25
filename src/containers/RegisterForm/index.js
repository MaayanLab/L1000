import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import cn from 'classnames';
import styles from './RegisterForm.scss';

const validate = values => {
  const errors = {
    name: values.name ? undefined : 'Required',
    address: values.address ? undefined : 'Required',
    phoneNumber: values.phoneNumber ? undefined : 'Required',
  };

  if (!values.password) {
    errors.email = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }

  if (!values.password) {
    errors.password = 'Required';
  } else if (values.password.length < 6) {
    errors.password = 'Password is too short. It must be greater than 6 characters.';
  } else if (values.password.length > 50) {
    errors.password = 'Password is too long. It must be less than 50 characters.';
  } else if (values.password.search(/\d/) === -1) {
    errors.password = 'Password does not contain a number.';
  } else if (values.password.search(/[a-zA-Z]/) === -1) {
    errors.password = 'Password does not contain a letter';
  } else if (values.password.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+]/) !== -1) {
    errors.password = 'Password contains a bad character. Make sure only proper characters ' +
      'are used.';
  }

  return errors;
};

export class RegisterForm extends Component {
  render() {
    const {
      fields: {
        email,
        password,
        name,
        address,
        phoneNumber,
      },
      submitting,
      resetForm,
      handleSubmit,
    } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <fieldset className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            className="form-control"
            placeholder="Enter email"
            {...email}
          />
          { email.touched && email.error && <div>{email.error}</div> }
        </fieldset>
        <fieldset className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="form-control"
            placeholder="Enter password"
            {...password}
          />
          <small className="text-muted">
            Password must be greater than 6 characters, less than 50, contain at least 1 letter
            and number, and it may conain special characters !@#$%^&*()_+
          </small>
          { password.touched && password.error && <div>{password.error}</div> }
        </fieldset>
        <fieldset className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="name"
            className="form-control"
            placeholder="John Doe"
            {...name}
          />
          { name.touched && name.error && <div>{name.error}</div> }
        </fieldset>
        <fieldset className="form-group">
          <label htmlFor="address">Address</label>
          <input
            id="address"
            type="address"
            className="form-control"
            placeholder="415 Main Street, Cambridge, MA 02142"
            {...address}
          />
          { address.touched && address.error && <div>{address.error}</div> }
        </fieldset>
        <fieldset className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            id="phoneNumber"
            type="phoneNumber"
            className="form-control"
            placeholder="555-867-5309"
            {...phoneNumber}
          />
          { phoneNumber.touched && phoneNumber.error && <div>{phoneNumber.error}</div> }
        </fieldset>
        <div className={styles['form-buttons']}>
          <button
            className="btn btn-secondary"
            disabled={submitting}
            onClick={resetForm}
          >
            Reset
          </button>
          <button
            className={cn(['btn', styles['submit-btn']])}
            disabled={submitting}
            onClick={handleSubmit}
          >
            {submitting ? <i/> : <i/>} Register
          </button>
        </div>
      </form>
    );
  }
}

RegisterForm.propTypes = {
  resetForm: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  fields: PropTypes.object.isRequired,
};

export default reduxForm({
  form: 'Register',
  fields: ['email', 'password', 'name', 'address', 'phoneNumber'],
  validate,
})(RegisterForm);
