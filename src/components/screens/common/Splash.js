/**
 * pda
 * Splash.js
 * @author PDA
 * @description Created on 27/02/2019
 * Copyright © 2019 pda. All rights reserved.
 */

import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Platform
} from 'react-native';
import Spinner from 'react-native-spinkit';
import { COLORS } from '../../../constants/Color';
import { verticalScale, TEXT_TYPE,horizontalScale } from '../../../theme/pdaStyleSheet';
import { isDevelopment } from '../../../utils/httpClient/Url';
import DeviceInfo from 'react-native-device-info';
import { Actions } from 'react-native-router-flux';
import { showSuccessMessage, navigateToScreen, myLog, updateAppNotice, isTrainerApp } from '../../../utils/StaticFunctions';
import Button from '../../common/Button';
import { stringsConvertor } from '../../../utils/I18n';
import PropTypes from 'prop-types';
import { sendActionAnalytics, sendActionAnalyticsToDB } from '../../../utils/AnalyticsHelper';
import AndroidBackHandler from '../../common/AndroidBackHandler';
import { STORAGE } from '../../../constants/String';
import LocalStorageHelper from '../../../utils/LocalStorageHelper';

const styles = StyleSheet.create({
  activityView:{
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText:{
    color:COLORS.white,
    fontWeight: 'bold'
  }
});
class Splash extends Component {

  static propTypes = {
    isNetworkConnected : PropTypes.bool,
    updateUserDataInState: PropTypes.func,
    name: PropTypes.string,
    checkAppUpdate: PropTypes.func
  }

  static defaultProps = {
    isNetworkConnected: false,
    updateUserDataInState: ()=>{},
    checkAppUpdate: ()=>{}
  }

  constructor(){
    super();
    this.state = {
      isLoading: true
    };
  }

  componentDidMount(){
    this.checkUpdateRequired();
    setTimeout(()=>{
      this.checkAutoLogin();
    },500);
  }

  checkAutoLogin(){
    this.setState({
      isLoading : true
    },()=>{

      LocalStorageHelper.getDataFromLocal(STORAGE.IS_LOGGED_IN).then((isLoggedIn)=>{
        myLog(' Splash STORAGE.IS_LOGGED_IN isLoggedIn Splash', isLoggedIn);
        if (isLoggedIn === 'true') {
          LocalStorageHelper.getDataFromLocal(STORAGE.USER_DATA).then((userData)=>{
            myLog(' Splash STORAGE.USER_DATA userData', userData);
            const response = JSON.parse(userData);
            this.props.updateUserDataInState(response, (userUpdateStatus, message)=>{
              if (userUpdateStatus) {
                if (Actions.currentScene === 'SplashScreen') {
                  const userId = response.userDetails.userId;
                  sendActionAnalytics('Login', response.userDetails,{userId});
                  sendActionAnalyticsToDB('Login',{userId});
                  showSuccessMessage(stringsConvertor('alertMessage.welcomeBack') + message);
                  navigateToScreen('DashboardScreen');
                }
              }else{
                navigateToScreen('IntroScreen');
              }
            });
          }).catch((error)=>{
            this.setState({
              isLoading : false
            });
            myLog('Splash STORAGE.USER_DATA error', error);
          });
        }
        else {
          navigateToScreen('IntroScreen');
        }
      }).catch((error)=>{
        this.setState({
          isLoading : false
        });
        myLog(' Splash  STORAGE.IS_LOGGED_IN error', error);
      });
    });
  }
  checkUpdateRequired(){
    const {
      isNetworkConnected,
      checkAppUpdate
    } = this.props;
    const param = {
      appVersion:DeviceInfo.getVersion(),
      appType:Platform.OS,
      appName:isTrainerApp() ? 'trainer' : 'participant'
    };
    if(isNetworkConnected){
      checkAppUpdate(param,(status,response)=>{
        myLog('------------------======================-------------',status,param);
        if(status){
          updateAppNotice(response);
        }
      });
    }
  }
  renderLoader(){
    const { isLoading } = this.state;
    const { isNetworkConnected } = this.props;
    if (isLoading) {
      return (
        <Spinner
          color={COLORS.sessionButton}
          type ="Circle"
          size = {25}
        />
      );
    }else{
      return(
        <Button
          style={[styles.buttonView,{width:verticalScale(30),height: verticalScale(10)}]}
          onPress={() => this.checkAutoLogin()}
          name = {stringsConvertor('splash.retry')}
          containerStyle = {styles.buttonStyle}
          textStyle= {[styles.buttonText,TEXT_TYPE.H4]}
          disabled={!isNetworkConnected}
        />
      );
    }
  }
  renderVersionLabel() {
    if(isDevelopment){
      return(
        <Text style={{ position: 'absolute', bottom: 0, right: 10, textAlign: 'right', marginRight: 5, marginBottom: 6, color: COLORS.fontColor }}>{stringsConvertor('splash.version')} {DeviceInfo.getVersion()}</Text>
      );
    }
  }

  render(){
    const {
      name
    } = this.props;
    return(
      <View style={{ flex:1,backgroundColor:COLORS.white}}>
        <View style={[ styles.activityView]}>
          {this.renderLoader()}
        </View>
        {this.renderVersionLabel()}
        <AndroidBackHandler screen={name}/>
      </View>

    );
  }

}

export default Splash;
