import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';

export class AddCompoundForm extends Component {
  render() {
    const {
      fields: {
        name,
        address,
        compound,
      },
      submitting,
      resetForm,
      handleSubmit,
    } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input type="text" {...name} />
        </div>
        <div>
          <label>Address</label>
          <input type="text" {...address} />
        </div>
        <div>
          <label>Compound</label>
          <input type="text" {...compound} />
        </div>
        <button disabled={submitting} onClick={resetForm}>
          Clear Values
        </button>
        <button disabled={submitting} onClick={handleSubmit}>
          {submitting ? <i/> : <i/>} Submit
        </button>
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
  fields: ['name', 'address', 'compound'],
})(AddCompoundForm);
