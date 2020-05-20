
import * as reducer from '../AppReducer';
import * as types from '../../actions/Types';
describe('todos reducer', () => {
  let initialState = reducer.initialState;
  it('should return the initial state', () => {
    expect(reducer.AppReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle ADD_TODO', () => {
    initialState.isInternetConnectivityAvailable = false;
    expect(
      reducer.AppReducer([], {
        type: types.HAS_INTERNET_CONNECTIVITY,
        isInternetConnectivityAvailable: false
      })
    ).toEqual(initialState);

  });
});