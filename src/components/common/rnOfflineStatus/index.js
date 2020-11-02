/**
 * pda
 * index.js
 * @author PDA
 * @description Created on 27/02/2019
 * Copyright © 2019 pda. All rights reserved.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  NetInfo,
  View,
  StatusBar,
  Animated,
  Easing,
  AppState,
  Platform,
  StyleSheet
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { verticalScale } from '../../../theme/pdaStyleSheet';
import { stringsConvertor } from '../../../utils/I18n';
import { COLORS } from '../../../constants/Color';
import { PACKAGE } from '../../../constants/String';
import { myLog } from '../../../utils/StaticFunctions';

const Styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.red,
    paddingBottom: (Platform.OS === 'ios') ? (DeviceInfo.hasNotch() ) ? 37 : 0 : 0
  },
  offlineText: {
    color: COLORS.white,
    padding: verticalScale(10),
    textAlign: 'center'
  }
});

class OfflineBar extends Component {
  static propTypes = {
    offlineText: PropTypes.string,
    saveInternetConnectivityStatus : PropTypes.func,
    saveInternetConnectivityType: PropTypes.func,
    offlineSyn: PropTypes.func
  };

  static defaultProps = {
    saveInternetConnectivityStatus : ()=>{}
  }

  constructor(){
    super();

    this.state = {
      isConnected: true,
      networkType: '',
      networkEffectiveType: ''
    };
  }

  componentWillMount() {
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.setNetworkStatus
    );
    NetInfo.addEventListener(
      'connectionChange',
      this.setNetworkType
    );
    AppState.addEventListener('change', this._handleAppStateChange);
    this.animation = new Animated.Value(0);
  }
  componentWillUnMount() {
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this.setNetworkStatus
    );
    NetInfo.removeEventListener(
      'connectionChange',
      this.setNetworkType
    );
    AppState.removeEventListener('change', this._handleAppStateChange);
  }


  animationConstants = {
    DURATION: 800,
    TO_VALUE: 4,
    INPUT_RANGE: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4],
    OUTPUT_RANGE: [0, -15, 0, 15, 0, -15, 0, 15, 0]
  };

  setNetworkStatus = (status) => {
    this.setState({ isConnected: status });
    if (status) {
      this.triggerAnimation();
      setTimeout(()=>{
        this.props.offlineSyn();
      },3000);
    }
    this.props.saveInternetConnectivityStatus(status);
  };
  setNetworkType = (type) => {
    this.setState({ networkType: type });
    this.props.saveInternetConnectivityType(type);

  };

  _handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'active') {
      NetInfo.isConnected.fetch().then(this.setNetworkStatus);
    }
  };

  triggerAnimation = () => {
    this.animation.setValue(0);
    Animated.timing(this.animation, {
      duration: this.animationConstants.DURATION,
      toValue: this.animationConstants.TO_VALUE,
      useNativeDriver: true,
      ease: Easing.bounce
    }).start();
  };

  render() {
    const interpolated = this.animation.interpolate({
      inputRange: this.animationConstants.INPUT_RANGE,
      outputRange: this.animationConstants.OUTPUT_RANGE
    });
    const animationStyle = {
      transform: [{ translateX: interpolated }]
    };
    const { offlineText = stringsConvertor('alertMessage.noInternet') } = this.props;
    return !this.state.isConnected ? (
      <View style={[Styles.container]}>
        <StatusBar backgroundColor= {COLORS.red} />
        <Animated.Text style={[Styles.offlineText, animationStyle]}>
          {offlineText}
        </Animated.Text>
      </View>
    ) : null;
  }
}


export default OfflineBar;
