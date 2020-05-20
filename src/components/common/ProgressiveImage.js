/**
 * pda
 * ProgressiveImage.js
 * @author Socion Advisors LLP
 * @description Created on 19/03/2019
 * Copyright © 2019 pda. All rights reserved.
 */
import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Spinner from 'react-native-spinkit';
import PropTypes from 'prop-types';
import { COLORS } from '../../constants/Color';
const styles = StyleSheet.create({
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0
  },
  container: {
    backgroundColor: COLORS.white
  }
});

class ProgressiveImage extends React.PureComponent {
  static propTypes ={
    thumbnailSource: PropTypes.number,
    source: PropTypes.number,
    style: PropTypes.object
  }
  static defaultProps ={
    thumbnailSource: 0,
    source: 0,
    style: {}
  }
  constructor(props){
    super(props);
    this.state = {
      isLoading : true
    };
  }
  thumbnailAnimated = new Animated.Value(0);

  imageAnimated = new Animated.Value(0);

  handleThumbnailLoad = () => {
    this.setState({isLoading:false},()=>{
      Animated.timing(this.thumbnailAnimated, {
        toValue: 1
      }).start();
    });
  }

  onImageLoad = () => {
    Animated.timing(this.imageAnimated, {
      toValue: 1
    }).start();
  }

  render() {
    const {
      thumbnailSource,
      source,
      style,
      ...props
    } = this.props;

    const {
      isLoading
    } = this.state;
    return (
      <View style={styles.container}>
        <Animated.Image
          {...props}
          source={thumbnailSource}
          style={[style, { opacity: this.thumbnailAnimated }]}
          onLoad={this.handleThumbnailLoad}
          blurRadius={1}
        />
        <Animated.Image
          {...props}
          source={source}
          style={[styles.imageOverlay, { opacity: this.imageAnimated }, style]}
          onLoad={this.onImageLoad}
        />
        <View style={{position:'absolute',top:0,bottom:0,left:0,right:0}}>
          <View style={{flex:1, alignItems:'center', justifyContent: 'center'}}>
            <Spinner
            // style={}
              isVisible={isLoading}
              size={30}
              type={'Circle'}
              color={COLORS.red}
            />
          </View>
        </View>
      </View>
    );
  }
}
export default ProgressiveImage;
