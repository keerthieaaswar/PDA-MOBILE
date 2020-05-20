import React, {PureComponent} from 'react';
import { View, Text } from 'react-native';
import Ripple from './rippleEffect';
import PropTypes from 'prop-types';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import { COLORS } from '../../constants/Color';
import { TEXT_TYPE, verticalScale } from '../../theme/pdaStyleSheet';
import Spinner from 'react-native-spinkit';
import CustomIcon from './CustomIcon';
let style = {
  defaultContainerStyle :  {
    paddingHorizontal : verticalScale(10),
    paddingVertical : verticalScale(2),
    flexDirection : 'row',
    marginVertical : verticalScale(5),
    alignItems: 'center'
  },
  defaultTextStyle : {
    padding : verticalScale(5),
    textAlign : 'center'

  }
};
export default class ButtonWithIcon extends PureComponent {

   static propTypes = {
     textStyle : PropTypes.any,
     containerStyle : PropTypes.any,
     name : PropTypes.string,
     onPress : PropTypes.func,
     iconName : PropTypes.string,
     isLight : PropTypes.bool,
     isSolid : PropTypes.bool,
     iconSize : PropTypes.number,
     iconColor : PropTypes.string,
     imageContainerStyle : PropTypes.any,
     imageStyle : PropTypes.any,
     iconPosition:  PropTypes.oneOf(['left', 'right']),
     disabled: PropTypes.bool,
     rippleBorderRadius: PropTypes.number,
     disabledRipple: PropTypes.bool,
     textPosition: PropTypes.oneOf(['horizontal', 'vertical'])
   }

   static defaultProps = {
     textStyle : style.defaultTextStyle,
     containerStyle : style.defaultContainerStyle,
     name : '',
     iconName : '',
     onPress : ()=> {},
     isLight : false,
     isSolid : false,
     iconSize : 25,
     iconColor : COLORS.grayLight,
     imageContainerStyle : {},
     imageStyle : {},
     iconPosition: 'left',
     disabled: false,
     disabledRipple: false,
     rippleBorderRadius: verticalScale(40),
     textPosition: 'horizontal'
   };

   renderIcon(disabled, imageStyle, iconSize, iconColor, iconName, isSolid, isLight){
     if (disabled) {
       return (
         <Spinner
           color={iconColor}
           type="Wave"
           size={iconSize}
         />
       );
     }else{
       return(
         <CustomIcon
           style={imageStyle}
           size={iconSize}
           color={iconColor}
           name={iconName}
           solid={isSolid}
           light={isLight}
         />
       );
     }

   }
   render() {
     const {
       textStyle,
       containerStyle,
       name,
       iconName,
       isLight,
       isSolid,
       iconSize,
       iconColor,
       imageContainerStyle,
       imageStyle,
       iconPosition,
       disabled,
       disabledRipple,
       rippleBorderRadius,
       onPress,
       textPosition
     } = this.props;
     return (
       <Ripple
         rippleOpacity={disabledRipple ? 0:0.30}
         disabled = {disabled}
         onPress={onPress}
         rippleContainerBorderRadius={rippleBorderRadius}
       >
         <View
           style={[style.defaultContainerStyle, containerStyle,{flexDirection: textPosition === 'horizontal' ? 'row':'column' }]}
         >
           {((iconName !== '' && iconPosition === 'left')|| (disabled && iconPosition === 'left')) ?
             <View style={imageContainerStyle}>
               {this.renderIcon(disabled, imageStyle, iconSize, iconColor, iconName, isSolid, isLight)}
             </View>
             : null}
           {
             (name !== '' && textPosition === 'horizontal' && !disabled) ?
               <Text style={[style.defaultTextStyle, TEXT_TYPE.H2, textStyle]} numberOfLines={1} >{name}</Text>
               : null
           }
           {((iconName !== '' && iconPosition === 'right')|| (disabled && iconPosition === 'right')) ?
             <View style={imageContainerStyle}>
               {this.renderIcon(disabled, imageStyle, iconSize, iconColor, iconName, isSolid, isLight)}
             </View>
             : null}
         </View>
         {
           (name !== '' && textPosition === 'vertical' && !disabled) ?
             <Text style={[style.defaultTextStyle, TEXT_TYPE.H2, textStyle]} numberOfLines={1} >{name}</Text>
             : null
         }
       </Ripple>
     );
   }
}
