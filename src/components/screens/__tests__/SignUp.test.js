import React from 'react';
import renderer from 'react-test-renderer';
import SignUp from '../SignUp';
import {shallow } from 'enzyme';
jest.mock('react-native-device-info');
jest.mock('../../../utils/StaticFunctions');

describe('SignUp Page Component',()=>{
  let wrapper ;
  beforeEach(()=>{
    wrapper = shallow(<SignUp/>);
  });
  describe('SignUp Page Component rendering',()=>{

    it('Check Signup render without break', () =>{
      const tree = renderer.create(<SignUp/>).toJSON();
      expect(tree).toBeTruthy();
    });

    it('SignUp Component should render ',()=>{
      const snap = renderer.create(<SignUp/>);
      expect(snap.toJSON()).toMatchSnapshot();
    });


    it('ImageBackground rendering',()=>{
      expect(wrapper.find('ImageBackground').length).toBe(1);
    });

    it('render backgroundimage path ',()=>{
      const image = {'testUri': '../../../src/assets/Images/background.jpeg'};
      expect(wrapper.find('ImageBackground').prop('source')).toEqual(image);
    });

    it('Image logo rendering',()=>{
      expect(wrapper.find('[testID="logo"]').length).toBe(1);
    });

    it('render 5 CustomTextInput',()=>{
      expect(wrapper.find('CustomTextInput').length).toBe(5);
    });

    it('render scrollview',()=>{
      expect(wrapper.find('ScrollView').length).toBe(1);
    });

    it('render 3 Text ',()=>{
      expect(wrapper.find('Text').length).toBe(3);
    });

    it('render one Button ',()=>{
      expect(wrapper.find('Button').length).toBe(1);
    });

    it('render email CustomTextInput',()=>{
      expect(wrapper.find('[testID="email_textInput"]').length).toBe(1);
    });

  });

  describe('Function of SignUp Component', () =>{
    it('should change the state on change the tittle from picker', () => {
      wrapper.find('[testID="titlePicker"]').props().onValueChange('miss');
      expect(wrapper.state('title')).toBe('miss');
    });

    it('should change the state on change in first Name text', () => {
      wrapper.find('[testID="firstName_textInput"]').props().onChangeText('abcd');
      expect(wrapper.state('firstName')).toBe('abcd');
    });

    it('should change the state on change in last Name text', () => {
      wrapper.find('[testID="lastName_textInput"]').props().onChangeText('Solution');
      expect(wrapper.state('lastName')).toBe('Solution');
    });

    it('should change the state on change in emailId', () => {
      wrapper.find('[testID="email_textInput"]').props().onChangeText('cdc@gmail.com');
      expect(wrapper.state('emailId')).toBe('cdc@gmail.com');
    });

    it('should change the state on change in password', () => {
      wrapper.find('[testID="password_textInput"]').props().onChangeText('cdc00000');
      expect(wrapper.state('password')).toBe('cdc00000');
    });

    it('should change the state on change in retype password', () => {
      wrapper.find('[testID="retypePassword_textInput"]').props().onChangeText('cdc00000');
      expect(wrapper.state('retypePassword')).toBe('cdc00000');
    });

    it('check navigate to login screen on press', () => {
      wrapper.find('[testID="Tologin_Text"]').props().onPress();
    });

  });
});
