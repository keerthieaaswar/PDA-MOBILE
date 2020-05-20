/**
 * pda
 * signUp.js
 * @author Socion Advisors LLP
 * @description Created on 07/06/2019
 * Copyright © 2019 pda. All rights reserved.
 */
import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  ScrollView,
  TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import { verticalScale, TEXT_TYPE, FONT_FAMILY, pdaStyleSheet, horizontalScale, deviceHeight } from '../../../theme/pdaStyleSheet';
import { COLORS } from '../../../constants/Color';
import Button from '../../common/Button';
import { Actions } from 'react-native-router-flux';
import { navigateToScreen, myLog, showErrorMessage, validateText, validateSpecialChar } from '../../../utils/StaticFunctions';
import ButtonWithIcon from '../../common/ButtonWithIcon';
import TextInput from '../../common/TextInput';
import { stringsConvertor } from '../../../utils/I18n';
import ActionSheet from 'react-native-actionsheet';
import Ripple from '../../common/rippleEffect';
import CustomIcon from '../../common/CustomIcon';
import DeviceInfo from 'react-native-device-info';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: pdaStyleSheet.toolbarPaddingTop
  },
  buttonStyle:{
    width : horizontalScale(310),
    paddingVertical: verticalScale(15),
    borderRadius:verticalScale(6)
  },
  buttonText:{
    color:COLORS.white,
    fontFamily: FONT_FAMILY.BOLD,
    paddingHorizontal:verticalScale(40)
  },
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

class SignUp extends Component {
  static propTypes = {
    isNetworkConnected : PropTypes.bool,
    userSignUp: PropTypes.func,
    getCountryCodeLis: PropTypes.func,
    countryCodeWithCountryList:PropTypes.object,
    countryCode:PropTypes.object,
    getCountryCodeList:PropTypes.object,
    countryList: PropTypes.object
  }

static defaultProps = {
  isNetworkConnected: false,
  userSignUp: ()=>{}
}

constructor(props) {
  super(props);
  this.state = {
    isLoading: false,
    name:'',
    phone:'',
    nameError:'',
    phoneError:'',
    countryCode:'',
    countryCodeSelectIndex:0,
    PhoneNumberError: false
  };
  this.onPressBack =this.onPressBack.bind(this);
  this.onSignUpPress = this.onSignUpPress.bind(this);
  this.onChangeTextName = this.onChangeTextName.bind(this);
  this.onChangeTextPhone = this.onChangeTextPhone.bind(this);
  this.onOpenActionSheet = this.onOpenActionSheet.bind(this);
  this.handleActionSheetPress= this.handleActionSheetPress.bind(this);
  this.props.getCountryCodeList();
}
updateRef(name, ref) {
  this[name] = ref;
}
onPressBack(){
  Actions.pop();
}

onChangeTextName(text) {
  this.setState({ name: text, nameError:'' });
}

onChangeTextPhone(text) {
  this.setState({ phone: text.replace(/[^0-9,+]/g, '').toString(), phoneError:''});
}
onSignUpPress(){
  const {
    name,
    phone
  } = this.state;
  const {
    userSignUp,
    isNetworkConnected,
    countryCodeWithCountryList
  } = this.props;
  if (name.length === 0 || !validateText(name)) {
    this.setState({name:'',nameError: stringsConvertor('validationMessage.nameIsRequired')
    });
    this.name.focus();
    return;
  }
  if(validateSpecialChar(name)){
    this.setState({nameError:stringsConvertor('validationMessage.validNameIsRequired')});
    this.name.focus();
    return;
  }
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
  if (isNetworkConnected) {
    const params = {
      name,
      phoneNumber: phone,
      countryCode
    };
    this.setState({isLoading: true}, ()=>{
      userSignUp(params, (status, response)=>{
        myLog(':::::userSignUp::::::',status, response);
        if (status === true) {
          const typeOfOTP = 'Registration-OTP';
          navigateToScreen('OtpScreen', { typeOfOTP, phoneNumber: phone, nameOfUser:name, countryCode});
        } else {
          showErrorMessage(response);
        }
        this.setState({isLoading: false});
      });
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
  const{
    phone,
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

render(){
  const{
    name,
    nameError,
    isLoading
  } = this.state;
  return(
    <ScrollView style={{background:'white'}}>
      <View style={{marginTop:30,marginRight:10, display:'flex', flexDirection:'row-reverse',alignItems:'flex-end'}}>
        <ButtonWithIcon
          iconSize={verticalScale(20)}
          iconName="left-arrow"
          isLight={true}
          iconColor={COLORS.grayLight}
          onPress={this.onPressBack}
        /></View>

      <View style={{marginHorizontal: verticalScale(5)}}>
        <Image
          testID = "logo"
          source={require('../../../assets/Images/logo.png')}
          style={{marginTop:verticalScale(40),marginHorizontal:verticalScale(17)}}
        />
      </View>

      <View style={{marginHorizontal:verticalScale(23)}}>
        <View>
          <Text style={[TEXT_TYPE.H10,{marginVertical:verticalScale(32),color:COLORS.appNameColor}]}>{stringsConvertor('signUp.signUp')}</Text>
        </View>
        <View>
          <TextInput
            ref={(input) => this.name = input}
            label= {stringsConvertor('signUp.name')}
            baseColor={COLORS.gray}
            tintColor={COLORS.tintColor}
            textColor ={COLORS.phoneNumberTextColor}
            value={name}
            onChangeText={this.onChangeTextName}
            error={nameError}
            onSubmitEditing={() => this.phone.focus()}
          />
          {this.renderPhoneInputView()}
        </View>
        <View style={{alignItems:'center',marginTop:verticalScale(185)}}>
          <Button
            name = {stringsConvertor('signUp.requestOtp')}
            containerStyle = {styles.buttonStyle}
            textStyle= {[styles.buttonText,TEXT_TYPE.H3]}
            onPress={this.onSignUpPress}
            isLoading={isLoading}
          />
        </View>
        <View style={{display:'flex',alignItems:'flex-end', marginTop:10}}>
          <Text style={{color:COLORS.gray, fontSize:verticalScale(13), fontFamily:'roboto'}}> V. {DeviceInfo.getVersion()} </Text>
        </View>
      </View>
    </ScrollView>
  );
}
}

export default SignUp;
