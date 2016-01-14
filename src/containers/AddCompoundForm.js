import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';

export class AddCompoundForm extends Component {
  render() {
    const {
      fields: {
        compoundName,
      },
      submitting,
      resetForm,
      handleSubmit,
    } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label>Compound Name</label>
          <input type="text" {...compoundName} />
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
  fields: ['compoundName'],
})(AddCompoundForm);
