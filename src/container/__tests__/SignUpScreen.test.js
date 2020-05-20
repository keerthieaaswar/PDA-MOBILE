import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import SignUpScreen from '../SignUpScreen';

const mockStore = configureMockStore();
const store = mockStore({appState:{
  isInternetConnectivityAvailable: true
}});
jest.mock('react-native-device-info', () => {
  return {
    hasNotch: () => false
  };
});

describe('SignUp Screen rendering',()=>{
  it('renders the SignUp screen ', async () => {
    const tree = renderer.create(
      <Provider store={store}>
        <SignUpScreen />
      </Provider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});