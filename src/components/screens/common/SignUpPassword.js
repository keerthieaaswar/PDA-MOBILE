/**
 * pda
 * SignUpPassword.js
 * @author Socion Advisors LLP
 * @description Created on 08/06/2019
 * Copyright © 2019 pda. All rights reserved.
 */
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Platform
} from 'react-native';
import PropTypes from 'prop-types';
import { verticalScale, TEXT_TYPE, FONT_FAMILY, deviceWidth } from '../../../theme/pdaStyleSheet';
import { COLORS } from '../../../constants/Color';
import { stringsConvertor } from '../../../utils/I18n';
import Button from '../../common/Button';
import { Actions } from 'react-native-router-flux';
import Ripple from '../../common/rippleEffect';
import TextInput from '../../common/TextInput';
import { } from 'react-native';
import AesUtil from '../../../utils/AesUtil';
import { navigateToScreen, showErrorMessage} from '../../../utils/StaticFunctions';
import RootView from '../../common/RootView';
import ButtonWithIcon from '../../common/ButtonWithIcon';
import CustomIcon from '../../common/CustomIcon';
import DeviceInfo from 'react-native-device-info';
const styles = StyleSheet.create({
  container: {
    paddingBottom: verticalScale(20)
  },
  buttonStyle:{
    width : verticalScale(366),
    paddingVertical: verticalScale(15),
    borderRadius:verticalScale(6)
  },
  buttonText:{
    color:COLORS.white,
    fontFamily: FONT_FAMILY.BOLD,
    textAlign:'center'
  }
});

let aesUtil = new AesUtil();
class SignUpPassword extends Component {

  static propTypes = {
    isNetworkConnected : PropTypes.bool,
    nameOfUser: PropTypes.string,
    phoneNumber: PropTypes.string,
    setPassword: PropTypes.func,
    countryCode: PropTypes.object
  }

