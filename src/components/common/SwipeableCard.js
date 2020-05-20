import React, {Component} from 'react';
import {
  Animated,
  PanResponder,
  View,
  Dimensions
} from 'react-native';
import PropTypes from 'prop-types';

export class SwipeableCard extends Component {
    static propTypes = {
      children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
      ]).isRequired,
      style: PropTypes.object,
      onDismiss: PropTypes.func
    }
    constructor(props) {
      super(props);
      this.translateX = new Animated.Value(0);
      this.panResponder = PanResponder.create({
        onMoveShouldSetResponderCapture: () => true,
        onMoveShouldSetPanResponderCapture: () => true,
        onPanResponderMove: Animated.event([null, {
          dx: this.translateX
        }]),
        onPanResponderRelease: (e, {
          vx,
          dx
        }) => {
          const screenWidth = Dimensions.get('window').width;
          if (Math.abs(vx) >= 0.5 || Math.abs(dx) >= 0.5 * screenWidth) {
            Animated.timing(this.translateX, {
              // toValue: dx > 0 ? screenWidth : -screenWidth,
              toValue: 0,
              duration: 200
            }).start(this.props.onDismiss);
          } else {
            Animated.spring(this.translateX, {
              toValue: 0,
              bounciness: 10
            }).start();
          }
        }
      });
    }
    render() {
      return (
        <View>
          <Animated.View
            style={[{transform: [{translateX: this.translateX}]},this.props.style]} {...this.panResponder.panHandlers}
          >
            {this.props.children}
          </Animated.View>
        </View>

      );
    }
}