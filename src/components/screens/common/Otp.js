import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, Alert,Platform} from 'react-native';
import PropTypes from 'prop-types';
import OtpInputs from 'react-native-otp-inputs';
import { verticalScale, TEXT_TYPE, FONT_FAMILY, horizontalScale } from '../../../theme/pdaStyleSheet';
import Ripple from '../../common/rippleEffect';
import { stringsConvertor } from '../../../utils/I18n';
import Button from '../../common/Button';
import { COLORS } from '../../../constants/Color';
import { Actions } from 'react-native-router-flux';
import { navigateToScreen, myLog, showErrorMessage } from '../../../utils/StaticFunctions';
import ButtonWithIcon from '../../common/ButtonWithIcon';
import AesUtil from '../../../utils/AesUtil';
import RootView from '../../common/RootView';

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: 'white'
  },
  buttonStyle:{
    width : horizontalScale(310),
    paddingVertical: verticalScale(15),
    borderRadius:verticalScale(6)
  }
});

let aesUtil = new AesUtil();
export default class App extends Component {

  static propTypes = {
    isNetworkConnected : PropTypes.bool,
    resendOTP: PropTypes.func,
    phoneNumber: PropTypes.string,
    nameOfUser: PropTypes.string,
    typeOfOTP: PropTypes.string,
    validateOTP: PropTypes.func,
    newPhoneNumber: PropTypes.string,
    changeSuccess: PropTypes.bool,
    verifyNewPhoneNumberOTP: PropTypes.func,
    userData: PropTypes.object,
    userSignOut: PropTypes.func,
    countryCode: PropTypes.string,
    userSignUp: PropTypes.func
  }

  static defaultProps = {
    isNetworkConnected: false,
    resendOTP: ()=>{},
    validateOTP: ()=>{},
    phoneNumber:'',
    typeOfOTP:'',
    nameOfUser:'',
    newPhoneNumber:'',
    countryCode:'+91',
    changeSuccess: true,
    verifyNewPhoneNumberOTP:()=>{},
    userData: {},
    userSignOut: ()=>{},
    userSignUp: ()=>{}
  }

  constructor(props){
    super(props);
    this.state = {
      otp :'',
      isLoading: false
    };
    this.onPressBack = this.onPressBack.bind(this);
    this.onValidateOTPPress = this.onValidateOTPPress.bind(this);
    this.onResendPress = this.onResendPress.bind(this);
    this.onChangeOTP = this.onChangeOTP.bind(this);
  }

  onChangeOTP(otpCode) {
    this.setState({
      otp: otpCode
    });
  }

  onResendPress(){
    const {
      resendOTP,
      isNetworkConnected,
      phoneNumber,
      typeOfOTP,
      countryCode,
      newPhoneNumber,
      changeSuccess,
      verifyNewPhoneNumberOTP
    } = this.props;
    if (isNetworkConnected) {
      this.setState({isLoading: true},()=>{
        if(!changeSuccess){
          const phoneNumber = newPhoneNumber;
          verifyNewPhoneNumberOTP(phoneNumber, typeOfOTP,countryCode, (status, response)=>{
            if(status === true){
              Alert.alert('',stringsConvertor('otp.otpSendSuccess'),
                [
                  {
                    text: stringsConvertor('alert.ok'),
                    onPress: () => ('')
                  }
                ],
                {cancelable: true},
              );
            }
            myLog('resendOTP', status, response);
            this.setState({isLoading: false});
          });
        }
        else if(typeOfOTP === 'Registration-OTP'){
          const {
            nameOfUser,
            userSignUp
          } =this.props;
          const params = {
            name: nameOfUser,
            phoneNumber,
            countryCode
          };
          userSignUp(params, (status, response)=>{
            if(status === true){
              Alert.alert('',stringsConvertor('otp.otpSendSuccess'),
                [
                  {
                    text: stringsConvertor('alert.ok'),
                    onPress: () => ('')
                  }
                ],
                {cancelable: true},
              );
            }
            this.setState({isLoading: false});
          });
        }
        else  resendOTP(countryCode,phoneNumber,typeOfOTP, (status, response)=>{
          if(status === true){
            Alert.alert('',stringsConvertor('otp.otpSendSuccess'),
              [
                {
                  text: stringsConvertor('alert.ok'),
                  onPress: () => ('')
                }
              ],
              {cancelable: true},
            );
          }
          myLog('resendOTP', status, response);
          this.setState({isLoading: false});
        });
      });
    }
  }
  onPressBack(){
    Actions.pop();
  }

