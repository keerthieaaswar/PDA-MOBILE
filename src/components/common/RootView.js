import React, { Component } from 'react';
import{
  View,
  Image
} from 'react-native';
import { deviceWidth } from '../../theme/pdaStyleSheet';
import { COLORS } from '../../constants/Color';
import PropTypes from 'prop-types';

class RootView extends Component {
  static propTypes = {
    style: PropTypes.object,
    pointerEvents: PropTypes.string,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ])
  }
  static defaultProps = {
    pointerEvents: null
  }
  render(){
    const {
      children,
      style,
      pointerEvents
    } = this.props;
    return (
      <View style={[{backgroundColor:COLORS.white},style]} pointerEvents={pointerEvents}>
        {children}
        <View style={{position:'absolute', bottom:0, zIndex:-5}}>
          <View style={{backgroundColor:COLORS.white}}/>
        </View>
      </View>
    );
  }

}
export default RootView;
