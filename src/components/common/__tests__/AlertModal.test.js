import React from 'react';
import renderer from 'react-test-renderer';
import AlertModal from '../AlertModal';
jest.mock('react-native-device-info');

describe('<AlertModal/>',()=>{
  it('AlertModal should render without crash',()=>{
    let snap = renderer.create(<AlertModal/>);
    expect(snap.toJSON()).toMatchSnapshot();
  });
});