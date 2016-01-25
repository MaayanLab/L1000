import React, { Component, PropTypes } from 'react';
import cn from 'classnames';
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
      tiles.push(
        <div
          key={i}
          className={cn({
            [cellClass]: true,
            [styles.taken]: compoundExists,
            [styles.available]: !compoundExists,
          })}
        />
      );
    }
    return tiles;
  }
  render() {
    const width = this.props.width || 200;
    const height = width * 1.1;
    return (
      <div className={styles.experiment}>
        <div style={{ height, width }}>
          <div className={styles.board}>
            {this.buildRows()}
          </div>
        </div>
      </div>
    );
  }
}


Experiment.propTypes = {
  width: PropTypes.number,
  experiment: PropTypes.object.isRequired,
  compounds: PropTypes.object.isRequired,
  onSelectTile: PropTypes.func,
};

export default Experiment;
