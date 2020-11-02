/**
 * pda
 * SignUpSuccess.js
 * @author PDA
 * @description Created on 09/06/2019
 * Copyright © 2019 pda. All rights reserved.
 */
import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet} from 'react-native';
import { verticalScale, TEXT_TYPE, pdaStyleSheet } from '../../../theme/pdaStyleSheet';
import { COLORS } from '../../../constants/Color';
import { navigateToScreen } from '../../../utils/StaticFunctions';
import { stringsConvertor } from '../../../utils/I18n';

const styles = StyleSheet.create({
  mainContainer : {
    flex : 1,
    backgroundColor:COLORS.white,
    paddingTop: pdaStyleSheet.toolbarPaddingTop
  }
});

class SignUpSuccess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };
  }

  componentDidMount() {
    setTimeout(() => {
      navigateToScreen('DashboardScreen');
    }, 2000);
  }

  render(){
    const{
      isLoading
    } = this.state;
    return(
      <View style={styles.mainContainer} pointerEvents = {isLoading ? 'none':null}>
        <View style={{flex:1, alignItems:'center', margin:40}}>
          <View style={{paddingBottom:verticalScale(25),justifyContent:'center'}}/>
          <Text style={[TEXT_TYPE.H9,{color:COLORS.appNameColor}]}>{stringsConvertor('signUp.congratulations')}</Text>
          <Text style={[TEXT_TYPE.H1,{color: COLORS.signUpText1,marginTop:verticalScale(10)}]}>{stringsConvertor('signUp.signedUpSuccess')}</Text>
          <Image
            style={{width: 279, height: 239,marginTop:verticalScale(25)}}
            source={require('../../../assets/Images/congratulation.png')}
          />
        </View>
      </View>
    );
  }
}

export default SignUpSuccess;
