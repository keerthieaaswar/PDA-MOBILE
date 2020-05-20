/**
 * pda
 * Button.js
 * @author Socion Advisors LLP
 * @description Created on 27/02/2019
 * Copyright © 2019 pda. All rights reserved.
 */
import LinearGradient from 'react-native-linear-gradient';
import React, {Component} from 'react';
import {
  Text,
  StyleSheet
} from 'react-native';
import Ripple from './rippleEffect';
import PropTypes from 'prop-types';
import Spinner from 'react-native-spinkit';
import { TEXT_TYPE, verticalScale } from '../../theme/pdaStyleSheet';
import { COLORS } from '../../constants/Color';

const styles = StyleSheet.create({
  linearGradient: {
    borderRadius: 5
  },
  defaultTextStyle: {
    textAlign: 'center',
    color: COLORS.white
  },
  containerStyle : {
    paddingHorizontal: verticalScale(20),
    paddingVertical: verticalScale(15),
    alignItems:'center',
    justifyContent:'center'
  }
});

class Button extends Component{

  static propTypes = {
    isGradient: PropTypes.bool,
    containerStyle: PropTypes.object,
    isLoading: PropTypes.bool,
    textStyle: PropTypes.object || PropTypes.array,
    name: PropTypes.string,
    rippleColor: PropTypes.string,
    disabled: PropTypes.bool,
    onPress: PropTypes.func,
    borderWidth: PropTypes.number
  };

  static defaultProps = {
    isGradient: true,
    containerStyle: styles.containerStyle,
    isLoading: false,
    borderWidth: 1,
    textStyle: {},
    name:'',
    rippleColor:COLORS.buttonRipple,
    disabled: false,
    onPress:()=>{}
  };


  renderLoadingView() {
    return (
      <Spinner
        color={COLORS.white}
        type="Wave"
        size={25}
      />
    );
  }
  render (){
    const {
      textStyle,
      name,
      rippleColor,
      disabled,
      containerStyle,
      isGradient,
      onPress,
      isLoading,
      borderWidth
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
      <LinearGradient colors={isGradient ? [COLORS.password, COLORS.gradient] : [COLORS.white, COLORS.white]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        style={[style, { borderColor: COLORS.gradient, borderWidth: isGradient ? 0 : borderWidth, borderRadius: 5}]}
        locations={[0,1]}
      >
        <Ripple
          style={[styles.containerStyle, containerStyle]}
          rippleColor = {rippleColor}
          onPress={onPress}
          disabled = {disabled || isLoading}
        >
          { !isLoading ?
            <Text style={[styles.defaultTextStyle, TEXT_TYPE.H3, textStyle]} numberOfLines={1} >{name}</Text>
            :
            this.renderLoadingView()
          }
        </Ripple>
      </LinearGradient>
    );

  }
}

export default Button;
