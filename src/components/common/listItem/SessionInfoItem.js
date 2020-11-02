/**
 * pda
 * SessionInfoItem.js
 * @author PDA
 * @description Created on 16/04/2019
 * Copyright © 2019 pda. All rights reserved.
 */

import React, { PureComponent } from 'react';
import {
  View,
  Text
} from 'react-native';
import PropTypes from 'prop-types';
import { verticalScale, TEXT_TYPE, FONT_FAMILY } from '../../../theme/pdaStyleSheet';
import { COLORS } from '../../../constants/Color';
import ButtonWithIcon from '../ButtonWithIcon';
import { stringsConvertor } from '../../../utils/I18n';
import { getNumberOfLines } from '../../../utils/StaticFunctions';

class SessionInfoItem extends PureComponent {

  static propTypes ={
    item:PropTypes.object,
    index:PropTypes.number
  }
  static defaultProps ={
    item:{},
    index:0
  }
  constructor(props){
    super(props);
    this.state={
      isReadMore:false,
      descLength: 0
    };
    this.onReadPress = this.onReadPress.bind(this);
  }
  onReadPress(){
    this.setState((prevState) =>{
      return{
        isReadMore:!prevState.isReadMore
      };
    });
  }
  render(){
    const {
      item,
      index
    } = this.props;
    const {
      isReadMore,
      descLength
    } = this.state;
    if(item.title === stringsConvertor('attestation.sessionDescription')){
      const descriptionLength = getNumberOfLines(item.value,3/5);
      this.setState({descLength:descriptionLength});
    }
    return(
      <View style={{flex: 1, flexDirection:'row', paddingHorizontal: verticalScale(15), paddingVertical: verticalScale(20), backgroundColor: index % 2 === 0 ? '#fef1e2' : '#f8e4cb' }}>
        <Text style={[{flex:2, color:COLORS.fontColor,paddingRight:30}]}>{item.title}</Text>
        {
          isReadMore ?
            <View style={{flex:3}}>
              <Text style={[TEXT_TYPE.H1,{flex:3,color:COLORS.fontColor,textAlign:'justify'}]}>{item.value}</Text>
              {
                item.title === stringsConvertor('attestation.sessionDescription')?
                  <View style={{marginLeft:verticalScale(-15),marginRight:verticalScale(60)}}>
                    <ButtonWithIcon
                      onPress={this.onReadPress}
                      name={stringsConvertor('session.readLess')}
                      textStyle={[TEXT_TYPE.H1,{color:COLORS.sessionButton}]}
                    />
                  </View>
                  :null
              }
            </View>:
            <View style={{flex:3}}>
              {item.title === stringsConvertor('attestation.sessionDescription')?
                <Text style={[TEXT_TYPE.H1,{color:COLORS.fontColor}]} numberOfLines={4}>{item.value}</Text>:
                <Text style={[TEXT_TYPE.H1,{color:COLORS.fontColor}]}>{item.value}</Text>
              }
              {
                item.title === stringsConvertor('attestation.sessionDescription') && descLength > 4?
                  <View style={{marginLeft:verticalScale(-15),marginRight:verticalScale(60)}}>
                    <ButtonWithIcon
                      onPress={this.onReadPress}
                      name={stringsConvertor('session.readMore')}
                      textStyle={[TEXT_TYPE.H1,{color:COLORS.sessionButton}]}
                    />
                  </View>
                  :null
              }
            </View>
        }
      </View>
    );
  }

}

export default SessionInfoItem;
