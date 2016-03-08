import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import handleResponse from 'utils/handleResponse';
import styles from './RegisterForm.scss';

// Some styles taken from global _form.scss in styles folder

const validate = values => {
  const errors = {
    name: values.name ? undefined : 'Required',
    institution: values.institution ? undefined : 'Required',
    addressOne: values.addressOne ? undefined : 'Required',
    city: values.city ? undefined : 'Required',
    state: values.state ? undefined : 'Required',
    zipCode: values.zipCode ? undefined : 'Required',
    phoneNumber: values.phoneNumber ? undefined : 'Required',
  };

  if (!values.name) {
    errors.name = 'Required';
  } else if (values.name.split(' ').length < 2) {
    errors.name = 'Please enter your full name.';
  }

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

const states = [
  { name: 'Alabama', abbr: 'AL' },
  { name: 'Montana', abbr: 'MT' },
  { name: 'Alaska', abbr: 'AK' },
  { name: 'Nebraska', abbr: 'NE' },
  { name: 'Arizona', abbr: 'AZ' },
  { name: 'Nevada', abbr: 'NV' },
  { name: 'Arkansas', abbr: 'AR' },
  { name: 'New Hampshire', abbr: 'NH' },
  { name: 'California', abbr: 'CA' },
  { name: 'New Jersey', abbr: 'NJ' },
  { name: 'Colorado', abbr: 'CO' },
  { name: 'New Mexico', abbr: 'NM' },
  { name: 'Connecticut', abbr: 'CT' },
  { name: 'New York', abbr: 'NY' },
  { name: 'Delaware', abbr: 'DE' },
  { name: 'North Carolina', abbr: 'NC' },
  { name: 'Florida', abbr: 'FL' },
  { name: 'North Dakota', abbr: 'ND' },
  { name: 'Georgia', abbr: 'GA' },
  { name: 'Ohio', abbr: 'OH' },
  { name: 'Hawaii', abbr: 'HI' },
  { name: 'Oklahoma', abbr: 'OK' },
  { name: 'Idaho', abbr: 'ID' },
  { name: 'Oregon', abbr: 'OR' },
  { name: 'Illinois', abbr: 'IL' },
  { name: 'Pennsylvania', abbr: 'PA' },
  { name: 'Indiana', abbr: 'IN' },
  { name: 'Rhode Island', abbr: 'RI' },
  { name: 'Iowa', abbr: 'IA' },
  { name: 'South Carolina', abbr: 'SC' },
  { name: 'Kansas', abbr: 'KS' },
  { name: 'South Dakota', abbr: 'SD' },
  { name: 'Kentucky', abbr: 'KY' },
  { name: 'Tennessee', abbr: 'TN' },
  { name: 'Louisiana', abbr: 'LA' },
  { name: 'Texas', abbr: 'TX' },
  { name: 'Maine', abbr: 'ME' },
  { name: 'Utah', abbr: 'UT' },
  { name: 'Maryland', abbr: 'MD' },
  { name: 'Vermont', abbr: 'VT' },
  { name: 'Massachusetts', abbr: 'MA' },
  { name: 'Virginia', abbr: 'VA' },
  { name: 'Michigan', abbr: 'MI' },
  { name: 'Washington', abbr: 'WA' },
  { name: 'Minnesota', abbr: 'MN' },
  { name: 'West Virginia', abbr: 'WV' },
  { name: 'Mississippi', abbr: 'MS' },
  { name: 'Wisconsin', abbr: 'WI' },
  { name: 'Missouri', abbr: 'MO' },
  { name: 'Wyoming', abbr: 'WY' },
];

export class RegisterForm extends Component {
  render() {
    const {
      fields: {
        email,
        password,
        name,
        institution,
        addressOne,
        addressTwo,
        city,
        state,
        zipCode,
        phoneNumber,
      },
      asyncValidating,
      submitting,
      resetForm,
      handleSubmit,
    } = this.props;

    return (
      <form className={styles.form} onSubmit={handleSubmit}>
        <p className="text-xs-center error"><em>* required</em></p>
        <div className={styles.inputs}>
          <fieldset className={`form-group ${styles.full}`}>
            <div className="label-group">
              <label htmlFor="email">Email address*</label>
              {
                email.touched &&
                email.error &&
                <span className="error">{email.error}</span>
              }
              {
                asyncValidating === 'email' &&
                <span className="error">Checking if email is available...</span>
              }
            </div>
            <input
              id="email"
              type="email"
              className="form-control"
              placeholder="Enter email"
              {...email}
            />
          </fieldset>
          <fieldset className={`form-group ${styles.full}`}>
            <div className="label-group">
              <label htmlFor="password">Password*</label>
              {
                password.touched &&
                password.error &&
                <span className="error">{password.error}</span>
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
          <fieldset className={`form-group ${styles.half}`}>
            <div className="label-group">
              <label htmlFor="name">Name*</label>
              {
                name.touched &&
                name.error &&
                <span className="error">{name.error}</span>
              }
            </div>
            <input
              id="name"
              type="text"
              className="form-control"
              placeholder="John Doe"
              {...name}
            />
          </fieldset>
          <fieldset className={`form-group ${styles.half}`}>
            <div className="label-group">
              <label htmlFor="institution">Institution*</label>
              {
                institution.touched &&
                institution.error &&
                <span className="error">{institution.error}</span>
              }
            </div>
            <input
              id="institution"
              type="text"
              className="form-control"
              placeholder="Broad Institute"
              {...institution}
            />
          </fieldset>
          <fieldset className={`form-group ${styles.full}`}>
            <div className="label-group">
              <label htmlFor="address-one">Address 1*</label>
              {
                addressOne.touched &&
                addressOne.error &&
                <span className="error">{addressOne.error}</span>
              }
            </div>
            <input
              id="address-one"
              type="text"
              className="form-control"
              placeholder="415 Main Street"
              {...addressOne}
            />
          </fieldset>
          <fieldset className={`form-group ${styles.full}`}>
            <div className="label-group">
              <label htmlFor="address-two">Address 2</label>
              {
                addressTwo.touched &&
                addressTwo.error &&
                <span className="error">{addressTwo.error}</span>
              }
            </div>
            <input
              id="address-two"
              type="text"
              className="form-control"
              {...addressTwo}
            />
          </fieldset>
          <fieldset className={`form-group ${styles.half}`}>
            <div className="label-group">
              <label htmlFor="city">City*</label>
              {
                city.touched &&
                city.error &&
                <span className="error">{city.error}</span>
              }
            </div>
            <input
              id="city"
              type="text"
              className="form-control"
              placeholder="Cambridge"
              {...city}
            />
          </fieldset>
          <fieldset className={`form-group ${styles.half}`}>
            <div className="label-group">
              <label htmlFor="state">State*</label>
              {
                state.touched &&
                state.error &&
                <span className="error">{state.error}</span>
              }
            </div>
            <select
              id="state"
              className="form-control"
              placeholder="Please select"
              value={state.value || ''}
              {...state}
            >
              <option value="" disabled hidden>Please select</option>
              {
                states.map((stateObj, i) =>
                  <option key={i} value={stateObj.abbr}>{stateObj.name} - {stateObj.abbr}</option>
                )
              }
            </select>
          </fieldset>
          <fieldset className={`form-group ${styles.half}`}>
            <div className="label-group">
              <label htmlFor="zip-code">Zip Code*</label>
              {
                zipCode.touched &&
                zipCode.error &&
                <span className="error">{zipCode.error}</span>
              }
            </div>
            <input
              id="zip-code"
              type="text"
              className="form-control"
              placeholder="02142"
              {...zipCode}
            />
          </fieldset>
          <fieldset className={`form-group ${styles.half}`}>
            <div className="label-group">
              <label htmlFor="phoneNumber">Phone Number*</label>
              {
                phoneNumber.touched &&
                phoneNumber.error &&
                <span className="error">{phoneNumber.error}</span>
              }
            </div>
            <input
              id="phoneNumber"
              type="text"
              className="form-control"
              placeholder="555-867-5309"
              {...phoneNumber}
            />
          </fieldset>
        </div>
        <div className={styles.buttons}>
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
  fields: [
    'email',
    'password',
    'name',
    'institution',
    'addressOne',
    'addressTwo',
    'city',
    'state',
    'zipCode',
    'phoneNumber',
  ],
  asyncValidate,
  asyncBlurFields: ['email'],
  validate,
})(RegisterForm);
