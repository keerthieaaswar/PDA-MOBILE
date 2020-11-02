/**
 * pda
 * BottomMenu.js
 * @author PDA
 * @description Created on 7/06/2019
 * Copyright © 2019 pda. All rights reserved.
 */
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image
} from 'react-native';
import PropTypes from 'prop-types';
import { verticalScale } from '../../theme/pdaStyleSheet';
import Ripple from './rippleEffect';
import { navigateToScreen } from '../../utils/StaticFunctions';
import DeviceInfo from 'react-native-device-info';
import { PACKAGE } from '../../constants/String';
const styles = StyleSheet.create({
  container:{
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection : 'row'
  },
  buttonContainer:{
    margin: 10,
    borderRadius: verticalScale(40),
    height: verticalScale(80),
    width: verticalScale(80),
    justifyContent: 'center',
    alignItems: 'center'
  }
});
let typeOfApplication = 'participant';
class BottomMenu extends Component{

  static propTypes = {
    screen: PropTypes.string,
    style : PropTypes.object || PropTypes.array
  };

  static defaultProps = {
    screen:''
  };

  constructor(){
    super();

    this.onAttestationPress = this.onAttestationPress.bind(this);
    this.onScanPress = this.onScanPress.bind(this);
    this.onAccountPress = this.onAccountPress.bind(this);
    this.onSessionPress = this.onSessionPress.bind(this);

    const id = DeviceInfo.getBundleId();
    this.findApplicationType(id);
  }

  findApplicationType(id){
    switch (id) {
      case PACKAGE.ANDROID.PARTICIPANT:
        typeOfApplication = 'participant';
        break;
      case PACKAGE.IOS.PARTICIPANT:
        typeOfApplication = 'participant';
        break;
      case PACKAGE.ANDROID.TRAINER:
        typeOfApplication = 'trainer';
        break;
      case PACKAGE.ANDROID.PDATRAINER:
        typeOfApplication = 'pdaTrainer';
        break;
      case PACKAGE.IOS.TRAINER:
        typeOfApplication = 'trainer';
        break;
      default:
        typeOfApplication = 'participant';
        break;
    }
  }
  onSessionPress(){
    navigateToScreen('SessionsScreen');
  }
  onAttestationPress(){
    navigateToScreen('AttestationsScreen');
  }

  onScanPress(){
    navigateToScreen('QrCodeScannerScreen', {title: 'Scanning..', type:'start'});
  }

  onAccountPress(){
    navigateToScreen('AccountScreen');
  }

  selectIcon(value) {
    const {
      screen
    } = this.props;
    switch (value) {
      case screen:
        return true;
      default:
        return false;
    }
  }

  renderButton({icon}, onPress =()=>{}){
    return(
      <Ripple style={styles.buttonContainer} onPress={onPress} rippleContainerBorderRadius={verticalScale(40)}>
        <Image
          source={icon}
          style={{width: verticalScale(80), height: verticalScale(80)}}
        />
      </Ripple>
    );
  }

  render(){
    const attestation = {
      icon : this.selectIcon('AttestationsScreen') || this.selectIcon('AttestationInfoScreen') ? require('../../assets/Images/tab/selected/attestations.png'):require('../../assets/Images/tab/attestations.png')
    };
    const scan = {
      icon : this.selectIcon('QrCodeScannerScreen') ? require('../../assets/Images/tab/selected/scan.png'):require('../../assets/Images/tab/scan.png')
    };
    const account = {
      icon : this.selectIcon('AccountScreen') ? require('../../assets/Images/tab/selected/account.png'):require('../../assets/Images/tab/account.png')
    };
    const session = {
      icon : this.selectIcon('SessionsScreen') || this.selectIcon('SessionInfoScreen')? require('../../assets/Images/tab/selected/sessions.png'):require('../../assets/Images/tab/sessions.png')
    };
    const {
      style
    } = this.props;
    return (
      <View style={[styles.container, style]}>
        {this.renderButton(attestation, this.onAttestationPress)}
        {
          typeOfApplication === 'trainer' || typeOfApplication === 'pdaTrainer' ?
            this.renderButton(session, this.onSessionPress)
            :
            this.renderButton(scan, this.onScanPress)
        }
        {this.renderButton(account, this.onAccountPress)}
      </View>
    );
  }
}

export default BottomMenu;
