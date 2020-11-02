/**
 * pda
 * Notification.js
 * @author PDA
 * @description Created on 07/05/2019
 * Copyright © 2019 pda. All rights reserved.
 */

import React,{ Component } from 'react';
import {
  View,
  Text,
  FlatList} from 'react-native';
import PropTypes from 'prop-types';
import { COLORS } from '../../../constants/Color';
import { stringsConvertor } from '../../../utils/I18n';
import NotificationItem from '../../common/listItem/NotificationItem';
import Toolbar from '../../common/Toolbar';
import { verticalScale } from '../../../theme/pdaStyleSheet';
import { myLog, navigateToScreen } from '../../../utils/StaticFunctions';
import Spinner from 'react-native-spinkit';
import BottomMenu from '../../common/BottomMenu';
import DeviceInfo from 'react-native-device-info';
import { PACKAGE } from '../../../constants/String';
import _ from 'lodash';
const pageSize = 15;
class Notification extends Component {

  static propTypes ={
    notifications: PropTypes.array,
    putNotificationStatus: PropTypes.func,
    setNotificationToInitial: PropTypes.func,
    getNotificationList: PropTypes.func,
    name: PropTypes.string,
    attestationInfoDetails: PropTypes.func
  }
  static defaultProps = {
    isNetworkConnected: false,
    putNotificationStatus: ()=>{},
    setNotificationToInitial: ()=>{},
    getNotificationList: ()=>{},
    attestationInfoDetails: ()=>{}
  }
  constructor(){
    super();
    this.state = {
      isLoading: false,
      pageNumber: 0,
      total: 0,
      refreshing: false,
      isLoadingMore: false
    };
    this.renderItem = this.renderItem.bind(this);
    this.onNotificationOnPress = this.onNotificationOnPress.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.onLoadMore = this.onLoadMore.bind(this);
  }
  componentDidMount(){
    this.props.setNotificationToInitial(()=>{
      this.setState({isLoading: true},()=>{
        this.notificationApiCall(1, pageSize, (status, response)=>{
          if (status === true) {
            this.setState({
              pageNumber: response.pageNumber,
              total: response.total
            });
          }
          this.setState({isLoading: false});
        });
      });
    });
  }

  onRefresh(){
    this.setState({refreshing: true},()=>{
      this.notificationApiCall(1, pageSize, (status, response)=>{
        myLog('-----', status, response);
        if (status === true) {
          this.setState({
            pageNumber: response.pageNumber,
            total: response.total
          });
        }
        this.setState({refreshing: false});
      });
    });
  }
  onNotificationOnPress(index) {
    const { putNotificationStatus, notifications } = this.props;
    const notificationId = notifications[index].notificationId;
    const notificationType = notifications[index].notificationType;
    const isRead = notifications[index].isRead;
    const id = DeviceInfo.getBundleId();
    if (notificationType === 'SESSION') {
      if (PACKAGE.ANDROID.PDATRAINER === id || PACKAGE.IOS.PDATRAINER === id) {
        navigateToScreen('SessionsScreen');
      }
    }else if (notificationType === 'USER') {
      navigateToScreen('AccountScreen');
    }else if (notificationType === 'ATTESTATION') {
      const notificationRole = _.has(notifications[index], 'role') ? notifications[index].role :'';
      this.setState({isLoading: true});
      this.props.attestationInfoDetails(notifications[index].sessionId, notificationRole,(status,response)=>{
        myLog('=================notification============', status, response);
        if(status === true){
          const cardObject = response;
          navigateToScreen('AttestationInfoScreen',{cardObject});
        }
        this.setState({isLoading: false});
      });
    }
    if (isRead !== true) {
      putNotificationStatus(false, true, notificationId, index, (status) => {
        if (status === true) {
          //
        }
      });
    }
  }
  onLoadMore(){
    const{
      pageNumber,
      total,
      isLoadingMore
    } = this.state;
    const totalPage = Math.round(total/pageSize);
    myLog('toto', totalPage, pageNumber, total);
    if (isLoadingMore !== true) {
      this.setState({isLoadingMore: true},()=>{
        this.notificationApiCall(pageNumber + 1, pageSize, (status, response) => {
          if (status === true) {
            this.setState({
              pageNumber: response.pageNumber,
              total: response.total
            });
          }
          this.setState({isLoadingMore: false});
        });
      });
    }
  }
  notificationApiCall(pageNumber, pageSize, onCallback){
    let date = new Date();
    const timeZone = date.toTimeString().substring(9);
    const {
      getNotificationList
    } = this.props;
    getNotificationList(pageNumber, pageSize, timeZone, onCallback);

  }
  onDeleteItemPress(Id, index) {
    const {putNotificationStatus} = this.props;
    putNotificationStatus(true, false, Id, index, (status) => {
      if(status === true){
        //
      }
    });
  }
  renderItem({item, index}){
    const {
      notifications
    } = this.props;
    return(
      <View style={{marginBottom : index === notifications.length -1 ? verticalScale(100): 0}}>
        <NotificationItem item={item} index={index}
          onDeletePress={()=>{this.onDeleteItemPress(item.notificationId,index);}}
          onNotificationOnPress={this.onNotificationOnPress}
        />
      </View>
    );
  }
  listFooterComponent(){
    const {
      isLoadingMore
    } = this.state;
    return(
      <View style={{justifyContent:'center', alignItems:'center', padding: isLoadingMore ? 10:0}}>
        <Spinner
          color={COLORS.primaryColor}
          type="Wave"
          size={25}
        />
      </View>
    );
  }
  renderView(dataArray = []){
    const {
      refreshing
    } = this.state;
    let view = null;
    if (dataArray.length > 0) {
      view = (
        <View style={{flex:1}}>
          <FlatList
            data={dataArray}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index}
            refreshing={refreshing}
            onRefresh={this.onRefresh}
            onEndReached={this.onLoadMore}
            onEndReachedThreshold={0.5}
          />
        </View>
      );
    }else {
      view = (
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
          <Text>{stringsConvertor('alertMessage.noNotification')}</Text>
        </View>
      );

    }
    return view;
  }

  renderSuccessView(notifications){
    return(
      <View style={{flex:1}}>
        {this.renderView(notifications)}
      </View>
    );
  }
  renderLoadingView(){
    return(
      <View style={{alignItems:'center', justifyContent:'center', flex: 1}}>
        <Spinner
          color={COLORS.password}
          type="ChasingDots"
          size={40}
        />
      </View>
    );
  }

  render(){
    const {
      notifications,
      name
    } = this.props;
    const {
      isLoading
    } = this.state;
    return(
      <View style={{backgroundColor: COLORS.white, flex:1}}>
        <View>
          <Toolbar isBack={true} title={stringsConvertor('screenTitle.notifications')} />
        </View>
        <View style={{flex:1}}>
          {isLoading ?
            this.renderLoadingView():
            this.renderSuccessView(notifications)}
        </View>
        <BottomMenu screen={name}/>
      </View>
    );
  }
}
export default Notification;
