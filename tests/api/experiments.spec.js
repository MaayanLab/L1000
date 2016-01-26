import 'babel-polyfill';
import axios from 'axios';

describe('API - Experiments', function apiExperiments() {
  const API_BASE_URL = 'http://localhost:3000/L1000/api/v1';
  let tempExpId = '';

  it('Should get all experiments at /experiments', function getAllExperiments() {
    const promise = axios
      .get(`${API_BASE_URL}/experiments`)
      .then(response => Promise.resolve(response.data))
      .catch(response => Promise.reject(response));

    return Promise.all([
      promise.should.eventually.be.fulfilled,
      promise.should.eventually.be.an('array'),
      promise.should.eventually.have.length.above(0),
    ]);
  });

  it('Should add an experiment at /experiments/add', function createExperiment() {
    const newExperiment = {
      title: 'Test Experiment',
      type: 'Single Dose',
      description: 'Description of Test Experiment. Description of Test Experiment.',
      compounds: [],
    };
    const promise = axios
      .post(`${API_BASE_URL}/experiments/add`, newExperiment)
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
      .get(`${API_BASE_URL}/experiments/${tempExpId}`)
      .then(response => Promise.resolve(response.data))
      .catch(response => Promise.reject(response.statusText));

    return Promise.all([
      promise.should.eventually.be.fulfilled,
      promise.should.eventually.be.an('object'),
      promise.should.eventually.have.all.keys('_id', 'title', 'type', 'description', 'compounds'),
    ]);
  });

  it('Should add a compound at /experiments/:id/compounds/add',
    function findOneExperiment() {
      const compound = {
        name: 'Test Compound',
      };
      const promise = axios
        .post(`${API_BASE_URL}/experiments/${tempExpId}/compounds/add`, compound)
        .then(response => Promise.resolve(response.data.compounds))
        .catch(response => Promise.reject(response.statusText));

      return Promise.all([
        promise.should.eventually.be.fulfilled,
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
  //       .post(`${API_BASE_URL}/experiments/${tempExpId}/compounds/add?index=${index}`, compound)
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
      .delete(`${API_BASE_URL}/experiments/${tempExpId}/remove`)
      .then(response => Promise.resolve(response.data))
      .catch(response => Promise.reject(response.statusText));

    return Promise.all([
      promise.should.eventually.be.fulfilled,
    ]);
  });
});
