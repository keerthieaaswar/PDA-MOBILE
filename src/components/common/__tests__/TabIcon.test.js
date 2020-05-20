import React from 'react';
import renderer from 'react-test-renderer';
import TabIcon from '../TabIcon';
jest.mock('react-native-device-info');
describe('<TabIcon/>',()=>{
  it('TabIcon should render without crash',()=>{
    let snap = renderer.create(<TabIcon/>);
    expect(snap.toJSON()).toMatchSnapshot();
  });
});