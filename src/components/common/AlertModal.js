import React, { PureComponent } from 'react';
import {
  Text,
  View,
  Modal,
  Dimensions,
  ViewPropTypes
} from 'react-native';
import PropTypes from 'prop-types';
import { verticalScale, TEXT_TYPE } from '../../theme/pdaStyleSheet';
import ButtonWithIcon from './ButtonWithIcon';
import { COLORS } from '../../constants/Color';
import CustomIcon from './CustomIcon';
const width = Dimensions.get('screen').width;

export default class AlertModal extends PureComponent{
  static propTypes = {
    icon : PropTypes.string,
    title : PropTypes.string,
    description : PropTypes.string,
    cancelButtonContainer : ViewPropTypes.style,
    onClosePress: PropTypes.func,
    onSuccessPress: PropTypes.func,
    onCancelPress: PropTypes.func,
    visible: PropTypes.bool,
    isIcon: PropTypes.bool,
    confirmName: PropTypes.string
  }

  static defaultProps = {
    onClosePress:()=>{},
    onSuccessPress:()=>{},
    onCancelPress:()=>{},
    icon:'trash-alt',
    title:'',
    description:'',
    visible: false,
    isIcon: true,
    confirmName: 'Delete'
  }


  renderModal(){
    const{
      description,
      onCancelPress,
      onSuccessPress,
      icon,
      isIcon,
      confirmName,
      title
    } = this.props;
    return(
      <View style={{margin: verticalScale(30), backgroundColor:COLORS.white,
        borderRadius: verticalScale(5), overflow:'hidden', width:(width/100)*90}}
      >
        <View style={{padding: 5}}>
          <Text style={[TEXT_TYPE.H5,{color:COLORS.black, padding:10}]}>{title}</Text>
          <View style={{paddingVertical: verticalScale(5), paddingLeft: verticalScale(20),flexDirection:'row'}}>
            {isIcon ? <View style={{paddingTop:verticalScale(13)}}>
              <CustomIcon
                size={verticalScale(25)}
                color={COLORS.red}
                name={icon}
                light
              />
            </View>:null}
            <View style={{paddingLeft:20}}>
              <Text style={[TEXT_TYPE.H3,{color:COLORS.black, paddingTop:10}]}>{description}</Text>
            </View>
          </View>
        </View>

        <View style={{
          flexDirection:'row',
          justifyContent:'flex-end',
          alignItems:'center',
          paddingHorizontal: verticalScale(25),
          paddingBottom: verticalScale(15)
        }}
        >
          <ButtonWithIcon
            textStyle={[TEXT_TYPE.H4,{color:COLORS.titleColor}]}
            name="Cancel"
            onPress={()=>onCancelPress()}
          />
          <ButtonWithIcon
            textStyle={[TEXT_TYPE.H4,{color:COLORS.red}]}
            name={confirmName}
            onPress={()=>onSuccessPress()}
          />

        </View>
      </View>
    );
  }

  render() {
    const {
      visible,
      onClosePress
    } = this.props;
    const modalProps = {
      visible
    };
    return (
      <Modal
        animationType="fade"
        supportedOrientations={['portrait']}
        onRequestClose={() => onClosePress()}
        transparent={true}
        {...modalProps}
      >
        <View
          style={{flex:1, alignItems:'center', justifyContent:'center',backgroundColor:COLORS.placeholderTextColor}}
        >
          {this.renderModal()}
        </View>
      </Modal>
    );
  }
}
