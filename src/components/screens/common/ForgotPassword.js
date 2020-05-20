import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import { stringsConvertor } from '../../../utils/I18n';
import { verticalScale, TEXT_TYPE, pdaStyleSheet, deviceHeight } from '../../../theme/pdaStyleSheet';
import TextInput from '../../common/TextInput';
import Button from '../../common/Button';
import { Actions } from 'react-native-router-flux';
import { navigateToScreen, myLog, showErrorMessage } from '../../../utils/StaticFunctions';
import ButtonWithIcon from '../../common/ButtonWithIcon';
import RootView from '../../common/RootView';
import { COLORS } from '../../../constants/Color';
import ActionSheet from 'react-native-actionsheet';
import Ripple from '../../common/rippleEffect';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import CustomIcon from '../../common/CustomIcon';
import DeviceInfo from 'react-native-device-info';

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

class ForgotPassword extends Component {
  static propTypes = {
    isNetworkConnected : PropTypes.bool,
    resendOTP: PropTypes.func,
    countryCodeWithCountryList:PropTypes.object,
    countryCode:PropTypes.object,
    getCountryCodeList:PropTypes.func,
    countryList: PropTypes.object
  }

  static defaultProps = {
    isNetworkConnected: false,
    resendOTP: ()=>{}
  }


  constructor(props){
    super(props);
    this.state={
      phoneNumber: '',
      phoneError: '',
      isLoading: false,
      phoneNumberStatus:'',
      countryCode:'',
      countryCodeSelectIndex:0,
      PhoneNumberError: false
    };
    this.onGetOtpPress = this.onGetOtpPress.bind(this);
    this.onPressBack = this.onPressBack.bind(this);
    this.onChangeTextPhone = this.onChangeTextPhone.bind(this);
    this.onOpenActionSheet = this.onOpenActionSheet.bind(this);
    this.handleActionSheetPress= this.handleActionSheetPress.bind(this);
    this.props.getCountryCodeList();
  }
  onPressBack(){
    Actions.pop();
  }


  onChangeTextPhone(text) {
    this.setState({ phoneNumber: text.replace(/[^0-9,+]/g, '').toString(), phoneError:''});
  }

  onGetOtpPress(){
    const {
      phoneNumber
    } = this.state;
    const {
      resendOTP,
      isNetworkConnected,
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
    if (phoneNumber.length === 0) {
      this.setState({phoneError: stringsConvertor('validationMessage.phoneNumberProvide')
      });
      this.phone.focus();
      return;
    }
    if(phoneNumberSizeMin === '' && phoneNumberSizeMax === ''){
      showErrorMessage(stringsConvertor('validationMessage.500'));
      return;
    }
    if(phoneNumberSizeMin === phoneNumberSizeMax && phoneNumber.length !== phoneNumberSizeMin){
      this.setState({PhoneNumberError: true,phoneError: stringsConvertor('validationMessage.phoneNumberLength')+phoneNumberSizeMax+stringsConvertor('validationMessage.phoneNumberLength1')
      });
      this.phone.focus();
      return;
    }
    if(phoneNumber.length < phoneNumberSizeMin || phoneNumber.length >phoneNumberSizeMax) {
      this.setState({PhoneNumberError: true,phoneError: `Phone number should be in between ${phoneNumberSizeMin } - ${ phoneNumberSizeMax} digits.`});
      this.phone.focus();
      return;
    }
    if (isNetworkConnected) {
      this.setState({ isLoading: true }, () => {
        if (isNetworkConnected) {
          const typeOfOTP = 'ForgotPassword-OTP';
          resendOTP(countryCode, phoneNumber,typeOfOTP,(status, response) => {
            myLog('resendOTP', status, response);
            if (status === true) {
              navigateToScreen('OtpScreen', {typeOfOTP, phoneNumber,countryCode });
            } else {
              showErrorMessage(response);
            }
            this.setState({ isLoading: false });
          });
        }
      });
    }
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
    const {
      phoneNumber,
      PhoneNumberError,
      countryCodeSelectIndex,
      phoneError
    }=this.state;
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
            ref={(input) => this.phone = input}
            label={stringsConvertor('forgetPassword.phoneNumber')}
            value={phoneNumber}
            baseColor={COLORS.gray}
            tintColor={COLORS.tintColor}
            textColor ={COLORS.phoneNumberTextColor}
            onChangeText={this.onChangeTextPhone}
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
    const{
      isLoading
    }= this.state;
    return (
      <ScrollView style={{background:'white'}}>
        <View style={{position:'absolute', right: 10, top: Platform.OS==='ios'?30: 20}}>
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
            <View style={{marginVertical: verticalScale(56)}}>
              <View style={{marginTop: 20}}>
                <Image
                  testID = "logo"
                  source={require('../../../assets/Images/logo.png')}
                  style={{marginBottom:verticalScale(43)}}
                />
              </View>
              <Text style={[TEXT_TYPE.H10,{color:COLORS.appNameColor,marginBottom:verticalScale(62), marginTop: verticalScale(15)}]}>
                {stringsConvertor('forgetPassword.forgetText')}
              </Text>
            </View>
          </View>
          <View>
            {this.renderPhoneInputView()}
          </View>
          <View style={{flex:1, marginTop: verticalScale(185), justifyContent:'flex-end'}}>
            <Button
              name = {stringsConvertor('forgetPassword.getOtp')}
              onPress={this.onGetOtpPress}
              isLoading= {isLoading}
            />
          </View>
        </View>
        <View style={{display:'flex',alignItems:'flex-end', marginTop:10, marginRight:18}}>
          <Text style={{color:COLORS.gray, fontSize:verticalScale(13), fontFamily:'roboto'}}> V.{DeviceInfo.getVersion()} </Text>
        </View>
      </ScrollView>
    );
  }
}

export default ForgotPassword;