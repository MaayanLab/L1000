import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';

export class LoginForm extends Component {
  _focusEmail = (inp) => {
    if (inp !== null) {
      inp.focus();
    }
  };

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
      <form className="login-form" onSubmit={handleSubmit}>
        <fieldset className="form-group">
          <div className="label-group">
            <label htmlFor="email">Email address</label>
          </div>
          <input
            type="email"
            id="email"
            className="form-control"
            placeholder="Enter email"
            ref={this._focusEmail}
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
            type="button"
            className="btn btn-secondary"
            disabled={submitting}
            onClick={resetForm}
          >
            Reset
          </button>
          <button
            type="submit"
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

LoginForm.propTypes = {
  resetForm: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  fields: PropTypes.object.isRequired,
};

export default reduxForm({
  form: 'Login',
  fields: ['email', 'password'],
})(LoginForm);
