/**
 * pda
 * EmailUpdate.js
 * @author PDA
 * @description Created on 02/08/2019
 * Copyright © 2019 pda. All rights reserved.
 */

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  Platform,
  ScrollView
} from 'react-native';
import PropTypes from 'prop-types';
import { stringsConvertor } from '../../../utils/I18n';
import { verticalScale, TEXT_TYPE, pdaStyleSheet } from '../../../theme/pdaStyleSheet';
import TextInput from '../../common/TextInput';
import Button from '../../common/Button';
import { Actions } from 'react-native-router-flux';
import { navigateToScreen, showErrorMessage, validateEmail } from '../../../utils/StaticFunctions';
import ButtonWithIcon from '../../common/ButtonWithIcon';
import RootView from '../../common/RootView';
import { COLORS } from '../../../constants/Color';


class EmailUpdate extends Component {
  static propTypes = {
    isNetworkConnected: PropTypes.bool,
    updateEmail: PropTypes.func,
    userData: PropTypes.object
  }
  static defaultProps = {
    isNetworkConnected: false,
    updateEmail: ()=>{},
    userData: {}
  }

  constructor(props){
    super(props);
    this.state={
      email: '',
      emailError: '',
      isLoading: false
    };
    this.onSaveEmailPress = this.onSaveEmailPress.bind(this);
    this.onPressBack = this.onPressBack.bind(this);
    this.onChangeTextEmail = this.onChangeTextEmail.bind(this);
  }
  onPressBack(){
    Actions.pop();
  }


  onChangeTextEmail(text) {
    this.setState({ email: text, emailError:''});
  }
  onSaveEmailPress(){
    const {
      email
    } = this.state;
    const {
      updateEmail,
      userData
    } = this.props;
    if(email.length === 0){
      this.setState({emailError:stringsConvertor('validationMessage.emailIdIsRequired')});
      this.email.focus();
      return;
    }
    if(!validateEmail(email)){
      this.setState({emailError:stringsConvertor('validationMessage.invalidEmailId')});
      this.email.focus();
      return;
    }
    else{
      this.setState({isLoading: true},()=>{
        updateEmail(email, userData.userId, (status, response)=>{
          if (status === true) {
            Alert.alert(
              stringsConvertor('alert.appName'),
              stringsConvertor('alertMessage.verificationEmailSuccess'),
              [
                {text: stringsConvertor('alert.ok'), onPress:()=>{
                  navigateToScreen('AccountScreen');
                }}
              ],
              {cancelable: false},
            );
          }else{
            showErrorMessage(response);
          }
          this.setState({ isLoading: false, email: ''});
        });
      });
    }
  }
  render() {
    const{
      email,
      emailError,
      isLoading
    }= this.state;
    return (
      <RootView style={{flex:1, paddingTop: pdaStyleSheet.toolbarPaddingTop}} pointerEvents = {isLoading ? 'none':null}>
        <ScrollView>
          <View style={{position:'absolute', right: 10, top:Platform.OS === 'ios'? 30 : 20}}>
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
                <View style={{marginHorizontal: verticalScale(-16)}}/>
                <Text style={[TEXT_TYPE.H9,{color:COLORS.appNameColor,marginBottom:verticalScale(55)}]}>
                  {stringsConvertor('emailUpdate.addEmail')}
                </Text>
              </View>
            </View>
            <View>
              <TextInput
                ref={(input) => this.email = input}
                label={stringsConvertor('emailUpdate.enterNewEmail')}
                value={email}
                baseColor={COLORS.gray}
                tintColor={COLORS.tintColor}
                textColor ={COLORS.phoneNumberTextColor}
                onChangeText={this.onChangeTextEmail}
                error={emailError}
                onSubmitEditing={this.onSaveEmailPress}
                maxLength={60}
              />
            </View>
            <View style={{flex:1, marginVertical: verticalScale(20), justifyContent:'flex-end', paddingBottom: verticalScale(70),marginTop:verticalScale(200)}}>
              <Button
                name = {stringsConvertor('emailUpdate.verify')}
                onPress={this.onSaveEmailPress}
                isLoading= {isLoading}
              />
            </View>
          </View>
        </ScrollView>

      </RootView>
    );
  }
}

export default EmailUpdate;
