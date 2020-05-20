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
import PropTypes from 'prop-types';
import { convertDateToLocal } from '../../../utils/StaticFunctions';
import { DATE_FORMAT } from '../../../constants/String';

const styles = StyleSheet.create({
  trainerContainer:{
    backgroundColor: COLORS.traineeBackground,
    borderColor: COLORS.attestationTrainerBorder,
    borderWidth:verticalScale(1),
    marginBottom:verticalScale(-8),
    borderTopRightRadius: verticalScale(10),
    borderTopLeftRadius: verticalScale(10),
    marginHorizontal: verticalScale(10)
  },
  traineeContainer:{
    backgroundColor:COLORS.otherBackground,
    borderColor: COLORS.attestationTraineeBorder,
    borderWidth:verticalScale(1),
    marginBottom:verticalScale(-8),
    borderTopRightRadius: verticalScale(10),
    borderTopLeftRadius: verticalScale(10),
    marginHorizontal: verticalScale(10)
  },
  dateText:{
    color:COLORS.attestationDateColor
  }
});
class AttestationItem extends React.Component {

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
    // myLog('lastIndex',lastIndex);
    let containerStyle = {};
    let textStyle = {};
    let rippleColor = COLORS.tabAttestationBackground;
    switch(item.role ? item.role.toUpperCase():''){
      case 'PARTICIPANT':
        containerStyle = styles.traineeContainer;
        textStyle = styles.dateText;
        rippleColor =  COLORS.red ;
        break;
      default:
        containerStyle = styles.trainerContainer;
        textStyle = styles.dateText;
        rippleColor = COLORS.flashErrorColor;
        break;
    }

    const date =  convertDateToLocal(item.attestationDate, DATE_FORMAT.DDMMMYYYY);
    return(
      <ElevatedView elevation={4} style={[ containerStyle,{flexDirection:'row', justifyContent:'space-between',
        flex:1,
        marginBottom: index === lastIndex ? 30:-8,
        borderBottomLeftRadius: index === lastIndex ? 10:0 ,
        borderBottomRightRadius: index === lastIndex ? 10:0,
        backgroundColor: item.role === 'TRAINEE' ? COLORS.traineeBackground:COLORS.otherBackground
      }]}
      >
        <Ripple onPress={this.onPress} style={{flex:1,padding: verticalScale(20), flexDirection:'row', alignItems: 'center',paddingBottom: index === lastIndex ? verticalScale(50):verticalScale(20)}} rippleColor={rippleColor}>
          <View style={{flex:1, paddingRight: verticalScale(10)}}>
            <Text style={[TEXT_TYPE.H3,textStyle]} numberOfLines={1}>{item.sessionName}</Text>
          </View>
          <View style={{alignItems:'center', flexDirection:'row'}}>
            <Text style={[TEXT_TYPE.H2,textStyle]}>{date}</Text>
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

export default AttestationItem;