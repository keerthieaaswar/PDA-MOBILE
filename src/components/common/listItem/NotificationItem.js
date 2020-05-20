/**
 * pda
 * NotificationItem.js
 * @author Socion Advisors LLP
 * @description Created on 07/05/2019
 * Copyright © 2019 pda. All rights reserved.
 */

import React,{ PureComponent } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image
} from 'react-native';
import { COLORS } from '../../../constants/Color';
import { verticalScale, TEXT_TYPE } from '../../../theme/pdaStyleSheet';
import { myLog, convertDateToLocal } from '../../../utils/StaticFunctions';
import Swipeable from 'react-native-swipeable-row';
import PropTypes from 'prop-types';
import AlertModal from '../../../components/common/AlertModal';
import { stringsConvertor } from '../../../utils/I18n';
import Ripple from '../rippleEffect';
import { DATE_FORMAT } from '../../../constants/String';
import CustomIcon from '../CustomIcon';

const styles = StyleSheet.create({
  container:{
    paddingHorizontal:verticalScale(15),
    paddingVertical: verticalScale(20)
  },
  notificationView:{
    borderLeftWidth: verticalScale(5),
    borderLeftColor: COLORS.skyBlueDark,
    borderRadius: verticalScale(5),
    paddingHorizontal:verticalScale(10),
    paddingVertical: verticalScale(10),
    margin: verticalScale(10),
    backgroundColor:COLORS.notificationViewBackground
  },
  notificationViewUnread:{
    backgroundColor: COLORS.white
  },
  text:{
    paddingVertical:verticalScale(3)
  },
  rightSwipeItem: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: verticalScale(20)
  },
  leftSwipeItem: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: verticalScale(20)
  }
});

class NotificationItem extends PureComponent {
  static propTypes ={
    item: PropTypes.object,
    index:PropTypes.number,
    onPress: PropTypes.func,
    onDeletePress:PropTypes.func,
    onNotificationOnPress: PropTypes.func
  }

  static defaultProps ={
    onPress : ()=>{},
    onDeletePress: ()=>{},
    onNotificationOnPress: ()=>{}
  }
  constructor(props){
    super(props);
    this.state = {
      title:'',
      description:'',
      showAlert: false
    };
    this.onClose = this.onClose.bind(this);
    this.onSlide = this.onSlide.bind(this);
    this.onAlertSuccessPress = this.onAlertSuccessPress.bind(this);
  }
  onClose(){
    myLog('onClose');
  }
  onSlide(){
    this.setState({
      name:'delete-icon',
      description:stringsConvertor('alertMessage.deleteNotification'),
      showAlert:true,
      alertType:'saveAndExit'});
  }
  onAlertSuccessPress(){
    const {onDeletePress} = this.props;
    this.setState({showAlert:false});
    onDeletePress();
  }

  renderNotificationDetailsView(item){
    let style = styles.notificationView;
    if (item.unRead === true) {
      style = {...styles.notificationView, ...styles.notificationViewUnread };
    }
    return(
      <View style={style}>
        <Text style={[styles.text,TEXT_TYPE.H4,{color:COLORS.fontColor}]} numberOfLines={1}>{item.sessionName}</Text>
      </View>
    );
  }
  renderView(item , index){
    let path=require('../../../assets/Images/user.png');
    switch(item.notificationType){
      case 'USER':
        path =require('../../../assets/Images/user.png');
        break;
      case 'ATTESTATION':
        path =require('../../../assets/Images/attestation.png');
        break;
      case 'SESSION':
        path =require('../../../assets/Images/session.png');
        break;
      case 'ATTENDANCE':
        path =require('../../../assets/Images/attendance.png');
        break;
    }
    const date =  convertDateToLocal(item.dateTime, DATE_FORMAT.DDMMMYYYYhhmmA);
    return(
      <View style={[styles.container,{backgroundColor: item.isRead !== true ? COLORS.notificationUnReadBackground:COLORS.white, borderTopColor:'#d3dfef', borderBottomColor:'#d3dfef', borderBottomWidth:0.2, borderTopWidth: 0.2}]}>
        <View style={{flex:1, flexDirection:'row'}}>
          <View style={{alignItems:'center',justifyContent:'center'}}>
            <View style={{width:45,height:45,borderRadius:45/2,backgroundColor:COLORS.notificationPathBackgroundColor,alignItems:'center',justifyContent:'center'}}>
              <Image source ={path} />
            </View>
          </View>
          <View style={{flex:1, paddingHorizontal:verticalScale(20)}}>
            <Text style={[styles.text,TEXT_TYPE.H3,{color:COLORS.fontColor}]}>{item.description}</Text>
            <View style={{}}>
              <Text style={[styles.text,TEXT_TYPE.H1,{color:COLORS.borderColorEditProfile}]} numberOfLines={1}>{date}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
  renderAlertModel(){
    const{
      name,
      description,
      showAlert
    }=this.state;
    return(
      <AlertModal
        icon={name}
        description = {description}
        visible = {showAlert}
        onSuccessPress={this.onAlertSuccessPress}
        onCancelPress={()=>{
          myLog('----onClose Called---');
          this.setState({showAlert: false});
        }}
        onClosePress={()=>{
          myLog('----onClose Called---');
          this.setState({showAlert: false});
        }}
      />
    );
  }
  render(){
    const {
      item,
      index,
      onNotificationOnPress
    } = this.props;
    myLog('--', item);
    return  (
      <Swipeable
        onLeftActionRelease ={this.onSlide}
        onRightActionRelease ={this.onSlide}
        rightContent={(
          <View style={[styles.rightSwipeItem, {backgroundColor:COLORS.red}]}>
            <View style={{width:verticalScale(60), alignItems:'center', justifyContent:'center'}}>
              <CustomIcon
                size={verticalScale(30)}
                color={'white'}
                name={'delete-icon'}
                light
              />
            </View>
          </View>
        )}
        onRightActionDeactivate={this.onClose.bind(this)}
      >
        <Ripple onPress={()=>{
          onNotificationOnPress(index);
        }}
        >
          {this.renderView(item, index)}
          {this.renderAlertModel()}
        </Ripple>
      </Swipeable>
    );
  }
}
export default NotificationItem;