/**
 * pda
 * AddTopicModel.js
 * @author PDA
 * @description Created on 11/06/2019
 * Copyright © 2019 pda. All rights reserved.
 */
import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Modal,
  ScrollView
} from 'react-native';
import ButtonWithIcon from './ButtonWithIcon';
import { verticalScale, deviceHeight, TEXT_TYPE, FONT_FAMILY } from '../../theme/pdaStyleSheet';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { myLog } from '../../utils/StaticFunctions';
import { stringsConvertor } from '../../utils/I18n';
import { COLORS } from '../../constants/Color';
const styles = StyleSheet.create({
  modelBottomButton:{
    borderRadius:verticalScale(25),
    height:verticalScale(40),
    width:verticalScale(40)
  },
  ModelBottomView:{
    flexDirection:'row',
    justifyContent:'flex-end',
    marginBottom:verticalScale (25)
  }
});
let isVideoIcon = false;
let isImageIcon = false;
let isPdfIcon = false;
export default class AddTopicModel extends Component{
    static propTypes = {
      onCancelPress : PropTypes.func,
      onSavePress:PropTypes.func,
      visible: PropTypes.bool,
      data: PropTypes.object
    }
      static defaultProps = {
        onCancelPress : ()=>{},
        onSavePress:()=>{},
        visible: false,
        data: {}
      }
      constructor(props){
        super(props);
      }

      renderIcon(type){
        myLog(':::renderIcon::', type);
        let path = '';
        switch (type) {
          case 'Video':
            if (isVideoIcon === false) {
              path = require('../../assets/Images/video.png');
              isVideoIcon = true;
            }
            break;
          case 'Image':
            if (isImageIcon === false) {
              path = require('../../assets/Images/imageView.png');
              isImageIcon = true;
            }
            break;
          case 'Document':
            if (isPdfIcon === false) {
              path = require('../../assets/Images/pdf.png');
              isPdfIcon = true;
            }
            break;
        }
        return( path === '' ? null :
          <View style={{padding:5}}>
            <Image
              source={path}
              resizeMode="cover"
            />
          </View>
        );
      }
      renderAddTopicModel(){
        const{
          onCancelPress,
          onSavePress,
          data
        } = this.props;
        myLog('Add Topic', data);
        const name = _.has(data.topic, 'name') ? data.topic.name : '';
        const description = _.has(data.topic, 'description') ? data.topic.description : '';
        const program = _.has(data.program, 'name') ? data.program.name : '';
        const content = _.has(data, 'content') ? data.content : [];
        const entityName = _.has(data.program,'entityName') ? data.program.entityName : '';
        isVideoIcon = false;
        isImageIcon = false;
        isPdfIcon = false;
        myLog('Add name, description program content', name, description, program, content);
        return(
          <View style={{paddingTop:verticalScale(40),paddingHorizontal:verticalScale(30),backgroundColor:COLORS.white}}>
            <Text style={[TEXT_TYPE.H6,{fontFamily:FONT_FAMILY.BOLD,color:COLORS.textColor}]}>{stringsConvertor('session.addTopic')}</Text>
            <Text style={[TEXT_TYPE.H10,{marginTop:verticalScale(35),color:COLORS.cancelText,fontSize:verticalScale(17)}]}>{stringsConvertor('session.topic')}</Text>
            <Text style={[TEXT_TYPE.H3,{paddingVertical:verticalScale(5),fontFamily:FONT_FAMILY.BOLD,color:COLORS.shadowColor}]}>{name}</Text>
            <Text style={[TEXT_TYPE.H10,{marginVertical:verticalScale(10),color:COLORS.cancelText,fontSize:verticalScale(17)}]}>{stringsConvertor('session.description')}</Text>
            <Text style={[TEXT_TYPE.H1,{paddingVertical:verticalScale(5),color:COLORS.textColor,fontSize:verticalScale(15)}]}numberOfLines={4}>{description}</Text>
            <Text style={[TEXT_TYPE.H10,{paddingVertical:verticalScale(10),fontSize:verticalScale(17)}]}>{stringsConvertor('session.entity')}</Text>
            <Text style={[TEXT_TYPE.H3,{paddingVertical:verticalScale(5),fontFamily:FONT_FAMILY.BOLD,color:COLORS.textColor}]}>{entityName}</Text>
            <Text style={[TEXT_TYPE.H10,{paddingVertical:verticalScale(10),fontSize:verticalScale(17)}]}>{stringsConvertor('session.program')}</Text>
            <Text style={[TEXT_TYPE.H3,{paddingVertical:verticalScale(5),fontFamily:FONT_FAMILY.BOLD,color:COLORS.textColor}]}>{program}</Text>
            <Text style={[TEXT_TYPE.H10,{paddingVertical:verticalScale(10),marginTop:verticalScale(8),color:COLORS.cancelText,fontSize:verticalScale(18)}]}>{stringsConvertor('session.content')}</Text>
            <View style={{flexDirection:'row'}}>
              { _.map(content,(item)=>{
                return this.renderIcon(item.contentType);
              })}
            </View>
            <View style={[styles.ModelBottomView,{marginTop:verticalScale(20)}]}>
              <View style={{marginHorizontal: verticalScale(20)}}>
                <ButtonWithIcon
                  //containerStyle ={[styles.modelBottomButton,{backgroundColor:COLORS.cancelButtonText,alignItem:'center', justifyContent:'center'}]}
                  iconSize={verticalScale(30)}
                  iconColor={COLORS.red}
                  iconName='error'
                  onPress={onCancelPress}
                  isLight={true}
                />
              </View>
              <ButtonWithIcon
                //containerStyle ={[styles.modelBottomButton,{backgroundColor:COLORS.checkButton,alignItem:'center', justifyContent:'center'}]}
                iconSize={verticalScale(30)}
                iconColor={COLORS.greenTick}
                iconName='tick-icon'
                onPress={onSavePress}
                isLight={true}
              />
            </View>
          </View>
        );
      }
      render(){
        const {
          visible
        } = this.props;
        return(
          <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
          >
            <View style={{height: deviceHeight, backgroundColor:COLORS.modalBackground}}>
              <ScrollView style={{height:verticalScale(440)}}contentContainerStyle={{flexGrow:1}}>
                {this.renderAddTopicModel()}
              </ScrollView>
            </View>
          </Modal>
        );
      }
}
