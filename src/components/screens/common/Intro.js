/**
 * pda
 * Intro.js
 * @author Socion Advisors LLP
 * @description Created on 06/06/2019
 * Copyright © 2019 pda. All rights reserved.
 */
import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';
import { verticalScale, TEXT_TYPE, pdaStyleSheet, horizontalScale, FONT_FAMILY } from '../../../theme/pdaStyleSheet';
import Button from '../../common/Button';
import { navigateToScreen, showErrorMessage } from '../../../utils/StaticFunctions';
import { COLORS } from '../../../constants/Color';
import RootView from '../../common/RootView';
import { stringsConvertor } from '../../../utils/I18n';
import PermissionHelper from '../../../utils/PermissionHelper';
import AndroidBackHandler from '../../common/AndroidBackHandler';

const styles = StyleSheet.create({
  mainContainer : {
    flex : 1,
    backgroundColor:COLORS.white,
    paddingTop: pdaStyleSheet.toolbarPaddingTop,
    paddingVertical: verticalScale(20),
    paddingHorizontal: verticalScale(15),
    justifyContent:'center'
  },
  scrollViewContainer : { },
  buttonText:{
    color: COLORS.white,
    fontWeight: 'bold',
    paddingHorizontal:verticalScale(10),
    width: horizontalScale(115),
    paddingVertical: verticalScale(2)
  },
  selectorIcon:{
    color:COLORS.placeholderTextColor,
    paddingLeft: verticalScale(10)
  },
  logo: {
    marginLeft:horizontalScale(5),
    marginVertical: verticalScale(20),
    marginTop:verticalScale(56)
  }
});
const permissionHelper = new PermissionHelper();
class Intro extends Component {
  static propTypes = {
    isNetworkConnected : PropTypes.bool,
    name:PropTypes.string
  }

  static defaultProps = {
    isNetworkConnected: false,
    name: ''
  }
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };
    this.onClickSignUp = this.onClickSignUp.bind(this);
    this.onClickLogin = this.onClickLogin.bind(this);
  }
  componentDidMount(){
    const title = stringsConvertor('alert.appName');
    const message = stringsConvertor('alertMessage.locationPermission');
    const permission = 'location';
    permissionHelper.permissionChecker(permission, title, message,(status)=>{
    });
  }
  onClickSignUp(){
    const {
      isNetworkConnected
    } = this.props;
    if(!isNetworkConnected){
      showErrorMessage(stringsConvertor('alertMessage.noInternetConnection'));
    }
    else{
      navigateToScreen('SignUpScreen');
    }
  }
  onClickLogin(){
    const {
      isNetworkConnected
    } = this.props;
    if(!isNetworkConnected){
      showErrorMessage(stringsConvertor('alertMessage.noInternetConnection'));
    }
    else{
      navigateToScreen('LoginScreen');
    }
  }
  render(){
    const{
      isLoading
    } = this.state;
    const {
      name
    } = this.props;
    return(
      <RootView style={styles.mainContainer} pointerEvents={isLoading ? 'none' : null}>
        <Image
          testID="logo"
          source={require('../../../assets/Images/logo.png')}
          style={styles.logo}
        />
        <Text style={[TEXT_TYPE.H10, { color: COLORS.landingText,marginHorizontal:verticalScale(5), fontSize:verticalScale(28) }]}>{stringsConvertor('intro.text1')}</Text>
        <Text style={[TEXT_TYPE.H10, { fontFamily:FONT_FAMILY.BOLD,color: COLORS.landingText,marginHorizontal:verticalScale(5),fontSize:verticalScale(28) }]}>{stringsConvertor('intro.text2')}</Text>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: verticalScale(335),marginHorizontal:verticalScale(6)}}>
          <View style={{marginRight:verticalScale(15)}}>
            <Button
              name={stringsConvertor('intro.signUp')}
              textStyle={[styles.buttonText, TEXT_TYPE.H3]}
              onPress={this.onClickSignUp}
            />
          </View>
          <View>
            <Button
              name={stringsConvertor('intro.login')}
              isGradient={false}
              textStyle={[styles.buttonText, TEXT_TYPE.H3, { color:COLORS.password }]}
              onPress={this.onClickLogin}
            />
          </View>
        </View>
        <AndroidBackHandler screen={name}/>
      </RootView>
    );
  }
}
export default Intro;
