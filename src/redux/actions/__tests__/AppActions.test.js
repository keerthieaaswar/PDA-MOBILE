
import * as actions from '../AppActions';
import * as types from '../Types';

describe('actions', () => {
  it('should create an action to internet connection true', () => {
    const isInternetConnectivityAvailable = true;
    const expectedAction = {
      type: types.HAS_INTERNET_CONNECTIVITY,
      isInternetConnectivityAvailable
    };
    expect(actions.saveInternetConnectivityStatus(isInternetConnectivityAvailable)).toEqual(expectedAction);
  });
});