/**
 * pda
 * NotificationActions.js
 * @author Socion Advisors LLP
 * @description Created on 15/06/2019
 * Copyright © 2019 pda. All rights reserved.
 */
import _ from 'lodash';
import HttpBaseClient from '../../utils/httpClient/HttpBaseClient';
import { URL } from '../../utils/httpClient/Url';
import { myLog } from '../../utils/StaticFunctions';
import { NOTIFICATION_COUNT_SUCCESS, NOTIFICATION_LIST_SUCCESS, NOTIFICATION_LIST_INITIAL, NOTIFICATION_DELETE_SUCCESS } from './Types';

export const setNotificationToInitial = (onCallback)=>{
  return (dispatch)=> {
    dispatch({type: NOTIFICATION_LIST_INITIAL});
    onCallback();
  };
};
export const getUnReadCount = ()=>{
  return (dispatch)=>{
    return HttpBaseClient.get(URL.NOTIFICATION_UN_READ_COUNT, 1).then((response)=>{
      if (response.responseCode === 200) {
        if (response.response > 0) {
          dispatch({type: NOTIFICATION_COUNT_SUCCESS, payload: true});
        }else{
          dispatch({type: NOTIFICATION_COUNT_SUCCESS, payload: false});
        }
      }
    }).catch((error)=>{
      myLog('getUnReadCount error',error);
    });
  };
};

export const getNotificationList = (pageNumber, pageSize, timeZone, onCallback)=>{
  return (dispatch, getState)=>{
    const params =  {
      pageNumber,
      pageSize,
      timeZone
    };
    let notifications = getState().notificationState.notifications;
    return HttpBaseClient.get(URL.NOTIFICATION_LIST, 1, params).then((response) => {
      if (response.responseCode === 200) {
        if (pageNumber > 1) {
          let newResponse = {
            notifications :[],
            pageNumber:response.response.pageNumber,
            pageSize: response.response.pageSize,
            total: response.response.total
          };
          newResponse.notifications.push(...notifications,...response.response.notifications);
          dispatch({type: NOTIFICATION_LIST_SUCCESS, payload: newResponse});
        }else{
          dispatch({type: NOTIFICATION_LIST_SUCCESS, payload: response.response});
        }
        onCallback(true, response.response);
      }else{
        onCallback(false, response.message);
      }
    }).catch((error)=>{
      myLog('getNotificationList error',error);
      onCallback(false, error);
    });
  };
};



export const putNotificationStatus = (isDeleted, isRead, notificationId, index, onCallback)=>{
  return (dispatch, getState)=>{
    const data =  {
      isDeleted,
      isRead,
      notificationId
    };
    let notifications = getState().notificationState.notifications;
    myLog('=========================putNotification called=========');
    return HttpBaseClient.put(URL.NOTIFICATION_UPDATE_STATUS, data, 1 ).then((response) => {
      if (response.responseCode === 200) {
        if (isDeleted === true) {
          notifications.splice(index, 1);
          dispatch({type: NOTIFICATION_DELETE_SUCCESS, payload: _.cloneDeep(notifications)});
        }else if (isRead === true) {
          let item = notifications[index];
          item.isRead = true;
          item.read= true;
          notifications[index] = _.cloneDeep(item);
          dispatch({type: NOTIFICATION_DELETE_SUCCESS, payload: _.cloneDeep(notifications)});
        }
        onCallback(true, response);
      }else{
        onCallback(false, response.message);
      }
    }).catch((error)=>{
      myLog('putNotificationStatus error',error);
    });
  };
};