import React from 'react';
import renderer from 'react-test-renderer';
import Button from '../Button';
jest.mock('react-native-device-info');

describe('<Button/>',()=>{
  it('Button should render without crash',()=>{
    let snap = renderer.create(<Button/>);
    expect(snap.toJSON()).toMatchSnapshot();
  });
});