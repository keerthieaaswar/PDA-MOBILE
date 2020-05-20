import React, { Component } from 'react';
import { TextField } from 'react-native-material-textfield';
import PropTypes from 'prop-types';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import ButtonWithIcon from './ButtonWithIcon';
import { verticalScale, TEXT_TYPE } from '../../theme/pdaStyleSheet';
import { COLORS } from '../../constants/Color';
import CustomIcon from './CustomIcon';
import { myLog } from '../../utils/StaticFunctions';

class TextInput extends Component {

  static propTypes = {
    label : PropTypes.string,
    baseColor: PropTypes.string,
    tintColor: PropTypes.string,
    keyboardType: PropTypes.string,
    onChangeText: PropTypes.func,
    secureTextEntry: PropTypes.bool,
    textColor: PropTypes.string,
    value: PropTypes.string,
    editable: PropTypes.bool,
    error: PropTypes.string,
    maxLength: PropTypes.number,
    onSubmitEditing: PropTypes.func,
    rightViewType: PropTypes.string,
    style: PropTypes.array || PropTypes.object,
    prefixText: PropTypes.string
  };

  static defaultProps = {
    label : '',
    baseColor: COLORS.gray,
    tintColor: COLORS.tintColor,
    keyboardType: 'default',
    secureTextEntry: false,
    onChangeText: ()=>{},
    textColor:COLORS.tintColor,
    value:'',
    editable: true,
    error:'',
    maxLength: 250,
    onSubmitEditing: ()=>{},
    rightViewType:'',
    prefixText:'',
    multiline: false
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: props.secureTextEntry
    };
    this.onShowPasswordPress = this.onShowPasswordPress.bind(this);
    
  }

  onShowPasswordPress(){
    this.setState({
      visible: !this.state.visible
    });
  }

  focus(){
    this.TextInput.focus();
  }

  renderSuccess(type, visible){
    let renderView = null;
    if (type === 'success') {
      renderView = (
        <CustomIcon
          style={{margin:verticalScale(5),marginRight:verticalScale(13)}}
          size={verticalScale(8)}
          color={COLORS.checkCircleColor}
          name='tick-icon'
          solid
        />);
    }else if (type === 'password') {
      renderView = (
        <ButtonWithIcon
          containerStyle={{marginVertical:verticalScale(0)}}
          iconSize={verticalScale(14)}
          iconName='eye'
          isSolid={true}
          iconColor={visible? COLORS.eyeIconColor: COLORS.checkCircleColor}
          onPress={this.onShowPasswordPress}
        />);
    }
    return renderView;
  }
  render() {
    const {
      label,
      baseColor,
      tintColor,
      keyboardType,
      onChangeText,
      textColor,
      value,
      editable,
      error,
      maxLength,
      onSubmitEditing,
      rightViewType,
      style,
      prefixText,
      multiline
    } = this.props;
    const {
      visible
    } = this.state;
    myLog('errorCheck+UYhH+HHHHH==-------------------===========',this.props);
    return (
      <TextField
        ref={(ref) => this.TextInput = ref}
        label={label}
        baseColor={baseColor}
        tintColor={tintColor}
        style={[TEXT_TYPE.H2,style]}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        textColor={textColor}
        value={value}
        editable={editable}
        secureTextEntry ={visible}
        renderAccessory={()=>this.renderSuccess(rightViewType, visible)}
        error={error}
        maxLength={maxLength}
        onSubmitEditing={onSubmitEditing}
        prefix={prefixText}
        multiline={multiline}
      />
    );
  }
}

export default TextInput;