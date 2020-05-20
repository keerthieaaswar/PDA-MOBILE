/**
 * pda
 * Login.js
 * @author Socion Advisors LLP
 * @description Created on 27/02/2019
 * Copyright © 2019 pda. All rights reserved.
 */

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Platform,
  TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import { verticalScale, TEXT_TYPE, deviceWidth, deviceHeight } from '../../../theme/pdaStyleSheet';
import { stringsConvertor } from '../../../utils/I18n';
import Ripple from '../../common/rippleEffect';
import { navigateToScreen, showErrorMessage, myLog } from '../../../utils/StaticFunctions';
import TextInput from '../../common/TextInput';
import Button from '../../common/Button';
import AesUtil from '../../../utils/AesUtil';
import RootView from '../../common/RootView';
import { COLORS } from '../../../constants/Color';
import DeviceInfo from 'react-native-device-info';
import ActionSheet from 'react-native-actionsheet';
import AndroidBackHandler from '../../common/AndroidBackHandler';
import CustomIcon from '../../common/CustomIcon';

const styles = StyleSheet.create({
  selectorIcon:{
    paddingLeft: verticalScale(10),
    color: '#8a8e93',
    paddingBottom:8
  },
  pickerView:{
    borderBottomWidth: verticalScale(0.40),
    borderBottomColor: COLORS.gray,
    flexDirection: 'row',
    alignItems: 'center'
  }
});
let aesUtil = new AesUtil();
class Login extends Component {

  static propTypes = {
    isNetworkConnected : PropTypes.bool,
    userSignIn: PropTypes.func,
    countryCodeWithCountryList:PropTypes.object,
    countryCode:PropTypes.object,
    getCountryCodeList:PropTypes.func,
    countryList:PropTypes.object,
    name: PropTypes.string
  }

  static defaultProps = {
    isNetworkConnected: false,
    userSignIn: ()=>{},
    name: ''
  }
  constructor(props){
    super(props);
    this.state = {
      phone: '',
      password: '',
      phoneError: '',
      passwordError: '',
      isLoading: false,
      countryCode:'+',
      countryCodeSelectIndex:0,
      PhoneNumberError: false
    };
    this.navigateToSignUp = this.navigateToSignUp.bind(this);
    this.navigateToForgotPassword = this.navigateToForgotPassword.bind(this);
    this.navigateToDashBoard = this.navigateToDashBoard.bind(this);
    this.onSignInPress = this.onSignInPress.bind(this);
    this.onChangeTextPhone = this.onChangeTextPhone.bind(this);
    this.onChangeTextPassword = this.onChangeTextPassword.bind(this);
    this.onOpenActionSheet = this.onOpenActionSheet.bind(this);
    this.handleActionSheetPress= this.handleActionSheetPress.bind(this);
    this.props.getCountryCodeList();
  }


