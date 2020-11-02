/**
 * pda
 * BellIcon.js
 * @author PDA
 * @description Created on 27/02/2019
 * Copyright © 2019 pda. All rights reserved.
 */
import React, { PureComponent } from 'react';
import {
  View
} from 'react-native';
import ButtonWithIcon from './ButtonWithIcon';
import PropTypes from 'prop-types';
import { verticalScale } from '../../theme/pdaStyleSheet';
import { navigateToScreen } from '../../utils/StaticFunctions';
import { COLORS } from '../../constants/Color';

class BellIcon extends PureComponent {

  static propTypes = {
    color : PropTypes.string,
    isUnReadNotification: PropTypes.bool
  };

  static defaultProps = {
    color:COLORS.saveButtonColor,
    isUnReadNotification: false
  };

  constructor(){
    super();
    this.onNotificationPress = this.onNotificationPress.bind(this);
  }
  onNotificationPress(){
    navigateToScreen('NotificationScreen');
  }
  render(){
    const {
      color,
      isUnReadNotification
    } = this.props;
    return (
      <View>
        <ButtonWithIcon
          iconSize={verticalScale(25)}
          iconName='icon-notification'
          isSolid={true}
          iconColor={color}
          onPress={this.onNotificationPress}
        />
        {
          isUnReadNotification ?
            <View style={{
              backgroundColor: COLORS.unReadNotification,
              height: verticalScale(10),
              width: verticalScale(10),
              borderRadius: verticalScale(5),
              position: 'absolute',
              right:verticalScale(7),
              top:verticalScale(10)
            }}
            />:null
        }
      </View>
    );
  }
}

export default BellIcon;
