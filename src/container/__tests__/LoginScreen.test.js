import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import LoginScreen from '../LoginScreen';

const mockStore = configureMockStore();
const store = mockStore({});
jest.mock('react-native-device-info', () => {
  return {
    hasNotch: () => false
  };
});

describe('Logscreen rendering',()=>{
  it('renders the Logscreen ', async () => {
    const tree = renderer.create(
      <Provider store={store}>
        <LoginScreen />
      </Provider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});