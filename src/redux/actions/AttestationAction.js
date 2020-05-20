import { GET_ATTESTATION_LIST_SUCCESS, ATTESTATION_CARD_OBJECT_SELECT, GET_ATTESTATION_LIST_LOADING, ATTESTATION_INFO_DETAILS_SUCCESS,SESSION_INFO_DETAILS_LOADING, SESSION_INFO_DETAILS_CLEAR_DATA  } from './Types';
import HttpBaseClient from '../../utils/httpClient/HttpBaseClient';
import { myLog } from '../../utils/StaticFunctions';
import _ from 'lodash';
import { URL } from '../../utils/httpClient/Url';
import { OfflineHelper } from '../../utils/OfflineHelper';


export const attestationCardSelect = (index)=>{
  return (dispatch, getState)=>{
    const attestation = getState().attestationState.attestation;
    const cardObject = attestation[index];
    dispatch({type: ATTESTATION_CARD_OBJECT_SELECT, payload: cardObject});
  };
};

export const saveAttestationsDetailsDataToDB = (sessionId, data)=>{
  return (dispatch)=>{
    myLog('saveAttestationsDetailsDataToDB:::::ENTER', data);
    OfflineHelper.setAttestationDetails(sessionId, data);
    dispatch({type: ATTESTATION_INFO_DETAILS_SUCCESS, payload: data});
  };
};

export const getAttestationsDetailsDataFromDB = (sessionId)=>{
  return (dispatch)=>{
    OfflineHelper.getAttestationDetails(sessionId).then((response) => {
      myLog('getAttestationsDetailsDataFromDB:::::', response);
      dispatch(saveAttestationsDetailsDataToDB(sessionId, response));
    });
  };
};
export const saveAttestationsDataToDB = (data)=>{
  return (dispatch)=>{
    myLog('saveAttestationsDataToDB:::::ENTER', data);
    OfflineHelper.setAttestation(data);
    const sortArray = _.orderBy(data,'attestationDate','desc');
    myLog(sortArray);
    dispatch({
      type: GET_ATTESTATION_LIST_SUCCESS,
      payload: sortArray
    });
    dispatch(attestationCardSelect(0));
  };
};

export const getAttestationsDataFromDB = ()=>{
  return (dispatch)=>{
    OfflineHelper.getAttestation().then((response) => {
      myLog('getAttestationsDataFromDB:::::', response);
      dispatch(saveAttestationsDataToDB(response));
    });
  };
};
/**
 *
 * @param {*} params
 * @param {*} callback
 */
export const attestationList = (onCallback ={}) => {
  return (dispatch, getState) => {
    dispatch({type:GET_ATTESTATION_LIST_LOADING,payload: true});
    const isInternet = getState().appState.isInternetConnectivityAvailable ;
    myLog('attestationList:::::START::--isInternet',isInternet);
    if (isInternet !== true) {
      myLog('attestationList:::::START::DATABASE ENTER');
      dispatch(getAttestationsDataFromDB());
      dispatch({type:GET_ATTESTATION_LIST_LOADING,payload: false});
    } else {
      myLog('attestationList:::::START::API ENTER');
      return HttpBaseClient.get(URL.ATTESTATION_LIST, 1).then((response) => {
        if (response.responseCode === 200) {
          dispatch(saveAttestationsDataToDB(response.response));
          onCallback(true, response.response);
        }
        dispatch({type:GET_ATTESTATION_LIST_LOADING,payload: false});
      }).catch(() => {
        dispatch({type:GET_ATTESTATION_LIST_LOADING,payload: false});
      });
    }
  };
};



export const attestationInfoDetails = (sessionId,role, onCallback ={})=>{
  return (dispatch, getState)=>{
    const isInternet = getState().appState.isInternetConnectivityAvailable ;
    HttpBaseClient.get(URL.ATTESTATION_INFO_DETAILS,1, {role, sessionId}).then((response) => {
      if (response.responseCode === 200) {
        myLog('attestation details response:;', response);
        onCallback(true, response.response);
      }else{
        onCallback(false, response.message);
      }
    }).catch((error) => {
      onCallback(false, error.message);
    });
  };
};

export const attestationInfoDataClear=()=>{
  return {
    type:SESSION_INFO_DETAILS_CLEAR_DATA,
    payload:{}
  };
};