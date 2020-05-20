import React from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';
import { verticalScale, TEXT_TYPE } from '../../../theme/pdaStyleSheet';
import { COLORS } from '../../../constants/Color';
import ElevatedView from '../ElevatedView';
import Ripple from '../rippleEffect';
import Icon from 'react-native-vector-icons/FontAwesome5Pro';
import PropTypes from 'prop-types';
import { myLog } from '../../../utils/StaticFunctions';
import { stringsConvertor } from '../../../utils/I18n';
import CustomIcon from '../CustomIcon';

const styles = StyleSheet.create({
  liveCardContainer:{
    backgroundColor: COLORS.white,
    borderColor: COLORS.liveCardBorder,
    borderWidth:verticalScale(1),
    marginBottom: verticalScale(-8),
    borderTopRightRadius: verticalScale(10),
    borderTopLeftRadius: verticalScale(10),
    marginHorizontal: verticalScale(10)
  },
  upComingCardContainer:{
    backgroundColor: COLORS.white,
    borderColor: COLORS.upComingBorder,
    borderWidth:verticalScale(1),
    marginBottom:verticalScale(-8),
    borderTopRightRadius: verticalScale(10),
    borderTopLeftRadius: verticalScale(10),
    marginHorizontal: verticalScale(10)
  },
  liveText:{
    color:COLORS.flashErrorColor
  },
  upComingText:{
    color: COLORS.upComingText
  },
  savedText:{
    color: COLORS.flashLoadingBackground
  }
});
class SessionItem extends React.Component {

  static propTypes = {
    item: PropTypes.object.isRequired,
    index: PropTypes.number,
    lastIndex:PropTypes.number,
    onPress:PropTypes.func
  }
  constructor(props){
    super(props);
    this.onPress = this.onPress.bind(this);
  }

  onPress(){
    this.props.onPress();
  }

  renderView(item, index, lastIndex){
    myLog('lastIndex',lastIndex);
    let containerStyle = {};
    let textStyle = {};
    let rippleColor = COLORS.flashLoadingBackground;
    let status = stringsConvertor('session.saved');
    switch (item.sessionProgress) {
      case 1:
        containerStyle = styles.liveCardContainer;
        textStyle = styles.liveText;
        rippleColor = COLORS.liveCardBorder;
        status = stringsConvertor('session.upcoming');
        break;
      case 2:
        containerStyle = styles.upComingCardContainer;
        textStyle = styles.upComingText;
        rippleColor = COLORS.liveRipple;
        status = stringsConvertor('session.live');
        break;
      default:
        break;
    }
    return(
      <ElevatedView elevation={4} style={[containerStyle,{flexDirection:'row', justifyContent:'space-between',
        flex:1,
        marginBottom: index === lastIndex ? 30:-8,
        borderBottomLeftRadius: index === lastIndex ? 10:0 ,
        borderBottomRightRadius: index === lastIndex ? 10:0
      }]}
      >
        <Ripple onPress={this.onPress} style={{flex:1,paddingTop: verticalScale(10),paddingHorizontal: verticalScale(10), paddingBottom: index === lastIndex ? verticalScale(30):verticalScale(10)}} rippleColor={rippleColor}>
          <View style={{alignItems:'center', flexDirection:'row'}}>
            <CustomIcon
              name='circle'
              size={10}
              color={rippleColor}
              solid={true}
              style={{paddingHorizontal:5}}
            />
            <Text style={[TEXT_TYPE.H1]}>{status}</Text>
          </View>
          <View style={{flex:1, paddingVertical: verticalScale(5), paddingHorizontal: verticalScale(5)}}>
            <Text style={[TEXT_TYPE.H3,{color:COLORS.black}]} numberOfLines={2}>{item.sessionName}</Text>
          </View>
        </Ripple>
      </ElevatedView>
    );
  }

  render(){
    const {
      item,
      lastIndex,
      index
    } = this.props;
    return(
      this.renderView(item, index, lastIndex)
    );
  }
}

export default SessionItem;