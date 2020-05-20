/**
 * pda
 * Toolbar.js
 * @author Socion Advisors LLP
 * @description Created on 27/02/2019
 * Copyright © 2019 pda. All rights reserved.
 */
'use strict';
import React, { PureComponent } from 'react';
import {Platform, StyleSheet, View, Text} from 'react-native';
import ElevatedView from './ElevatedView';
import { Actions } from 'react-native-router-flux';
import PropTypes from 'prop-types';
import { pdaStyleSheet, TEXT_SIZE, FONT_FAMILY,verticalScale } from '../../theme/pdaStyleSheet';
import ButtonWithIcon from '../../components/common/ButtonWithIcon';
import { COLORS } from '../../constants/Color';
import LinearGradient from 'react-native-linear-gradient';
import { navigateToScreen } from '../../utils/StaticFunctions';

const styles = StyleSheet.create({
  defaultContainerStyle :  {
    flexDirection : 'row',
    marginVertical : verticalScale(1),
    paddingRight:verticalScale(15),
    paddingVertical:verticalScale(5)
  },
  toolbarTitle :{
    color:'white'
  },
  linearGradient:{
    shadowOpacity: 0.5,
    shadowRadius: 4,
    shadowOffset: {
      height: StyleSheet.hairlineWidth
    },zIndex: Platform.OS === 'android' ? 0 : 1,
    elevation: 4,
    shadowColor: COLORS.shadowColor
  }
});

export default class Toolbar extends PureComponent {

  static propTypes = {
    title : PropTypes.string,
    isBack: PropTypes.bool,
    rightRender: PropTypes.element,
    isGradient: PropTypes.bool,
    gradientColor: PropTypes.array,
    navigate:PropTypes.string
  };

  static defaultProps = {
    title:'',
    isBack: false,
    isGradient: true,
    gradientColor: [COLORS.password, COLORS.gradient],
    navigate: ''
  };
  constructor(){
    super();
    this.onPressBack = this.onPressBack.bind(this);
  }
  onPressBack(){
    const{navigate} =this.props;
    if(navigate !== ''){
      navigateToScreen(navigate);
    }
    else{
      Actions.pop();
    }
  }
  render() {
    const {
      isBack ,
      title,
      rightRender,
      isGradient,
      gradientColor
    } = this.props;
    let style = styles.linearGradient;
    if (isGradient) {
      style = {
        ...style,
        shadowColor: COLORS.buttonShadow,
        shadowOffset: {
          width: 0,
          height: 6
        },
        shadowOpacity: 0.39,
        shadowRadius: 8.30,
        elevation: 8
      };
    }

    return (
      <LinearGradient colors={isGradient ? gradientColor : [COLORS.white, COLORS.white]} start={{ x: 0, y: 2 }} end={{ x: 1, y: 0 }}
        style={[style]}
        locations={[0,1]}
      >
        <ElevatedView style={{
          flexDirection :'row',
          paddingTop : pdaStyleSheet.toolbarPaddingTop,
          height: Platform.OS === 'ios' ? 90 : 60,
        }}
        >
          {
            isBack ?
              <View style={{ justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: 0, bottom: 0, marginTop : pdaStyleSheet.toolbarPaddingTop, zIndex: 2}} >
                <ButtonWithIcon
                  rippleBorderRadius = {verticalScale(25)}
                  containerStyle ={[styles.defaultContainerStyle]}
                  iconSize={25}
                  iconName={'left-arrow'}
                  iconColor={COLORS.white}
                  onPress={this.onPressBack}
                  isLight={true}
                />
              </View>
              :null
          }

          < View style = {{
            justifyContent: 'center',
            marginHorizontal: verticalScale(isBack ? 20 :0),
            paddingLeft: verticalScale(isBack ? 30 : 10)
          }}
          >
            <Text style={[styles.toolbarTitle,{fontSize:TEXT_SIZE.TOOLBAR_TITLE, fontFamily:FONT_FAMILY.NORMAL}]}
              numberOfLines={1}
            >{title}</Text>
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, right: 0, bottom: 0 , marginTop : pdaStyleSheet.toolbarPaddingTop, zIndex: 2}} >
            {rightRender}
          </View>
        </ElevatedView>
      </LinearGradient>
    );
  }
}
