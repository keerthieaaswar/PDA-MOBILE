import React from 'react';
import renderer from 'react-test-renderer';
import Login from '../Login';
import {shallow } from 'enzyme';
import { TEXT } from '../../../constants/String';
jest.mock('../../../utils/StaticFunctions');
jest.mock('react-native-i18n');
jest.mock('react-native-device-info');
describe('Login Page Component',()=>{

  describe('Login Page Component rednering',()=>{

    let wrapper ;
    beforeEach(()=>{
      wrapper = shallow(<Login/>);
    });

    it('Login Component should render ',()=>{
      const snap = renderer.create(<Login/>);
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

    it('render two CustomTextInput rendering',()=>{
      expect(wrapper.find('CustomTextInput').length).toBe(2);
    });

    it('render email CustomTextInput rendering',()=>{
      expect(wrapper.find('[testID="email_textInput"]').length).toBe(1);
    });

    it('render email CustomTextInput props check',()=>{
      const ETextInput = wrapper.find('[testID="email_textInput"]');
      expect(ETextInput.prop('placeholder')).toBe(TEXT.EMAIL_ID);
      expect(ETextInput.prop('keyboardType')).toBe('email-address');
      expect(ETextInput.prop('keyboardType')).toBe('email-address');
    });

    it('loginClicked On Called as with email id and empty password',()=>{
      wrapper.find('[testID="email_textInput"]').props().onChangeText('cdcil');
      wrapper.find('[testID="password_textInput"]').props().onChangeText('dasa');
    });
  });
});
