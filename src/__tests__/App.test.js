import React from 'react';
import renderer from 'react-test-renderer';
import App from '..';


jest.mock('react-native-device-info');

describe('App Compontent',()=>{
  it('redner app compontent',()=>{
    const snap = renderer.create(<App/>);
    expect(snap.toJSON()).toMatchSnapshot();
  });
});