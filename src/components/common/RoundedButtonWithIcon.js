import React, {PureComponent} from 'react';
import { View } from 'react-native';
import Ripple from './rippleEffect';
import PropTypes from 'prop-types';
import { COLORS } from '../../constants/Color';
import { verticalScale } from '../../theme/pdaStyleSheet';
import CustomIcon from './CustomIcon';
function elevationShadowButtonStyle(elevation) {
  return {
    elevation,
    shadowColor: 'black',
    shadowOffset: { width: 2, height: 0.7 * elevation },
    shadowOpacity: 0.19 * elevation,
    shadowOpacity: 0.4
  };
}
let style = {
  defaultButtonStyle:{
    width: 33,
    height:33,
    borderRadius:33/2,
    backgroundColor:'white',
    alignItems:'center',
    justifyContent:'center'
  },
  buttonShadow:{
    ...elevationShadowButtonStyle(5)

  }
};
export default class RoundedButtonWithIcon extends PureComponent {

   static propTypes = {
     textStyle : PropTypes.any,
     containerStyle : PropTypes.any,
     onPress : PropTypes.func,
     iconName : PropTypes.string,
     isLight : PropTypes.bool,
     iconSize : PropTypes.number,
     iconColor : PropTypes.string,
     disabled: PropTypes.bool,
     rippleBorderRadius: PropTypes.number,
     disabledRipple: PropTypes.bool
   }

   static defaultProps = {
     containerStyle : style.defaultContainerStyle,
     iconName : '',
     onPress : ()=> {},
     iconSize : 25,
     iconColor : COLORS.grayLight,
     disabled: false,
     disabledRipple: false,
     rippleBorderRadius: verticalScale(40)
   };

   renderIcon(iconSize, iconColor, iconName){
     return(
       <CustomIcon
         size={iconSize}
         color={iconColor}
         name={iconName}
       />
     );
   }
   render() {
     const {
       iconName,
       iconSize,
       iconColor,
       disabled,
       disabledRipple,
       rippleBorderRadius,
       onPress,
       containerStyle
     } = this.props;
     return (
       <Ripple
         rippleOpacity={disabledRipple ? 0:0.30}
         disabled = {disabled}
         onPress={onPress}
         rippleContainerBorderRadius={rippleBorderRadius}
       >
         {iconName !== '' ?
           <View style={[style.defaultButtonStyle,containerStyle, style.buttonShadow]}>
             {this.renderIcon(iconSize, iconColor, iconName,containerStyle)}
           </View>
           : null}
       </Ripple>
     );
   }
}
