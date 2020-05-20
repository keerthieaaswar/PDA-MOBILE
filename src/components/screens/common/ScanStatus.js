/**
 * pda
 * ScanStatus.js
 * @author Socion Advisors LLP
 * @description Created on 27/02/2019
 * Copyright © 2019 pda. All rights reserved.
 */
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import PropTypes from 'prop-types';
import { COLORS } from '../../../constants/Color';
import { verticalScale, TEXT_TYPE, FONT_FAMILY } from '../../../theme/pdaStyleSheet';
import { myLog, navigateToScreen } from '../../../utils/StaticFunctions';
import { stringsConvertor } from '../../../utils/I18n';

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: COLORS.white
  },
  image:{
    height:verticalScale(120),
    width:verticalScale(120)
  },
  buttonStyle:{
    paddingHorizontal: verticalScale(2),
    paddingVertical: verticalScale(15),
    borderRadius:verticalScale(40)
  },
  buttonText:{
    color:COLORS.white,
    fontWeight: 'bold',
    paddingHorizontal:verticalScale(40)
  },
  circleBorder: {
    alignItems:'center',
    justifyContent:'center',
    width:125,
    height:125
  }
});
class ScanStatus extends Component {
  static propTypes = {
    type:PropTypes.string,
    sessionName:PropTypes.string,
    isNetworkConnected: PropTypes.bool
  }

  static defaultProps = {
    type:'start',
    sessionName:'',
    isNetworkConnected: false
  }
  constructor(props){
    super(props);
    this.onCreatePress = this.onCreatePress.bind(this);
  }
  componentDidMount(){
    setTimeout(() => {
      this.onCreatePress();
    }, 5000);
  }
  onCreatePress(){
    const {type,isNetworkConnected} = this.props;
    if (type === 'endstartQR' && isNetworkConnected) {
      Actions.reset('AttestationsScreen');
    }else{
      Actions.pop();
    }
  }

  render(){
    const {
      sessionName,
      type
    } = this.props;
    let sessionStatusMessage = '';
    let congratulationMessage = '';
    myLog('::::=Session Success======', type);
    let path = require('../../../assets/Images/sessionStarted.png');
    if (type === 'startQR') {
      sessionStatusMessage = stringsConvertor('session.created.sessionScanIn');
      congratulationMessage = stringsConvertor('session.created.sessionScanInMessage');
      path= require('../../../assets/Images/sessionStarted.png');
    }else if (type === 'endstartQR') {
      sessionStatusMessage = stringsConvertor('session.created.sessionScanOut');
      congratulationMessage = stringsConvertor('session.created.sessionScanOutMessage');
      path= require('../../../assets/Images/sessionEnded.png');
    }

    return(
      <View style={styles.container}>
        <View style={{flex:1, alignItems:'center', padding: verticalScale(30), marginTop:verticalScale(60)}}>
          <View style={styles.circleBorder}>
            <Image source = {path} />
          </View>
          <View style={{marginTop:verticalScale(80)}}>
            <Text style={[TEXT_TYPE.H5, {color: COLORS.black}]}>{sessionStatusMessage}</Text>
          </View>
          <Text style={[TEXT_TYPE.H2,{paddingVertical: verticalScale(25), paddingHorizontal: verticalScale(40),color:COLORS.attestationDateColor, textAlign:'center'}]}
            numberOfLines ={6}
          >
            {congratulationMessage}<Text style={[TEXT_TYPE.H4,{Color:COLORS.attestationDateColor, fontFamily: FONT_FAMILY.BOLD}]}>{sessionName}.</Text></Text>
        </View>
      </View>
    );
  }

}

export default ScanStatus;
