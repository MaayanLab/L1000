import React, { Component, PropTypes } from 'react';
import cn from 'classnames';
import styles from './OrderButton.scss';

class OrderButton extends Component {
  _handleClick = () => {
    this.props.onClick(this.props.experimentId);
  };

  render() {
    // Enable button by default. If spots available is undefined, return enabled button.
    if (this.props.spotsAvailable || this.props.spotsAvailable === undefined) {
      return (
        <button
          className={cn(['btn', styles['order-btn']])}
          onClick={this._handleClick}
        >
          Reserve a Spot
        </button>
      );
    }
    return (
      <button
        className={cn(['btn', styles['order-btn-disabled']])}
        disabled
      >
        All Spots Taken
      </button>
    );
  }
}

OrderButton.propTypes = {
  onClick: PropTypes.func,
  experimentId: PropTypes.string,
  spotsAvailable: PropTypes.bool,
};

export default OrderButton;
