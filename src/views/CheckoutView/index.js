import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';
import { loadCompounds } from 'actions/entities';
import { updateQuantity } from 'actions/cart';
import CheckoutButton from 'components/CheckoutButton';
import CartItem from 'components/CartItem';
import styles from './CheckoutView.scss';

const mapStateToProps = (state) => ({
  auth: state.auth,
  entities: state.entities,
  pendingRequests: state.pendingRequests,
});
export class CheckoutView extends Component {
  componentDidMount() {
    this.props.loadCompounds();
  }

  _handleQuantity = (cartId, newQuantity) => {
    this.props.updateQuantity(cartId, newQuantity);
  };

  _handleCheckoutClick = () => {
    // console.log(this.props.auth.user.cart);
  };

  render() {
    const { auth, entities } = this.props;
    const { compounds, experiments } = entities;
    const { cart } = auth.user;
    let total = cart.subTotal + cart.tax + cart.shippingCost;
    total = total || 0.00;
    return (
      <div className="container">
        <div className="col-xs-8">
          {
            !!cart.items && cart.items.map((item) => {
              if (this.props.pendingRequests.isPending) {
                return (
                  <CartItem key={item.cartId} placeholder />
                );
              }
              const compound = compounds[item.compoundId];
              const experiment = experiments[item.experimentId];
              return (
                <CartItem
                  key={item.cartId}
                  onUpdateQuantity={this._handleQuantity}
                  item={item}
                  compound={compound}
                  experiment={experiment}
                />
              );
            })
          }
        </div>
        <div className={cn(['col-xs-4', styles['total-wrapper']])}>
          <h3 className="text-xs-center">Your Order</h3>
          <div className={styles['total-prices']}>
            <div className={styles['sub-price']}>
              <span className={styles['cost-type']}>Cart Subtotal</span>
              <span className={styles.cost}>${cart.subTotal}</span>
            </div>
            <div className={styles['sub-price']}>
              <span className={styles['cost-type']}>Tax</span>
              <span className={styles.cost}>${cart.tax}</span>
            </div>
            <div className={styles['sub-price']}>
              <span className={styles['cost-type']}>Shipping</span>
              <span className={styles.cost}>${cart.shippingCost}</span>
            </div>
            <hr />
            <div className={cn([styles['sub-price'], styles['sub-total']])}>
              <span className={cn([styles['cost-type'], styles['total-type']])}>
                Total
              </span>
              <h2 className={styles.total}>$ {total}</h2>
            </div>
          </div>
          <CheckoutButton className={styles['checkout-btn']} onClick={this._handleCheckoutClick} />
        </div>
      </div>
    );
  }
}

CheckoutView.propTypes = {
  auth: PropTypes.object.isRequired,
  entities: PropTypes.object.isRequired,
  loadCompounds: PropTypes.func.isRequired,
  updateQuantity: PropTypes.func.isRequired,
  pendingRequests: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, {
  updateQuantity,
  loadCompounds,
})(CheckoutView);
