import React from 'react';
import renderer from 'react-test-renderer';
import CustomTextInput from '../CustomTextInput';
jest.mock('react-native-device-info');
describe('<TextInput/>',()=>{
  beforeEach(()=>{
  });
  it('should render the component',()=>{
    const snap = renderer.create(<CustomTextInput/>);
    expect(snap.toJSON()).toMatchSnapshot();
  });
  it('function focus should call the TextInput to focus',()=>{
    // wrapper.instance().focus(); @TODO
  });
});