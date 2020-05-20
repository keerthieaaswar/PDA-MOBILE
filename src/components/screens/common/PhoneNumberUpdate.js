/**
 * pda
 * PhoneNumberUpdate.js
 * @author Socion Advisors LLP
 * @description Created on 30/07/2019
 * Copyright © 2019 pda. All rights reserved.
 */

import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  Platform,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import TextInput from '../../common/TextInput';
import { COLORS } from '../../../constants/Color';
import { stringsConvertor } from '../../../utils/I18n';
import AesUtil from '../../../utils/AesUtil';
import { verticalScale, pdaStyleSheet, TEXT_TYPE, deviceHeight } from '../../../theme/pdaStyleSheet';
import RootView from '../../common/RootView';
import ButtonWithIcon from '../../common/ButtonWithIcon';
import { Actions } from 'react-native-router-flux';
import Button from '../../common/Button';
import { navigateToScreen, myLog, showErrorMessage } from '../../../utils/StaticFunctions';
import PropTypes from 'prop-types';
import Ripple from '../../common/rippleEffect';
import ActionSheet from 'react-native-actionsheet';
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
class PhoneNumberUpdate extends Component {
    static propTypes = {
      isNetworkConnected:PropTypes.bool,
      isEmailOTPVerified:PropTypes.bool,
      verifyNewPhoneNumberOTP:PropTypes.func,
      phoneNumber:PropTypes.string,
      userSignIn:PropTypes.func,
      getCountryCodeList:PropTypes.func,
      countryCode:PropTypes.object,
      countryCodeWithCountryList:PropTypes.object,
      userData: PropTypes.object,
      countryList: PropTypes.object
    }
      static defaultProps = {
        isNetworkConnected:true,
        isEmailOTPVerified:false,
        verifyNewPhoneNumberOTP:()=>{},
        phoneNumber:'',
        userSignIn:()=>{},
        userData:{}
      };

      constructor(props){
        super(props);
        this.state={
          currentPassword:'',
          currentPasswordError:'',
          isLoading: false,
          isCurrentPassVerified: false,
          newPhoneNumber: '',
          phoneError:'',
          phoneNumberStatus:'',
          countryCode:'',
          countryCodeSelectIndex:0,
          PhoneNumberError: false
        };

        this.onPressBack = this.onPressBack.bind(this);
        this.onChangeTextCurrentPassword = this.onChangeTextCurrentPassword.bind(this);
        this.onPasswordSubmitPress = this.onPasswordSubmitPress.bind(this);
        this.onChangeTextPhoneNumber = this.onChangeTextPhoneNumber.bind(this);
        this.onGetOtpPress = this.onGetOtpPress.bind(this);
        this.onOpenActionSheet = this.onOpenActionSheet.bind(this);
        this.handleActionSheetPress= this.handleActionSheetPress.bind(this);
        this.props.getCountryCodeList();

      }

      onChangeTextCurrentPassword(text) {
        this.setState({ currentPassword: text, currentPasswordError: ''});
      }
      onPasswordSubmitPress(){
        const {
          currentPassword
        } = this.state;
        const {
          isNetworkConnected,
          phoneNumber,
          userSignIn,
          countryCode
        } = this.props;
        if (currentPassword.length === 0) {
          this.setState({currentPasswordError: stringsConvertor('validationMessage.passwordIsRequired')
          });
          this.currentPassword.focus();
          return;
        }

        if (isNetworkConnected) {
          const params = {
            password: aesUtil.encrypt(currentPassword),
            userName: phoneNumber,
            countryCode
          };
          this.setState({isLoading: true}, ()=>{
            userSignIn(params, (status, response)=>{
              if (status === true) {
                this.setState({isCurrentPassVerified: true});
              }else{
                showErrorMessage(response);
              }
              this.setState({isLoading: false});
            });
          });
        }

      }

