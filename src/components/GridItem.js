import React, { Component, PropTypes } from 'react';

class GridItem extends Component {

  _handleClick = () => {
    return !!this.props.onSelectTile && this.props.onSelectTile(this.props.index);
  }

  render() {
    if (this.props.compound) {
      return (
        <div className={this.props.className} />
      );
    }
    return (
      <div className={this.props.className} onClick={this._handleClick} />
    );
  }
}

GridItem.propTypes = {
  index: PropTypes.number,
  compound: PropTypes.object,
  className: PropTypes.string,
  onSelectTile: PropTypes.func,
};

export default GridItem;
