import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import handleResponse from 'utils/handleResponse';

const validate = values => {
  const errors = {
    name: values.name ? undefined : 'Required',
    address: values.address ? undefined : 'Required',
    phoneNumber: values.phoneNumber ? undefined : 'Required',
  };

  if (!values.email) {
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

const asyncValidate = ({ email }) =>
  new Promise((resolve, reject) => {
    fetch('/L1000/api/v1/users/emailAvailable', {
      method: 'post',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
    .then(response => handleResponse(response))
    .then(() => resolve())
    .catch(() => reject({ email: 'Email is taken. Please try another.' }));
  });

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
      asyncValidating,
      submitting,
      resetForm,
      handleSubmit,
    } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <p className="text-xs-center"><em>All Fields are required.</em></p>
        <fieldset className="form-group">
          <div className="label-group">
            <label htmlFor="email">Email address</label>
            {
              email.touched &&
              email.error &&
              <span className="error">*{email.error}</span>
            }
            {
              asyncValidating === 'email' &&
              <span className="error">Checking if email is available...</span>
            }
          </div>
          <input
            type="email"
            id="email"
            className="form-control"
            placeholder="Enter email"
            {...email}
          />
        </fieldset>
        <fieldset className="form-group">
          <div className="label-group">
            <label htmlFor="password">Password</label>
            {
              password.touched &&
              password.error &&
              <span className="error">*{password.error}</span>
            }
          </div>
          <input
            id="password"
            type="password"
            className="form-control"
            placeholder="Enter password"
            {...password}
          />
          <small className="text-muted">
            Password must be greater than 6 characters, less than 50, contain at least 1 letter
            and number, and it may contain special characters !@#$%^&*()_+
          </small>
        </fieldset>
        <fieldset className="form-group">
          <div className="label-group">
            <label htmlFor="name">Name</label>
            {
              name.touched &&
              name.error &&
              <span className="error">*{name.error}</span>
            }
          </div>
          <input
            id="name"
            type="name"
            className="form-control"
            placeholder="John Doe"
            {...name}
          />
        </fieldset>
        <fieldset className="form-group">
          <div className="label-group">
            <label htmlFor="address">Address</label>
            {
              address.touched &&
              address.error &&
              <span className="error">*{address.error}</span>
            }
          </div>
          <input
            id="address"
            type="address"
            className="form-control"
            placeholder="415 Main Street, Cambridge, MA 02142"
            {...address}
          />
        </fieldset>
        <fieldset className="form-group">
          <div className="label-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            {
              phoneNumber.touched &&
              phoneNumber.error &&
              <span className="error">*{phoneNumber.error}</span>
            }
          </div>
          <input
            id="phoneNumber"
            type="phoneNumber"
            className="form-control"
            placeholder="555-867-5309"
            {...phoneNumber}
          />
        </fieldset>
        <div className="form-buttons">
          <button
            className="btn btn-secondary"
            disabled={submitting}
            onClick={resetForm}
          >
            Reset
          </button>
          <button
            className="btn submit-btn"
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
  asyncValidating: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  resetForm: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  fields: PropTypes.object.isRequired,
};

export default reduxForm({
  form: 'Register',
  fields: ['email', 'password', 'name', 'address', 'phoneNumber'],
  asyncValidate,
  asyncBlurFields: ['email'],
  validate,
})(RegisterForm);
