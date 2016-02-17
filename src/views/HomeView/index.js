import React, { Component, PropTypes } from 'react';
import { routeActions } from 'react-router-redux';
import { connect } from 'react-redux';
import cn from 'classnames';
import { loginUser } from 'actions/auth';
import { loadExperiments } from 'actions/entities';
import Experiment from 'components/Experiment';
import OrderButton from 'components/OrderButton';
import styles from './HomeView.scss';

const mapStateToProps = (state) => ({
  entities: state.entities,
});
export class HomeView extends Component {
  _handleButtonClick = (experimentId) => {
    this.props.push(`/experiments/${experimentId}/compounds/add`);
  };

  render() {
    const { entities } = this.props;
    return (
      <div className="wrapper">
        <div className="container">
          <h1 className="text-xs-center">Welcome to the L1000 Ordering System</h1>
          <table className={styles.legend}>
            <tbody>
              <tr>
                <td>Paid</td>
                <td>Reserved</td>
                <td>Available</td>
              </tr>
              <tr>
                <td className={cn([styles.cell, styles.paid])}></td>
                <td className={cn([styles.cell, styles.taken])}></td>
                <td className={cn([styles.cell, styles.available])}></td>
              </tr>
            </tbody>
          </table>
          <div className={styles['experiment-wrapper']}>
          {
            // Iterate over entities.experiments if it exists, and create a grid for each one
            !!entities && Object.keys(entities.experiments).map((experimentId, index) => {
              const exp = entities.experiments[experimentId];
              const numCompounds = exp.type === 'Single Dose' ? 20 * 18 : 8 * 7;
              const spotsAvailable = exp.compounds.length < numCompounds;
              return (
                <div key={index} className={styles.experiment}>
                  <Experiment
                    width={220}
                    experiment={exp}
                    compounds={entities.compounds}
                  />
                  <div className={styles['experiment-info']}>
                    <h4>{exp.title}</h4>
                    <h6><em>{exp.type}</em></h6>
                    <p>{exp.description}</p>
                    <p>Spots Available: {numCompounds - exp.compounds.length}/{numCompounds}</p>
                    <OrderButton
                      experimentId={experimentId}
                      spotsAvailable={spotsAvailable}
                      onClick={this._handleButtonClick}
                    />
                  </div>
                </div>
              );
            })
          }
          </div>
        </div>
      </div>
    );
  }
}

HomeView.propTypes = {
  loginUser: PropTypes.func,
  entities: PropTypes.object,
  push: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, {
  loginUser,
  loadExperiments,
  ...routeActions,
})(HomeView);
