/**
 * pda
 * index.js
 * @author PDA
 * @description Created on 27/02/2019
 * Copyright © 2019 pda. All rights reserved.
 */

import React from 'react';
import {
  View,
  StatusBar
} from 'react-native';
import { Router, Stack, Scene, ActionConst } from 'react-native-router-flux';
import SplashScreen from '../container/common/SplashScreen';
import LoginScreen from '../container/common/LoginScreen';
import ForgotPasswordScreen from '../container/common/ForgotPasswordScreen';
import NotificationScreen from '../container/common/NotificationScreen';
import IntroScreen from '../container/common/IntroScreen';
import SignUpScreen from '../container/common/SignUpScreen';
import SignUpPasswordScreen from '../container/common/SignUpPasswordScreen';
import AccountScreen from '../container/common/AccountScreen';
import OtpScreen from '../container/common/OtpScreen';
import ResetPasswordScreen from '../container/common/ResetPasswordScreen';
import SignUpSuccessScreen from '../container/common/SignUpSuccessScreen';
import DashBoardScreen from '../container/common/DashBoardScreen';
import QrCodeScannerScreen from '../container/common/QrCodeScannerScreen';
import SessionCreateScreen from '../container/trainer/SessionCreateScreen';
import SessionInfoScreen from '../container/trainer/SessionInfoScreen';
import SessionScreen from '../container/trainer/SessionScreen';
import AttestationInfoScreen from '../container/common/AttestationInfoScreen';
import AttestationScreen from '../container/common/AttestationScreen';
import AboutScreen from '../container/common/AboutScreen';
import VideoPlayScreen from '../container/common/VideoPlayScreen';
import PhoneNumberUpdateScreen from '../container/common/PhoneNumberUpdateScreen';
import EmailUpdateScreen from '../container/common/EmailUpdateScreen';
import { COLORS } from '../constants/Color';
import PdfFileViewScreen from '../container/common/PdfFileViewScreen';
import ImageFileViewScreen from '../container/common/ImageFileViewScreen';
import TermsConditionsViewScreen from '../container/common/TermsConditionsViewScreen';
import PrivacyViewScreen from '../container/common/PrivacyViewScreen';
import LanguageDetection from '../components/common/LanguageDetection';


class NavigationRouter extends React.PureComponent{
  render(){
    return(
      <View style={{flex:1}}>
        <Router>
          <Stack key="root" hideNavBar>
            <Scene key="SplashScreen" component={SplashScreen}
              initial={true}
              type={ActionConst.RESET}
            />
            <Scene key="SignUpScreen" component={SignUpScreen} type={ActionConst.RESET} />
            <Scene key="LoginScreen" component={LoginScreen} />
            <Scene key="ForgotPasswordScreen" component={ForgotPasswordScreen} />
            <Scene key="IntroScreen" component={IntroScreen} />
            <Scene key="SignUpScreen" component={SignUpScreen} />
            <Scene key="SignUpPasswordScreen"  component={SignUpPasswordScreen} />
            <Scene key="AccountScreen"   component={AccountScreen} />
            <Scene key="OtpScreen" component={OtpScreen} />
            <Scene key="ResetPasswordScreen" component={ResetPasswordScreen} />
            <Scene key="SignUpSuccessScreen"  component={SignUpSuccessScreen} />
            <Scene key="DashboardScreen" component={DashBoardScreen} type={ActionConst.RESET} />
            <Scene key="AttestationsScreen" component={AttestationScreen} />
            <Scene key="SessionsScreen" component={SessionScreen} />
            <Scene key="QrCodeScannerScreen" component={QrCodeScannerScreen} />
            <Scene key="NotificationScreen" component={NotificationScreen} />
            <Scene key="SessionCreateScreen" component={SessionCreateScreen}/>
            <Scene key="SessionInfoScreen" component={SessionInfoScreen} />
            <Scene key="AttestationInfoScreen" component={AttestationInfoScreen} />
            <Scene key="AboutScreen" component={AboutScreen} />
            <Scene key="VideoPlayScreen" component={VideoPlayScreen} />
            <Scene key="PhoneNumberUpdateScreen" component={PhoneNumberUpdateScreen} />
            <Scene key="EmailUpdateScreen" component={EmailUpdateScreen} />
            <Scene key="PdfFileViewScreen" component={PdfFileViewScreen}/>
            <Scene key="ImageFileViewScreen" component={ImageFileViewScreen}/>
            <Scene key="TermsConditionsViewScreen" component={TermsConditionsViewScreen}/>
            <Scene key="PrivacyViewScreen" component={PrivacyViewScreen}/>
          </Stack>
        </Router>
        <StatusBar backgroundColor= {COLORS.password} />
      </View>
    );
  }
}

export default NavigationRouter;
