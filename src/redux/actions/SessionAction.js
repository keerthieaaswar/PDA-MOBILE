import HttpBaseClient from '../../utils/httpClient/HttpBaseClient';
import { myLog } from '../../utils/StaticFunctions';
import { URL } from '../../utils/httpClient/Url';
import {
  GET_SESSION_LIST_SUCCESS,
  SESSION_CARD_OBJECT_SELECT,
  GET_SESSION_LIST_LOADING,
  SESSION_INFO_DETAILS_SUCCESS,
  SESSION_INFO_DATA_CLEAR_SUCCESS } from './Types';
import _ from 'lodash';
import { sendActionAnalytics, sendActionAnalyticsToDB } from '../../utils/AnalyticsHelper';
import moment from 'moment';
import { DATE_FORMAT } from '../../constants/String';

export const sessionCardSelect = (index)=>{
  return (dispatch, getState)=>{
    const sessionArray = getState().sessionState.sessions;
    const cardObject = sessionArray[index];
    dispatch({type: SESSION_CARD_OBJECT_SELECT, payload: cardObject});
  };
};


export const saveSessionsDataToDB = (data)=>{
  return (dispatch)=>{
    const sortArray = _.orderBy(data,'sessionProgress','desc');
    myLog(sortArray);
    dispatch({
      type: GET_SESSION_LIST_SUCCESS,
      payload: sortArray
    });
    dispatch(sessionCardSelect(0));
  };
};


/**
 *
 * @param {*} params
 * @param {*} callback
 */
export const sessionList = () => {
  return (dispatch, getState) => {
    dispatch({type:GET_SESSION_LIST_LOADING,payload: true});
    return HttpBaseClient.get(URL.SESSION_LIST, 1).then((response) => {
      myLog('----userSessionCreation response', response);
      if (response.responseCode === 200) {
        dispatch(saveSessionsDataToDB(response.response));
      }
      dispatch({type:GET_SESSION_LIST_LOADING,payload: false});
    }).catch(() => {
      dispatch({type:GET_SESSION_LIST_LOADING,payload: false});
    });
    // }
  };
};

/**
 *
 * @param {*} params
 * @param {*} callback
 */
export const sessionCreate = (url, data, sessionData, callback) => {
  const { sessionName, topicId, sessionStartDate, sessionEndDate } = data;
  const sessionStartDateCleverTab = moment(sessionStartDate).format(DATE_FORMAT.DDMMYYYY);
  const sessionStartTime = moment(sessionStartDate).format(DATE_FORMAT.hmmA);
  const sessionEndDateCleverTab = moment(sessionEndDate).format(DATE_FORMAT.DDMMYYYY);
  const sessionEndTime = moment(sessionEndDate).format(DATE_FORMAT.hmmA);
  const programId = sessionData.topic.topic.programId;
  const programName = sessionData.topic.program.name;
  const topicName = sessionData.topic.topic.name;
  const venue = data.address;
  return (dispatch,getState) => {
    const{
      userData
    } = getState().userState;
    myLog('==========================================session create========================',userData,sessionData);
    const userId = _.has(userData,'userId') ? userData.userId : '';
    return HttpBaseClient.post(url, data, 1).then((response) => {
      myLog('----userSessionCreation response', response);
      if (response.responseCode === 200) {
        const sessionId = response.response.sessionId;
        sendActionAnalytics('Create session', userData,{userId,sessionId, sessionName, topicId,topicName,sessionStartDateCleverTab,
          sessionStartTime, sessionEndDateCleverTab, sessionEndTime, programId, programName,venue});
        sendActionAnalyticsToDB('Create session',{userId,programId,programName,sessionId, sessionName, topicId, topicName,
          sessionEndDate,sessionStartDate,venue});
        callback(true, response.response);
        dispatch(sessionList());
      }else{
        callback(false, response.message);
      }
    }).catch((error) => {
      callback(false, error.message);
    });
  };
};
/**
 *
 * @param {*} params
 * @param {*} callback
 */
export const sessionUpdate = (data, callback) => {
  myLog('=====================session update session action=========================',data);
  const sessionName = _.has(data,'sessionName') ? data.sessionName :'';
  const topicId = _.has(data,'topicId') ? data.topicId :'';
  const topicName = _.has(data.topicInfo,'topic') ? data.topicInfo.topic.name : '';
  const programId = _.has(data.topicInfo,'topic') ? data.topicInfo.topic.programId : '';
  const programName = _.has(data.topicInfo,'program') ? data.topicInfo.program.name : '';
  const sessionStartDate = _.has(data,'sessionStartDate') ? data.sessionStartDate :'';
  const sessionEndDate = _.has(data,'sessionEndDate') ? data.sessionEndDate :'';
  const venue = _.has(data,'address') ? data.address :'';
  return (dispatch,getState) => {
    const{
      userData
    } = getState().userState;
    const userId = _.has(userData,'userId') ? userData.userId : '';
    return HttpBaseClient.put(URL.SESSION_UPDATE, data, 1).then((response) => {
      myLog('----userSessionCreation response', response);
      if (response.responseCode === 200) {
        const sessionId = response.response.sessionId;
        sendActionAnalytics('Edit session',userData,{userId,sessionId,programId,programName,venue});
        sendActionAnalyticsToDB('Edit session',{userId,programId,programName,sessionId, sessionName, topicId, topicName,
          sessionEndDate,sessionStartDate,venue});
        callback(true, response.response);
        dispatch(sessionList());
      }else{
        callback(false, response.message);
      }
    }).catch((error) => {
      callback(false, error.message);
    });
  };
};

