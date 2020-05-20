import React from 'react';
import renderer from 'react-test-renderer';
import NavigationRouter from '..';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

const mockStore = configureMockStore();
const store = mockStore({});
jest.mock('react-native-device-info', () => {
  return {
    hasNotch: () => false
  };
});

describe('NavigationRouter rendering',()=>{
  it('renders the NavigationRouter ', async () => {
    const tree = renderer.create(
      <Provider store={store}>
        <NavigationRouter />
      </Provider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});