      onChangeTextPhoneNumber(text) {
        this.setState({ newPhoneNumber: text.replace(/[^0-9,+]/g, '').toString(), phoneError: ''});
      }
      onGetOtpPress(){
        const {
          newPhoneNumber
        } = this.state;
        const {
          isNetworkConnected,
          verifyNewPhoneNumberOTP,
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
        if (newPhoneNumber.length === 0) {
          this.setState({phoneError: stringsConvertor('validationMessage.phoneNumberProvide')
          });
          this.phone.focus();
          return;
        }
        if(phoneNumberSizeMin === '' && phoneNumberSizeMax === ''){
          showErrorMessage(stringsConvertor('validationMessage.500'));
          return;
        }
        if(phoneNumberSizeMin === phoneNumberSizeMax && newPhoneNumber.length !== phoneNumberSizeMin){
          this.setState({PhoneNumberError: true,phoneError: stringsConvertor('validationMessage.phoneNumberLength')+phoneNumberSizeMax+stringsConvertor('validationMessage.phoneNumberLength1')
          });
          this.phone.focus();
          return;
        }
        if(newPhoneNumber.length < phoneNumberSizeMin || newPhoneNumber.length >phoneNumberSizeMax) {
          this.setState({PhoneNumberError: true,phoneError: `Phone number should be in between ${phoneNumberSizeMin } - ${ phoneNumberSizeMax} digits.`});
          this.phone.focus();
          return;
        }
        if (isNetworkConnected) {
          this.setState({ isLoading: true }, () => {
            if (isNetworkConnected) {
              const typeOfOTP = 'NewPhone-OTP';
              const phoneNumber = newPhoneNumber;
              verifyNewPhoneNumberOTP(phoneNumber, typeOfOTP,countryCode, (status, response) => {
                myLog('verifyNewPhoneNumberOTP=====',phoneNumber, status, response);
                if (status === true) {
                  const{
                    userName
                  } = this.props.userData;
                  const phoneNumber = userName;
                  const changeSuccess =false;
                  myLog('verifyNewPhoneNumberOTP=====',phoneNumber);
                  navigateToScreen('OtpScreen', {typeOfOTP, phoneNumber,newPhoneNumber,countryCode,changeSuccess });
                } else {
                  showErrorMessage(response);
                }
                this.setState({ isLoading: false });
              });
            }
          });
        }
      }

      onPressBack(){
        Actions.pop();
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
          newPhoneNumber,
          phoneError,
          countryCodeSelectIndex,
          PhoneNumberError
        } =this.state;
        const {
          countryCodeWithCountryList
        } = this.props;
        let countryCode = '';
        if (countryCodeWithCountryList.length !== 0) {
          countryCode = countryCodeWithCountryList[this.state.countryCodeSelectIndex].code;
        }
        return(
          <View style={{flexDirection:'row'}}>
            <View style={{flex:0.25}}>
              <Ripple style = {[styles.pickerView, {marginRight:verticalScale(10),marginTop:Platform.OS === 'ios'?38:deviceHeight >  850 ? verticalScale(22)
                : deviceHeight > 790 ? verticalScale(26) :deviceHeight >700 ? verticalScale(30) : deviceHeight > 610 ? verticalScale(36)
                  :deviceHeight > 570 ? verticalScale(44) :verticalScale(50)}]}
              onPress={this.onOpenActionSheet}
              >
                <View  style={{flex:0.6, alignItems:'center'}}>
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
            <View style={{flex:0.75}}>
              <TextInput
                ref= {(input) => this.phone = input}
                label={stringsConvertor('phoneNumberUpdate.enterNewPhoneNumber')}
                baseColor={COLORS.gray}
                tintColor={COLORS.tintColor}
                textColor ={COLORS.textColor}
                value={newPhoneNumber}
                onChangeText={this.onChangeTextPhoneNumber}
                error={PhoneNumberError}
                onSubmitEditing={this.onGetOtpPress}
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
        const {
          currentPassword,
          currentPasswordError,
          isLoading,
          isCurrentPassVerified

        } = this.state;
        const {
          isEmailOTPVerified
        } = this.props;
        return (
          <RootView style={{flex:1, paddingTop: pdaStyleSheet.toolbarPaddingTop}} pointerEvents = {isLoading ? 'none':null}>
            <ScrollView>
              <View style={{position:'absolute', right: 10, top: Platform.OS === 'ios'? 30: 20}}>
                <ButtonWithIcon
                  iconSize={verticalScale(20)}
                  iconName="left-arrow"
                  isLight={true}
                  iconColor={COLORS.grayLight}
                  onPress={this.onPressBack}
                />
              </View>
              <View style={{marginHorizontal:verticalScale(23), flex:1}}>
                <View style={{flexDirection:'row',justifyContent : 'space-between'}}>
                  <View style={{marginVertical: 20}}>
                    <View style={{marginHorizontal: verticalScale(-16)}}>
                      <Image
                        testID = "logo"
                        source={require('../../../assets/Images/logo.png')}
                        style={{marginTop:verticalScale(40),marginBottom:verticalScale(30),marginHorizontal:verticalScale(17)}}
                      />
                    </View>
                    <Text style={[TEXT_TYPE.H9,{color:COLORS.appNameColor,marginBottom:verticalScale(55)}]}>
                      {isCurrentPassVerified || isEmailOTPVerified ? stringsConvertor('phoneNumberUpdate.addNewNumber') : stringsConvertor('phoneNumberUpdate.typeYourPass')}
                    </Text>
                  </View>
                </View>
                <View>
                  {
                    !isCurrentPassVerified && !isEmailOTPVerified ?
                      <View>
                        <TextInput
                          ref= {(input) => this.currentPassword = input}
                          label={stringsConvertor('phoneNumberUpdate.enterCurrentPass')}
                          baseColor={COLORS.gray}
                          tintColor={COLORS.tintColor}
                          textColor ={COLORS.textColor}
                          value={currentPassword}
                          secureTextEntry = {true}
                          onChangeText={this.onChangeTextCurrentPassword}
                          error={currentPasswordError}
                          onSubmitEditing={this.onPasswordSubmitPress}
                          rightViewType={'password'}
                        />
                      </View>
                      :<View>
                        {this.renderPhoneInputView()}
                      </View>
                  }

                </View>
                <View style={{flex:1, justifyContent:'flex-end', marginBottom: verticalScale(70), marginTop:verticalScale(200)}}>
                  <Button
                    name = {isCurrentPassVerified || isEmailOTPVerified ? stringsConvertor('phoneNumberUpdate.getOtp') : stringsConvertor('phoneNumberUpdate.changeMobileNumber')}
                    onPress={isCurrentPassVerified || isEmailOTPVerified ? this.onGetOtpPress : this.onPasswordSubmitPress}
                    isLoading= {isLoading}
                  />
                </View>
              </View>
            </ScrollView>
          </RootView>
        );
      }
}

export default PhoneNumberUpdate;