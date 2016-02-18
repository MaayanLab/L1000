import * as EntityActionTypes from 'actions/entities';

const initPendingState = {
  isPending: false,
};

export default function (state = initPendingState, action) {
  switch (action.type) {
    case EntityActionTypes.COMPOUND_REQUEST:
    case EntityActionTypes.COMPOUNDS_REQUEST:
    case EntityActionTypes.EXPERIMENT_REQUEST:
    case EntityActionTypes.EXPERIMENTS_REQUEST:
    case EntityActionTypes.ADD_COMPOUND_REQUEST:
      return {
        ...state,
        isPending: true,
      };
    case EntityActionTypes.COMPOUND_SUCCESS:
    case EntityActionTypes.COMPOUNDS_SUCCESS:
    case EntityActionTypes.EXPERIMENT_SUCCESS:
    case EntityActionTypes.EXPERIMENTS_SUCCESS:
    case EntityActionTypes.ADD_COMPOUND_SUCCESS:
    case EntityActionTypes.COMPOUND_FAILURE:
    case EntityActionTypes.COMPOUNDS_FAILURE:
    case EntityActionTypes.EXPERIMENT_FAILURE:
    case EntityActionTypes.EXPERIMENTS_FAILURE:
    case EntityActionTypes.ADD_COMPOUND_FAILURE:
      return {
        ...state,
        isPending: false,
      };
    default:
      return state;
  }
}
