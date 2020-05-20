import React from 'react';
import renderer from 'react-test-renderer';
import {shallow } from 'enzyme';
import Info from '../../../session/info/Info';
jest.mock('react-native-device-info');

describe('Info Page Component',()=>{
  let wrapper ;
  beforeEach(()=>{
    wrapper = shallow(<Info/>);
  });
  describe('Info Page Component rendering',()=>{

    it('Check Info render without break', () =>{
      const tree = renderer.create(<Info/>).toJSON();
      expect(tree).toBeTruthy();
    });

    it('Info Component should render ',()=>{
      const snap = renderer.create(<Info/>);
      expect(snap.toJSON()).toMatchSnapshot();
    });

    it('render scrollView',()=>{
      expect(wrapper.find('ScrollView').length).toBe(1);
    });
  });
});