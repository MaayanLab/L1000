import React, { Component, PropTypes } from 'react';
import cn from 'classnames';
import styles from './CheckoutButton.scss';

class CheckoutButton extends Component {
  _handleClick = () => {
    this.props.onClick();
  };

  render() {
    return (
      <button
        onClick={this._handleClick}
        className={cn([this.props.className, 'btn', styles['checkout-btn']])}
      >
        Checkout
      </button>
    );
  }
}

CheckoutButton.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default CheckoutButton;
