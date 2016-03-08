import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import styles from './AddCompoundForm.scss';

// Some styles taken from global form.scss in styles/ folder

const validate = values => ({
  structure: values.structure ? undefined : 'Required',
  barcode: values.barcode ? undefined : 'Required',
  name: values.name ? undefined : 'Required',
  vendor: values.vendor ? undefined : 'Required',
  vendorCatalogId: values.vendorCatalogId ? undefined : 'Required',
  vendorLotNum: values.vendorLotNum ? undefined : 'Required',
  weight: values.weight ? undefined : 'Required',
  weightUnits: values.weightUnits ? undefined : 'Required',
  conc: values.conc ? undefined : 'Required',
  concUnits: values.concUnits ? undefined : 'Required',
  volume: values.volume ? undefined : 'Required',
  volumeUnits: values.volumeUnits ? undefined : 'Required',
  solvent: values.solvent ? undefined : 'Required',
  plate: values.plate ? undefined : 'Required',
  well: values.well ? undefined : 'Required',
});

export class AddCompoundForm extends Component {
  render() {
    const {
      user,
      fields,
      submitting,
      resetForm,
      handleSubmit,
    } = this.props;
    const inputs = [
      { id: 'structure', label: 'Structure', field: fields.structure },
      { id: 'barcode', label: 'Barcode', field: fields.barcode },
      { id: 'compound-name', label: 'Name', field: fields.name },
      { id: 'vendor', label: 'Vendor', field: fields.vendor },
      { id: 'vendor-catalog-id', label: 'Vendor Catalog Id', field: fields.vendorCatalogId },
      { id: 'vendor-lot-num', label: 'Vendor Lot Number', field: fields.vendorLotNum },
      { id: 'weight', label: 'Weight', field: fields.weight },
      { id: 'weight-units', label: 'Weight Units', field: fields.weightUnits },
      { id: 'conc', label: 'Concentration', field: fields.conc },
      { id: 'conc-units', label: 'Concentration Units', field: fields.concUnits },
      { id: 'volume', label: 'Volume', field: fields.volume },
      { id: 'volume-units', label: 'Volume Units', field: fields.volumeUnits },
      { id: 'solvent', label: 'Solvent', field: fields.solvent },
      { id: 'plate', label: 'Plate', field: fields.plate },
      { id: 'well', label: 'Well', field: fields.well },
    ];

    const pN = user.phoneNumber;
    const pStr = pN && `(${pN.substr(0, 3)})-${pN.substr(3, 3)}-${pN.substr(6, 4)}`;
    const addrTwo = user.addressTwo.length ? `, ${user.addressTwo}` : '';
    const address = `${user.addressOne}${addrTwo}, ${user.city}, ${user.state} ${user.zipCode}`;

    return (
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles['user-info']}>
          <fieldset className="form-group">
            <div className="label-group">
              <label><strong>Chemist:</strong> {user.name}</label>
            </div>
          </fieldset>
          <fieldset className="form-group">
            <div className="label-group">
              <label><strong>Email:</strong> {user.email}</label>
            </div>
          </fieldset>
          <fieldset className="form-group">
            <div className="label-group">
              <label><strong>Address:</strong> {address}</label>
            </div>
          </fieldset>
          <fieldset className="form-group">
            <div className="label-group">
              <label><strong>Institution:</strong> {user.institution}</label>
            </div>
          </fieldset>
          <fieldset className="form-group">
            <div className="label-group">
              <label>
                <strong>Phone Number: </strong>
                {pStr}
              </label>
            </div>
          </fieldset>
        </div>
        <div className={styles['compound-header']}>
          <h5>Please enter your compound information</h5>
          <span><em>All fields are required.</em></span>
        </div>
        <div className={styles['compound-info']}>
          {
            inputs.map((obj, index) =>
              <fieldset key={index} className="form-group">
                <div className="label-group">
                  <label htmlFor={obj.id}>{obj.label}</label>
                  {
                    obj.field.touched &&
                    obj.field.error &&
                    <span className="error">{obj.field.error}</span>
                  }
                </div>
                <input id={obj.id} type="text" className="form-control"
                  placeholder="" {...obj.field}
                />
              </fieldset>
            )
          }
        </div>
        <div className={styles.buttons}>
          <button className="btn btn-secondary" disabled={submitting} onClick={resetForm}>
            Reset
          </button>
          <button className="btn submit-btn" disabled={submitting} onClick={handleSubmit}>
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
  fields: [
    'structure',
    'barcode',
    'name',
    'vendor',
    'vendorCatalogId',
    'vendorLotNum',
    'weight',
    'weightUnits',
    'conc',
    'concUnits',
    'volume',
    'volumeUnits',
    'solvent',
    'plate',
    'well',
  ],
  validate,
})(AddCompoundForm);