  onChangeTextPhone(text) {
    this.setState({ phone: text.replace(/[^0-9,+]/g, '').toString(), phoneError:''});
  }
  onChangeTextPassword(text){
    this.setState({ password: text, passwordError:'' });
  }
  onSignInPress(){
    const {
      phone,
      password
    } = this.state;
    const {
      isNetworkConnected,
      userSignIn,
      countryCodeWithCountryList
    } = this.props;
    let countryCode = '';
    let phoneNumberLength = '';
    let phoneNumberSizeMin = '';
    let phoneNumberSizeMax = '';
    if (countryCodeWithCountryList.length !== 0) {
      countryCode = countryCodeWithCountryList[this.state.countryCodeSelectIndex].code;
      phoneNumberLength = countryCodeWithCountryList[this.state.countryCodeSelectIndex].phoneNumberLength;
      phoneNumberSizeMin = countryCodeWithCountryList[this.state.countryCodeSelectIndex].phoneNumberSizeMin;
      phoneNumberSizeMax = countryCodeWithCountryList[this.state.countryCodeSelectIndex].phoneNumberSizeMax;
    }
    if (phone.length === 0) {
      this.setState({phoneError: stringsConvertor('validationMessage.phoneNumberProvide')
      });
      this.phone.focus();
      return;
    }

    if(phoneNumberSizeMin === '' && phoneNumberSizeMax === ''){
      showErrorMessage(stringsConvertor('validationMessage.500'));
      return;
    }
    if(phoneNumberSizeMin === phoneNumberSizeMax && phone.length !== phoneNumberSizeMin){
      this.setState({PhoneNumberError: true,phoneError: stringsConvertor('validationMessage.phoneNumberLength')+phoneNumberSizeMax+stringsConvertor('validationMessage.phoneNumberLength1')
      });
      this.phone.focus();
      return;
    }
    if(phone.length < phoneNumberSizeMin || phone.length >phoneNumberSizeMax) {
      this.setState({PhoneNumberError: true,phoneError: `Phone number should be in between ${phoneNumberSizeMin } - ${ phoneNumberSizeMax} digits.`});
      this.phone.focus();
      return;
    }
    if (password.length === 0) {
      this.setState({passwordError: stringsConvertor('validationMessage.passwordProvide')
      });
      this.password.focus();
      return;
    }
    if (isNetworkConnected) {
      const params = {
        password: aesUtil.encrypt(password),
        userName: phone,
        countryCode
      };
      this.setState({isLoading: true}, ()=>{
        userSignIn(params, (status, response)=>{
          if (status === true) {
            myLog('myResponse',response.response);
            this.navigateToDashBoard(response);
          }else{
            showErrorMessage(response);
          }
          this.setState({isLoading: false});
        });
      });
    }
  }
  clearData(){
    this.setState({
      password: '',
      phone:''
    });
  }
  navigateToDashBoard(){
    navigateToScreen('DashboardScreen');
    this.clearData();
  }
  navigateToSignUp(){
    navigateToScreen('SignUpScreen');
    this.clearData();
  }
  navigateToForgotPassword(){
    navigateToScreen('ForgotPasswordScreen');
    this.clearData();
  }
  onOpenActionSheet(){
    const {
      countryList
    } = this.props;
    if(countryList.length > 0){
      this.ActionSheet.show();
    }
    else{
      showErrorMessage(stringsConvertor('validationMessage.500'));
    }
  }
  handleActionSheetPress(itemIndex){
    this.setState({ countryCodeSelectIndex: itemIndex,PhoneNumberError:false});
  }
  renderActionSheet(countryCode){
    const {
      countryList
    } = this.props;
    return(
      <ActionSheet
        ref={(o) => this.ActionSheet = o}
        options={countryList}
        tintColor = {COLORS.fontColor}
        title={'Select Country Code'}
        onPress={this.handleActionSheetPress}
        destructiveButtonIndex={countryCode}
      />
    );
  }
  renderPhoneInputView(){
    const{
      phone,
      phoneError,
      countryCodeSelectIndex,
      PhoneNumberError
    } =this.state;
    const {
      countryCodeWithCountryList
    } = this.props;
    let countryCode = '+91';
    if (countryCodeWithCountryList.length !== 0) {
      countryCode = countryCodeWithCountryList[this.state.countryCodeSelectIndex].code;
    }
    return(
      <View style={{flexDirection:'row'}}>
        <View style={{flex:0.23}}>
          <Ripple style = {[styles.pickerView, {marginTop:Platform.OS === 'ios'?38: deviceHeight >  850 ? verticalScale(22) : deviceHeight > 790 ?
            verticalScale(26) :deviceHeight >700 ? verticalScale(30) : deviceHeight > 610 ? verticalScale(36)
              :deviceHeight > 570 ? verticalScale(44) :verticalScale(50)}]}onPress={this.onOpenActionSheet}
          >
            <View style={{flex:0.6, alignItems:'center'}}>
              <Text style={{color:COLORS.gray,paddingBottom:8,fontSize:15}} >
                {countryCode}
              </Text>
            </View>
            <TouchableOpacity style={{flex:0.4}}>
              <CustomIcon
                style ={styles.selectorIcon}
                name= "arrow-down-head"
                size = {verticalScale(8)}
              />
            </TouchableOpacity>

          </Ripple>
        </View>
        <View style={{flex:0.79,marginLeft:verticalScale(15)}}>
          <TextInput
            ref={(input) => this.phone = input}
            label= {stringsConvertor('signUp.phoneNumber')}
            value={phone}
            baseColor={COLORS.gray}
            tintColor={COLORS.tintColor}
            textColor ={COLORS.phoneNumberTextColor}
            onChangeText={this.onChangeTextPhone}
            error={PhoneNumberError}
            onSubmitEditing={this.onSignUpPress}
            keyboardType="numeric"
          />
          {PhoneNumberError? <View style={{marginTop:-22}}>
            <Text style={{fontSize:12, color:'#d61818'}}>{phoneError}</Text>
          </View>: null}
        </View>
        {this.renderActionSheet(countryCodeSelectIndex)}
      </View>

    );
  }
  render() {
    const{
      password,
      passwordError,
      isLoading
    } = this.state;
    const {
      name
    } = this.props;
    return (
      <ScrollView style={{backgroundColor:COLORS.white}}>
        <RootView style={{flex:1,backgroundColor: COLORS.white}} pointerEvents = {isLoading ? 'none':null}>
          <View style={{margin:verticalScale(23)}}>
            <View style={{marginVertical: 20}}>
              <View style={{marginHorizontal: verticalScale(-16)}}>
                <Image
                  testID = "logo"
                  source={require('../../../assets/Images/logo.png')}
                  style={{marginVertical:verticalScale(15),marginHorizontal:verticalScale(17)}}
                />
              </View>
              <Text style={[TEXT_TYPE.H9, { color: COLORS.appNameColor, marginTop: verticalScale(40) }]}>
                {stringsConvertor('signIn.gladToSeeYou')}
              </Text>
            </View>
            <View>
              {this.renderPhoneInputView()}
              <TextInput
                ref={(input) => this.password = input}
                label={stringsConvertor('signIn.enterPassword')}
                baseColor={COLORS.gray}
                tintColor={COLORS.tintColor}
                textColor ={COLORS.textColor}
                value={password}
                secureTextEntry = {true}
                onChangeText={this.onChangeTextPassword}
                error={passwordError}
                onSubmitEditing={this.onSignInPress}
                rightViewType={'password'}
              />
            </View>
            <Ripple rippleContainerBorderRadius={verticalScale(50)} onPress={this.navigateToForgotPassword} style={{alignSelf: 'flex-end', margin:verticalScale(10)}}>
              <Text style={[TEXT_TYPE.H1, {color:COLORS.forgetPasswordColor}]}>{stringsConvertor('signIn.forgotPassword')}</Text>
            </Ripple>
            <View style={{marginTop:verticalScale(125)}}>
              <Button
                containerStyle={{width: deviceWidth - 30}}
                name = {stringsConvertor('signIn.login')}
                onPress={this.onSignInPress}
                isLoading = {isLoading}
              />
            </View>
            <View style={{alignItems:'center', flexDirection:'row',justifyContent:'center', marginVertical: verticalScale(20)}}>
              <Text style={TEXT_TYPE.H1}>{stringsConvertor('signIn.newUser')}</Text>
              <Ripple
                onPress={this.navigateToSignUp}
              >
                <Text
                  testID="To_login_Text" style={[TEXT_TYPE.H1, {color:COLORS.forgetPasswordColor}]}
                > {stringsConvertor('signIn.signup')}</Text>
              </Ripple>
            </View>
            <View style={{display:'flex',alignItems:'flex-end'}}>
              <Text style={{color:COLORS.gray, fontSize:verticalScale(13), fontFamily:'roboto'}}> V.{DeviceInfo.getVersion()} </Text>
            </View>
          </View>
          <AndroidBackHandler screen={name}/>
        </RootView>
      </ScrollView>
    );
  }
}

export default Login;