export const addMember =  (data, callback) =>{
  return ()=>{
    return HttpBaseClient.post(URL.SESSION_ADD_MEMBER, data, 1).then((response)=>{
      myLog('----sessionAddMember response', response,data);
      if (response.responseCode === 200) {
        callback(true, response.response);
        const userId = _.has(data,'userId') ? data.userId : '';
        const sessionId = _.has(data,'sessionId') ? data.sessionId : '';
        const topicId = _.has(data,'topicId') ? data.topicId : '';
        sendActionAnalytics('Member Addition',data,{userId,sessionId,topicId});
        sendActionAnalyticsToDB('Member Addition',{userId,sessionId,topicId});
      }else{
        callback(false, response.message);
      }
    }).catch((error) => {
      callback(false, error.message);
    });
  };
};

export const updateMember =  (data, callback) =>{
  return ()=>{
    return HttpBaseClient.put(URL.SESSION_UPDATE_MEMBER, data, 1).then((response)=>{
      myLog('----sessionAddMember response', response);
      if (response.responseCode === 200) {
        callback(true, response.response);
      }else{
        callback(false, response.message);
      }
    }).catch((error) => {
      callback(false, error.message);
    });
  };
};
export const deleteMember =  (data, callback) =>{
  return ()=>{
    return HttpBaseClient.delete(URL.SESSION_DELETE_MEMBER,{}, 1, data).then((response)=>{
      myLog('----sessionDeleteMember response', response,data);
      if (response.responseCode === 200) {
        callback(true, response.response);
        const userId = _.has(data,'userId') ? data.userId : '';
        const sessionId = _.has(data,'sessionId') ? data.sessionId : '';
        sendActionAnalytics('Member Deletion',data,{userId,sessionId});
        sendActionAnalyticsToDB('Member Deletion',{userId,sessionId});
      }else{
        callback(false, response.message);
      }
    }).catch((error) => {
      callback(false, error.message);
    });
  };
};


/**
 *
 * @param {*} params
 * @param {*} callback
 */
export const sessionInfoDataClear=()=>{
  return {
    type: SESSION_INFO_DATA_CLEAR_SUCCESS,
    payload: {}
  };
};

export const sessionInfoDetails = (sessionId, onCallback)=>{
  return (dispatch, getState)=>{
    const{
      userData
    } = getState().userState;
    const userId = _.has(userData,'userId') ? userData.userId : '';
    dispatch(sessionInfoDataClear());
    HttpBaseClient.get(URL.SESSION_INFO_DETAILS + sessionId,1).then((response) => {
      myLog('----sessionInfoList response', response);

      if (response.responseCode === 200) {
        const cardObject = {
          ...getState().sessionState.cardObject,
          ...response.response
        };
        const sessionId = response.response.sessionId;
        const venue = response.response.address;
        sendActionAnalytics('View Session',userData,{userId,sessionId,venue});
        sendActionAnalyticsToDB('View Session',{sessionId,userId,venue});
        onCallback(true, cardObject);
        dispatch({type: SESSION_INFO_DETAILS_SUCCESS, payload: cardObject});
      }else{
        onCallback(false, response.message);
      }
    }).catch((error) => {
      onCallback(false, error.message);
    });
  };
};
export const addTopic =(id, onCallback)=>{
  return()=>{
    return HttpBaseClient.get(URL.ADD_TOPIC+id, 1,{}).then((response)=>{
      if (response.responseCode === 200) {
        onCallback(true, response.response);
      }else{
        onCallback(false, response);
      }
    }).catch((error)=>{
      onCallback(false, error);
    });
  };
};
export const deleteSession =  (data, callback) =>{
  return ()=>{
    return HttpBaseClient.delete(URL.SESSION_DELETE + data.sessionId,{}, 1).then((response)=>{
      myLog('----sessionDelete response', response);
      if (response.responseCode === 200) {
        myLog('===============================session delete===========');
        callback(true, response.response);
      }else{
        callback(false, response.message);
      }
    }).catch((error) => {
      callback(false, error.message);
    });
  };
};


export const additionalLinkUpdate =  (data, callback) =>{
  const AdditionalLinkData={
    url: data.additionalLink,
    userId: data.userId
  };
  return ()=>{
    myLog('----ADD LINK response-------', data);
    return HttpBaseClient.post(URL.UPDATE_ADDITIONAL_LINK + data.sessionId, AdditionalLinkData,1).then((response)=>{
      myLog('----ADD LINK response-------', response);
      if (response.responseCode === 200) {
        callback(true, response.response);
      }else{
        callback(false, response.message);
      }
    }).catch((error) => {
      callback(false, error.message);
    });
  };
};

export const deleteAdditionalLink =  (data, callback) =>{
  return ()=>{
    return HttpBaseClient.delete(URL.DELETE_ADDITIONAL_LINK +data.sessionId+'/'+data.id,{}, 1).then((response)=>{
      myLog('----AdditionalLink Delete response++++++++++', response);
      if (response.responseCode === 200) {
        myLog('===============================Add_link delete===========');
        callback(true, response.response);
      }else{
        callback(false, response.message);
      }
    }).catch((error) => {
      callback(false, error.message);
    });
  };
};
