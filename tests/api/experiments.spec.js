import 'babel-polyfill';
import axios from 'axios';

describe('API - Experiments', function apiExperiments() {
  const API_ROOT = 'http://localhost:3000/L1000/api/v1';
  let tempExpId = '';

  it('Should get all experiments at /experiments', function getAllExperiments() {
    const promise = axios
      .get(`${API_ROOT}/experiments`)
      .then(response => Promise.resolve(response.data))
      .catch(response => Promise.reject(response));

    return Promise.all([
      promise.should.eventually.be.fulfilled,
      promise.should.eventually.be.an('array'),
      promise.should.eventually.have.length.above(0),
    ]);
  });

  it('Should create an experiment at /experiments/create', function createExperiment() {
    const newExperiment = {
      title: 'Test Experiment',
      type: 'Single Dose',
      description: 'Description of Test Experiment. Description of Test Experiment.',
      compounds: [],
    };
    const promise = axios
      .post(`${API_ROOT}/experiments/create`, newExperiment)
      .then(response => {
        const experiment = response.data;
        tempExpId = experiment._id;
        return Promise.resolve(experiment);
      })
      .catch(response => Promise.reject(response.statusText));

    return Promise.all([
      promise.should.eventually.be.fulfilled,
      promise.should.eventually.be.an('object'),
      promise.should.eventually.have.all.keys('_id', 'title', 'type', 'description', 'compounds'),
    ]);
  });

  it('Should find one experiment at /experiments/:id', function findOneExperiment() {
    const promise = axios
      .get(`${API_ROOT}/experiments/${tempExpId}`)
      .then(response => Promise.resolve(response.data))
      .catch(response => Promise.reject(response.statusText));

    return Promise.all([
      promise.should.eventually.be.fulfilled,
      promise.should.eventually.be.an('object'),
      promise.should.eventually.have.all.keys('_id', 'title', 'type', 'description', 'compounds'),
    ]);
  });

  it('Should add a compound at /experiments/:id/compounds/create?index=',
    function findOneExperiment() {
      // Index is between 0 and 360 because temp experiment is single dose
      const index = Math.floor(Math.random() * (360 + 1));
      const compound = {
        name: 'Test Compound',
      };
      const promise = axios
        .post(`${API_ROOT}/experiments/${tempExpId}/compounds/create?index=${index}`, compound)
        .then(response => Promise.resolve(response.data.compounds[index]))
        .catch(response => Promise.reject(response.statusText));

      return Promise.all([
        promise.should.eventually.be.fulfilled,
        promise.should.eventually.have.all.keys('_id', 'name'),
      ]);
    }
  );

  // it('Should remove a compound at /experiments/:id/compounds/:compoundId/remove',
  //   function findOneExperiment() {
  //     // Index is between 0 and 360 because temp experiment is single dose
  //     const index = Math.floor(Math.random() * (360 + 1));
  //     const compound = {
  //       name: 'Test Compound',
  //     };
  //     const promise = axios
  //       .post(`${API_ROOT}/experiments/${tempExpId}/compounds/create?index=${index}`, compound)
  //       .then(response => Promise.resolve(response.data.compounds[index]))
  //       .catch(response => Promise.reject(response.statusText));
  //
  //     return Promise.all([
  //       promise.should.eventually.be.fulfilled,
  //       promise.should.eventually.have.all.keys('_id', 'name'),
  //     ]);
  //   }
  // );

  it('Should find remove experiment at /experiments/:id/remove', function removeExperiment() {
    const promise = axios
      .delete(`${API_ROOT}/experiments/${tempExpId}/remove`)
      .then(response => Promise.resolve(response.data))
      .catch(response => Promise.reject(response.statusText));

    return Promise.all([
      promise.should.eventually.be.fulfilled,
    ]);
  });
});