  static defaultProps = {
    isNetworkConnected: false,
    setPassword: ()=>{}
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      name: props.nameOfUser,
      phone: props.phoneNumber,
      password:'',
      reTypePassword:'',
      passwordError:'',
      rePasswordError:'',
      reTypePasswordStatus:'',
      countryCode:'',
      isTermsConditionsCheck:false,
      userPIIShare: false
    };
    this.onPressBack =this.onPressBack.bind(this);
    this.onCreateAccountPress = this.onCreateAccountPress.bind(this);
    this.onChangeTextPassword = this.onChangeTextPassword.bind(this);
    this.onChangeTextRePassword = this.onChangeTextRePassword.bind(this);
    this.onCheckTermsConditions=this.onCheckTermsConditions.bind(this);
    this.navigateToTermsConditions=this.navigateToTermsConditions.bind(this);
    this.onCheckSharePII = this.onCheckSharePII.bind(this);
  }
  onChangeTextPassword(text){
    const {
      reTypePassword
    } = this.state;
    this.setState({ password: text, passwordError: '', rePasswordError: '', reTypePasswordStatus: reTypePassword === text ? 'success' : '' });
  }
  onChangeTextRePassword(text){
    const {
      password
    } = this.state;
    this.setState({ reTypePassword: text, passwordError: '', rePasswordError: '', reTypePasswordStatus: text === password ? 'success' : '' });
  }
  onPressBack(){
    Actions.pop();
  }
  onCreateAccountPress(){
    const {
      password,
      reTypePassword,
      phone,
      isTermsConditionsCheck,
      userPIIShare
    } = this.state;
    const {
      setPassword,
      isNetworkConnected,
      countryCode
    } = this.props;
    if (password.length === 0) {
      this.setState({passwordError: stringsConvertor('validationMessage.passwordIsRequired')
      });
      this.password.focus();
      return;
    }
    if (reTypePassword.length === 0) {
      this.setState({rePasswordError: stringsConvertor('validationMessage.retypePasswordIsRequired')
      });
      this.reTypePassword.focus();
      return;
    }

    if (password !== reTypePassword) {
      this.setState({rePasswordError: stringsConvertor('validationMessage.passwordMatching')
      });
      this.reTypePassword.focus();
      return;
    }
    if (isTermsConditionsCheck !== true) {
      showErrorMessage(stringsConvertor('validationMessage.checkBoxError'));
      return;
    }
    if (userPIIShare !== true) {
      showErrorMessage(stringsConvertor('validationMessage.checkBoxError'));
      return;
    }
    if (isNetworkConnected) {
      const data = {
        password : aesUtil.encrypt(password),
        userName: phone,
        countryCode,
        userPIIShare
      };
      this.setState({isLoading: true}, ()=>{
        setPassword(data, (status, response)=>{
          if (status === true) {
            navigateToScreen('SignUpSuccessScreen');
          }else{
            showErrorMessage(response);
          }
          this.setState({isLoading: false});
        });
      });
    }
  }
  onCheckTermsConditions() {
    this.setState((prevState) => {
      return {
        isTermsConditionsCheck: !prevState.isTermsConditionsCheck
      };
    });
  }
  onCheckSharePII() {
    this.setState((prevState) => {
      return {
        userPIIShare: !prevState.userPIIShare
      };
    });
  }
  navigateToTermsConditions(){
    navigateToScreen('TermsConditionsViewScreen');
  }
  renderCheckBox(){
    const{
      isTermsConditionsCheck,
      userPIIShare
    }=this.state;
    return(
      <View >
        <View style={{flexDirection:'row',alignItems:'center'}}>
          <ButtonWithIcon
            iconSize={18}
            containerStyle={{paddingVertical:0,paddingHorizontal:0, backgroundColor:'#ffedec',marginRight: 10}}
            iconColor={'#f9756b'}
            iconName={isTermsConditionsCheck ? 'check-box-selected':'check-box-empty'}
            onPress={this.onCheckTermsConditions}
            isLight={isTermsConditionsCheck ? false: true}
          />
          <View style={{alignItems:'center', flexDirection:'row',justifyContent:'center'}}>
            <Text style={TEXT_TYPE.H2}>{stringsConvertor('signUp.iAccept')}</Text>
            <Ripple
              onPress={this.navigateToTermsConditions}
            >
              <Text
                testID="To_login_Text" style={[TEXT_TYPE.H2, {color:COLORS.forgetPasswordColor,textDecorationLine: 'underline'}]}
              >{stringsConvertor('account.termCondition')}</Text>
            </Ripple>
          </View>
        </View>
        {/* <View style={{flexDirection:'row'}}>
          <ButtonWithIcon
            iconSize={18}
            containerStyle={{paddingVertical:0,paddingHorizontal:0, backgroundColor:'#ffedec',marginRight: 10}}
            iconColor={'#f9756b'}
            iconName={userPIIShare ? 'check-box-selected':'check-box-empty'}
            onPress={this.onCheckSharePII}
            isLight={userPIIShare ? false: true}
          />
          <View style={{alignItems:'center', flexDirection:'row',justifyContent:'center', marginTop:4}}>
            <Text style={TEXT_TYPE.H2}>{stringsConvertor('signUp.sharePII')}</Text>
          </View>
        </View> */}
      </View>
    );
  }
  render(){
    const{
      name,
      phone,
      password,
      reTypePassword,
      passwordError,
      rePasswordError,
      isLoading,
      reTypePasswordStatus
    } = this.state;
    return(
      <RootView pointerEvents = {isLoading ? 'none':null} style={{flex:1}}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={{marginHorizontal:verticalScale(23)}}>
            <View style={{flexDirection:'row',justifyContent : 'space-between'}}>
              <View style={{marginHorizontal: verticalScale(-16), marginTop:verticalScale(10)}}>
                <Image
                  testID = "logo"
                  source={require('../../../assets/Images/logo.png')}
                  style={{marginTop:verticalScale(56),marginBottom:verticalScale(16),marginHorizontal:verticalScale(17)}}
                />
              </View>
              <View>
                <Ripple style={{marginTop: Platform.OS === 'ios'?verticalScale(30) : verticalScale(25)}} onPress={this.onPressBack}>
                  <CustomIcon
                    style ={{color:COLORS.gray}}
                    name= "left-arrow"
                    size = {verticalScale(18)}
                    light = {true}
                  />
                </Ripple>
              </View>
            </View>
            <View>
              <Text style={[TEXT_TYPE.H10,{marginVertical:verticalScale(20),color:COLORS.appNameColor}]}>Sign up</Text>
            </View>
            <View>
              <TextInput
                label= {stringsConvertor('signUp.name')}
                baseColor={COLORS.gray}
                tintColor={COLORS.tintColor}
                textColor ={COLORS.phoneNumberTextColor}
                value={name}
                editable = {false}
              />
              <TextInput
                label= {stringsConvertor('signUp.phoneNumber')}
                value={phone}
                tintColor={COLORS.tintColor}
                textColor ={COLORS.phoneNumberTextColor}
                editable= {false}
              />
              <TextInput
                ref={(input) => this.password = input}
                label= {stringsConvertor('account.enterDesiredPassword')}
                baseColor={COLORS.gray}
                tintColor={COLORS.tintColor}
                textColor ={COLORS.textColor}
                value={password}
                secureTextEntry = {true}
                onChangeText={this.onChangeTextPassword}
                error={passwordError}
                onSubmitEditing={() => this.reTypePassword.focus()}
                rightViewType={'password'}
              />
              <TextInput
                ref={(input) => this.reTypePassword = input}
                label= {stringsConvertor('account.reenterPassword')}
                baseColor={COLORS.gray}
                tintColor={COLORS.tintColor}
                textColor ={COLORS.textColor}
                value={reTypePassword}
                secureTextEntry = {true}
                onChangeText={this.onChangeTextRePassword}
                error={rePasswordError}
                onSubmitEditing={() => this.onCreateAccountPress}
                rightViewType={'password'}
              />
            </View>
            <View style={{marginTop:verticalScale(20)}}>
              {this.renderCheckBox()}
            </View>
            <View style={{marginTop:verticalScale(25)}}>
              <Button
                name = {stringsConvertor('signUp.createAccount')}
                containerStyle={{width: deviceWidth - 30}}
                textStyle= {[styles.buttonText,TEXT_TYPE.H4]}
                onPress={this.onCreateAccountPress}
                isLoading={isLoading}
              />
            </View>
            <View style={{display:'flex',alignItems:'flex-end', marginTop:10}}>
              <Text style={{color:COLORS.gray, fontSize:verticalScale(13), fontFamily:'roboto'}}> V. {DeviceInfo.getVersion()} </Text>
            </View>
          </View>
        </ScrollView>
      </RootView>
    );
  }
}

export default SignUpPassword;