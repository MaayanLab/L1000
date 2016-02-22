import React, { Component, PropTypes } from 'react';
import cn from 'classnames';
import styles from './CartItem.scss';

class CartItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity: props.item ? props.item.quantity : undefined,
    };
  }

  componentWillReceiveProps(props) {
    if (props.item && props.item.quantity) {
      this.setState({ quantity: props.item.quantity });
    }
  }

  _handleQuantityInput = (event) => {
    this.setState({ quantity: event.target.value });
  };

  _handleQuantitySubmit = () => {
    const { item } = this.props;
    const quantity = parseInt(this.state.quantity, 10);
    this.props.onUpdateQuantity(item.cartId, quantity);
  };

  _handleRemove = () => {
    const { item } = this.props;
    this.props.onRemoveItem(item.cartId);
  };

  render() {
    if (this.props.placeholder) {
      return (
        <div className={styles['cart-item']}>
          <h4>Loading...</h4>
          <h6>Loading...</h6>
        </div>
      );
    }
    const self = this;
    const { item, experiment, compound } = this.props;
    const totalPrice = item.quantity * item.price;
    return (
      <div className={cn(['col-xs-12', styles['cart-item']])}>
        <div className="col-xs-4">
          <h4>{compound && compound.name}</h4>
          <h6>{experiment.title}</h6>
        </div>
        <div className={cn(['col-xs-5', 'text-xs-center', styles.quantity])}>
          <input
            type="text"
            pattern="[0-9]*"
            className={styles['quantity-input']}
            onChange={self._handleQuantityInput}
            value={this.state.quantity}
          />
          <p>
            <a onClick={this._handleQuantitySubmit}>Update</a>
          </p>
          <p>
            <a onClick={this._handleRemove}>Remove</a>
          </p>
        </div>
          {
            item.quantity > 1
            ? (
              <div className="col-xs-3">
                <h6 className="text-xs-right">${item.price}</h6>
                <h6 className="text-xs-right">* {item.quantity}</h6>
                <hr />
                <h4 className="text-xs-right">${totalPrice}</h4>
              </div>
            )
            : (
              <div className="col-xs-3">
                <h4 className="text-xs-right">${totalPrice}</h4>
              </div>
            )
          }
      </div>
    );
  }
}

CartItem.propTypes = {
  item: PropTypes.object,
  experiment: PropTypes.object,
  compound: PropTypes.object,
  onUpdateQuantity: PropTypes.func,
  onRemoveItem: PropTypes.func,
  placeholder: PropTypes.bool,
};

export default CartItem;