  invokeUserSignOut(){
    const {
      userId
    } = this.props.userData;
    this.setState({isLoading:true},()=>{
      this.props.userSignOut(userId ,(status, message) => {
        myLog('status, message', status, message);
        if (status) {
          Actions.replace('LoginScreen');
        }else {
          showErrorMessage(message);
        }
        this.setState({isLoading:false});
      });
    });
  }
  onValidateOTPPress(){
    const {
      validateOTP,
      isNetworkConnected,
      phoneNumber,
      nameOfUser,
      typeOfOTP,
      countryCode
    } = this.props;
    const {
      otp
    } = this.state;
    if (isNetworkConnected) {
      if (otp.length === 0) {
        showErrorMessage(stringsConvertor('otp.enterOtp'));
        return;
      }
      if (otp.length < 6) {
        showErrorMessage(stringsConvertor('otp.invalidOtp'));
        return;
      }
      const data = {
        otp: aesUtil.encrypt(otp),
        typeOfOTP,
        phoneNumber,
        countryCode
      };
      this.setState({isLoading: true},()=>{
        validateOTP(data, (status, response)=>{
          if (status === true) {
            if(typeOfOTP === 'Registration-OTP'){
              navigateToScreen('SignUpPasswordScreen', { phoneNumber, nameOfUser,countryCode});
            }
            else if(typeOfOTP === 'ForgotPassword-OTP'){
              navigateToScreen('ResetPasswordScreen', { phoneNumber,countryCode});
            }
            else if(typeOfOTP === 'UpdatePhone-OTP'){
              navigateToScreen('PhoneNumberUpdateScreen', {isEmailOTPVerified:true,countryCode});
            }
            else if(typeOfOTP === 'NewPhone-OTP'){
              this.invokeUserSignOut();
            }
            else if(typeOfOTP === 'UpdateEmail-OTP'){
              navigateToScreen('EmailUpdateScreen');
            }
          }else{
            showErrorMessage(response);
          }
          this.setState({isLoading: false});
        });
      });
    }
  }
  render() {
    const {
      isLoading
    } = this.state;
    const {typeOfOTP} = this.props;
    return (
      <RootView style={styles.container} pointerEvents = {isLoading ? 'none':null}>
        <View style={{right: 10, top: Platform.OS==='ios'?30: 20, display:'flex', flexDirection:'row-reverse',alignItems:'flex-end'}}>
          <ButtonWithIcon
            iconSize={verticalScale(20)}
            iconName="left-arrow"
            isLight={true}
            iconColor={COLORS.grayLight}
            onPress={this.onPressBack}
          /></View>
        <View>
          <View style={{flexDirection:'row',justifyContent : 'space-between'}}>
            <View style={{marginVertical: verticalScale(56)}}/>
          </View>
          <View style={{alignItems: 'center',justifyContent:'center'}}>
            <Image
              style={{width:verticalScale(85), height:verticalScale(105) }}
              source={require('../../../assets/Images/otp.png')}
            />
            <Text style={[TEXT_TYPE.H4,{marginTop:verticalScale(20),marginBottom:verticalScale(5), fontFamily: FONT_FAMILY.BOLD}]}>{stringsConvertor('otp.enterOtp')}</Text>
            <Text style={[TEXT_TYPE.H2,{marginHorizontal:verticalScale(35), alignItems:'center',justifyContent:'center'}]}>
              {typeOfOTP === 'UpdatePhone-OTP' ? stringsConvertor('otp.otpTextFromEmail') : stringsConvertor('otp.otpTextForget')}</Text>
            <Text style={[TEXT_TYPE.H2,{marginHorizontal:verticalScale(35), alignItems:'center',justifyContent:'center',marginBottom:verticalScale(25)}]}>{stringsConvertor('otp.otpTextForget2')}</Text>
          </View>
          <View style={{marginVertical:verticalScale(20)}}>
            <OtpInputs
              numberOfInputs={6}
              keyboardType="numeric"
              handleChange={this.onChangeOTP}
              unfocusedBorderColor={COLORS.bottomBorder}
            />
          </View>
          <View style={{flexDirection:'row', marginTop:verticalScale(25),marginLeft:10}}>
            <Text style={[TEXT_TYPE.H1]}> {typeOfOTP === 'UpdatePhone-OTP' ? stringsConvertor('otp.otpNotReceiveEmail') : stringsConvertor('otp.otpNotReceive')}</Text>
            <Ripple onPress={this.onResendPress}>
              <Text style={[TEXT_TYPE.H1,{color:COLORS.forgetPasswordColor}]}> {stringsConvertor('otp.resendOtp')}</Text>
            </Ripple>
          </View>
          <View style={{alignItems:'center', paddingTop: verticalScale(80),justifyContent:'center'}}>
            <Button
              name={typeOfOTP === 'Registration-OTP' ? stringsConvertor('otp.otpVerify'): typeOfOTP === 'UpdatePhone-OTP' ? stringsConvertor('otp.next'): stringsConvertor('otp.submit')}
              containerStyle={styles.buttonStyle}
              onPress={this.onValidateOTPPress}
              isLoading={isLoading}
            />
          </View>
        </View>
      </RootView>
    );
  }
}
