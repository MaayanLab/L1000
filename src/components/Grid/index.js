import React, { Component, PropTypes } from 'react';
import cn from 'classnames';
import GridItem from '../GridItem';
import styles from './Grid.scss';

class Grid extends Component {
  get isSingleDose() {
    return this.props.experiment.type === 'Single Dose';
  }
  get rowLength() {
    return this.isSingleDose ? 20 : 8;
  }
  get colLength() {
    return this.isSingleDose ? 18 : 7;
  }
  _handleClick = (compoundIndex) => {
    const id = this.props.experiment._id;
    return !!this.props.onSelectTile && this.props.onSelectTile(id, compoundIndex);
  }
  buildRows() {
    const { compounds } = this.props.experiment;
    const cellClass = this.isSingleDose
    ? styles['single-dose-cell']
    : styles['dose-response-cell'];
    const tiles = [];
    const numTiles = this.rowLength * this.colLength;
    for (let i = 0; i < numTiles; i++) {
      const compoundExists = !!compounds[i];
      // For class names, always add the class from cellClass above. If a compound exists, the cell
      // is taken, so add the styles.taken class, otherwise, add the styles.available class.
      tiles.push(
        <GridItem
          key={i}
          index={i}
          className={cn({
            [cellClass]: true,
            [styles.available]: !compoundExists,
            [styles.taken]: compoundExists,
          })}
          compound={compounds[i]}
          onSelectTile={this._handleClick}
        />
      );
    }
    return tiles;
  }
  render() {
    return (
      <div className={styles['board-outer']}>
        <div className={styles.board}>
          {this.buildRows()}
        </div>
      </div>
    );
  }
}


Grid.propTypes = {
  experiment: PropTypes.object,
  onSelectTile: PropTypes.func,
};

export default Grid;
