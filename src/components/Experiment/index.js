import React, { Component, PropTypes } from 'react';
import cn from 'classnames';
import GridItem from '../GridItem';
import styles from './Experiment.scss';

class Experiment extends Component {
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
    // this.props.experiments.compounds is an array of compound _id's specific to that experiment
    // this.props.compounds is an object with compound _id's as keys
    const { compounds } = this.props.experiment;
    const cellClass = this.isSingleDose
    ? styles['single-dose-cell']
    : styles['dose-response-cell'];
    const tiles = [];
    const numTiles = this.rowLength * this.colLength;
    for (let i = 0; i < numTiles; i++) {
      const compoundExists = !!compounds[i];
      if (compoundExists) {
        tiles.push(
          <GridItem
            key={i}
            index={i}
            compound={this.props.compounds[compounds[i]]}
            className={cn([cellClass, styles.taken])}
          />
        );
      } else {
        tiles.push(
          <GridItem
            key={i}
            index={i}
            className={cn({
              [cellClass]: true,
              [styles.available]: i !== this.props.selectedIndex,
              [styles.selected]: i === this.props.selectedIndex,
            })}
            onSelectTile={this._handleClick}
          />
        );
      }
    }
    return tiles;
  }
  render() {
    return (
      <div className={styles.experiment}>
        <div className={styles['board-outer']}>
          <div className={styles.board}>
            {this.buildRows()}
          </div>
        </div>
      </div>
    );
  }
}


Experiment.propTypes = {
  selectedIndex: PropTypes.number,
  experiment: PropTypes.object.isRequired,
  compounds: PropTypes.object.isRequired,
  onSelectTile: PropTypes.func,
};

export default Experiment;
