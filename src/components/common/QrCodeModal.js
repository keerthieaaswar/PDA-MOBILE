/**
 * pda
 * QrCodeModal.js
 * @author PDA
 * @description Created on 089/06/2019
 * Copyright © 2019 pda. All rights reserved.
 */

import React, { PureComponent } from 'react';
import {
  Modal,
  View,
Platform} from 'react-native';
import { deviceHeight, deviceWidth, verticalScale } from '../../theme/pdaStyleSheet';
import ButtonWithIcon from './ButtonWithIcon';
import QRCode from 'react-native-qrcode-svg';
import PropTypes from 'prop-types';
import { COLORS } from '../../constants/Color';

class QrCodeModal extends PureComponent {
  static propTypes = {
    onClosePress: PropTypes.func,
    visible: PropTypes.bool
  }

  static defaultProps = {
    onClosePress:()=>{},
    visible: false
  }
  render(){
    const {
      visible,
      onClosePress,
      value
    } = this.props;
    return(
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
      >
        <View style={{height: deviceHeight, backgroundColor:COLORS.qrCodeModal,alignItems:'center', justifyContent:'center'}}>
          <View style={{ height: (deviceWidth / 100) * 80, width: (deviceWidth / 100) * 80, backgroundColor: COLORS.white,borderRadius: verticalScale(10) }}>
            <View style={{flex:1, padding:30, alignItems:'center', justifyContent:'center'}}>
              <QRCode
                value={value}
                size={(deviceHeight/100)*40}
              />
            </View>
          </View>
          <View style={{padding:20}}>
            <ButtonWithIcon
              iconSize={Platform.OS==='ios'?verticalScale(23): verticalScale(30)}
              iconName='close'
              isLight={true}
              iconColor={COLORS.white}
              containerStyle={{backgroundColor:COLORS.qrCodeTimeButton, height: verticalScale(50),width:verticalScale(50), borderRadius: verticalScale(25),alignItems:'center', justifyContent:'center'}}
              onPress={onClosePress}
            />
          </View>
        </View>
      </Modal>
    );
  }
}
export default QrCodeModal;
