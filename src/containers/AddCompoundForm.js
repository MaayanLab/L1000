import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';

export class AddCompoundForm extends Component {
  render() {
    const {
      fields: {
        email,
        password,
      },
      submitting,
      resetForm,
      handleSubmit,
    } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <fieldset className="form-group">
          <div className="label-group">
            <label htmlFor="email">Email address</label>
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
          </div>
          <input
            id="password"
            type="password"
            className="form-control"
            placeholder="Enter password"
            {...password}
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
            {submitting ? <i/> : <i/>} Login
          </button>
        </div>
      </form>
    );
  }
}

AddCompoundForm.propTypes = {
  resetForm: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  fields: PropTypes.object.isRequired,
};

export default reduxForm({
  form: 'AddCompound',
  fields: ['email', 'password'],
})(AddCompoundForm);
