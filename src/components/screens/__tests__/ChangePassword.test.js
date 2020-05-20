import React from 'react';
import renderer from 'react-test-renderer';
import ChangePassword from '../ChangePassword';
import {shallow } from 'enzyme';
jest.mock('react-native-device-info');
jest.mock('../../../utils/StaticFunctions');

describe('SignUp Page Component',()=>{
  let wrapper ;
  beforeEach(()=>{
    wrapper = shallow(<ChangePassword/>);
  });
  describe('SignUp Page Component rendering',()=>{

    it('Check ChangePassword render without break', () =>{
      const tree = renderer.create(<ChangePassword/>).toJSON();
      expect(tree).toBeTruthy();
    });

    it('Change Password Component should render ',()=>{
      const snap = renderer.create(<ChangePassword/>);
      expect(snap.toJSON()).toMatchSnapshot();
    });

    it('render 3 CustomTextInput',()=>{
      expect(wrapper.find('CustomTextInput').length).toBe(3);
    });

    it('render one Button ',()=>{
      expect(wrapper.find('Button').length).toBe(1);
    });


  });

});