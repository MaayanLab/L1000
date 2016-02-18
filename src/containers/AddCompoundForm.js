import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';

export class AddCompoundForm extends Component {
  render() {
    const {
      user,
      fields: {
        compoundName,
      },
      submitting,
      resetForm,
      handleSubmit,
    } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <fieldset className="form-group">
          <div className="label-group">
            <label><strong>Name:</strong> {user.name}</label>
          </div>
        </fieldset>
        <fieldset className="form-group">
          <div className="label-group">
            <label><strong>Email:</strong> {user.email}</label>
          </div>
        </fieldset>
        <fieldset className="form-group">
          <div className="label-group">
            <label><strong>Address:</strong> {user.address}</label>
          </div>
        </fieldset>
        <fieldset className="form-group">
          <div className="label-group">
            <label><strong>Phone Number:</strong> {user.phoneNumber}</label>
          </div>
        </fieldset>
        <fieldset className="form-group">
          <div className="label-group">
            <label htmlFor="compound-name">Compound Name</label>
          </div>
          <input
            id="compound-name"
            type="compound-name"
            className="form-control"
            placeholder="Enter compound name"
            {...compoundName}
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
            {submitting ? <i/> : <i/>} Add to Cart
          </button>
        </div>
      </form>
    );
  }
}

AddCompoundForm.propTypes = {
  user: PropTypes.object,
  resetForm: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  fields: PropTypes.object.isRequired,
};

export default reduxForm({
  form: 'AddCompound',
  fields: ['compoundName'],
})(AddCompoundForm);
