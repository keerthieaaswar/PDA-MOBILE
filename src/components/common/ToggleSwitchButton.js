import React, { Component } from 'react';
import { View, Text } from 'react-native';
import SwitchToggle from 'react-native-switch-toggle';
import { myLog } from '../../utils/StaticFunctions';
import { verticalScale } from '../../theme/pdaStyleSheet';

export default class ToggleSwitchButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const{
      switchOn,
      circleColorOff,
      circleColorOn,
      size,
      onPress
    } =this.props;
    return (
      <View>
        <SwitchToggle
          containerStyle={{
            marginTop: 16,
            width: 47,
            height: 24,
            borderRadius: 19,
            padding: 0,
            borderColor:switchOn ? '#46b051':'#717171',
            borderWidth:1.75
          }}
          circleStyle={{
            width: 24,
            height: 24,
            borderRadius: 19
          }}
          switchOn={switchOn}
          onPress={onPress}
          circleColorOff={circleColorOff}
          circleColorOn={circleColorOn}
          duration={200}
          backgroundColorOn = {'white'}
          backgroundColorOff = {'white'}
        />
      </View>
    );
  }
}
