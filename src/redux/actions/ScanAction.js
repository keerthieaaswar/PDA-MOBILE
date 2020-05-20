/* eslint-disable max-lines-per-function */
import HttpBaseClient from '../../utils/httpClient/HttpBaseClient';
import { URL } from '../../utils/httpClient/Url';
import { myLog } from '../../utils/StaticFunctions';
import { OfflineHelper } from '../../utils/OfflineHelper';
import _ from 'lodash';
import { sendActionAnalyticsToDB, sendActionAnalytics } from '../../utils/AnalyticsHelper';
import  {NetworkInfo}  from 'react-native-network-info';
import { stringsConvertor } from '../../utils/I18n';
export const getUserDetails=(userId, topicId, callback)=>{
  return ()=>{
    const params = {
      userId,
      topicId
    };
    return HttpBaseClient.get(URL.SCAN_USER, 1, params).then((response) => {
      myLog('-----getUserDetails----response---', response);
      if (response.responseCode === 200) {
        callback(true, response.response);
      }else{
        callback(false, response.message);
      }
    }).catch((error)=>{
      myLog('-----getUserDetails----error---', error);
      callback(false, error.message);
    });
  };
};

export const invokeScanInOut = (data,onCallback)=>{
  return HttpBaseClient.post(URL.SCAN_IN_OUT, data, 1, null).then((response) => {
    myLog('-----scan Details----response---',data,URL,URL.SCAN_IN_OUT, response);
    if (response.responseCode === 200) {
      onCallback(true, response.response);
      const offlineToOnlineSync = data.offline;
      const sessionId = data.sessionId;
      const userId = data.userId;
      const key = data.isScanIn ? 'Session Scan in' : 'Session Scan Out';
      const sessionLat = _.has(data,'latitude') ? data.latitude : '';
      const sessionLon = _.has(data,'longitude') ? data.longitude : '';
      sendActionAnalyticsToDB(key, {userId,sessionId,offlineToOnlineSync,sessionLat,sessionLon});
      sendActionAnalytics(key,data,{userId,sessionId,offlineToOnlineSync,sessionLat,sessionLon});
    }else{
      onCallback(false, response.message);
    }
  }).catch((error)=>{
    myLog('-----getUserDetails----error---', error);
    onCallback(false, error.message);
  });
};

export const ScanInOut = (data, onCallback)=>{
  return (dispatch, getState)=>{
    myLog('data+++++++++++++', data);
    const isInternet = getState().appState.isInternetConnectivityAvailable ;
    async function getIpAdd(data, onCallback){
      const ipv4Address = await NetworkInfo.getIPV4Address();
      data = {
        ...data,
        ipAddress: ipv4Address
      };
      invokeScanInOut(data,onCallback);
    }
    if (isInternet !== true) {
      data = {
        ...data,
        offline : !isInternet
      };
      myLog('data++++++--------------', data);
      OfflineHelper.getScanDetails().then((response) =>{
        myLog('response', response);
        if (response) {
          let scanArray = response;
          let isExit = _.filter(scanArray, {isScanIn: data.isScanIn, sessionId: data.sessionId});
          myLog(isExit, isExit.length);
          myLog('++++++++++++++++',data.QRtype);
          if (isExit.length !== 0) {
            if (data.QRtype==='startQR') {
              onCallback(false, ' Already Joined the Session');
            } else {
              onCallback(false, 'Already Scanned Out from Session');
            }
            // onCallback(false, 'Scan already added');
          }else{
            scanArray.push(data);
            // _.sortBy(scanArray, {isScanIn: false});
            OfflineHelper.setScanDetails(scanArray,onCallback).catch((err)=>{
              onCallback(false, stringsConvertor('qrScanner.tryScanAgain'));
            });
          }
        }
      }).catch((error) =>{
        myLog('error', error);
        let scanArray = [];
        scanArray.push(data);
        OfflineHelper.setScanDetails(scanArray,onCallback).catch((err)=>{
          onCallback(false, stringsConvertor('qrScanner.tryScanAgain'));
        });
      });
    } else {
      getIpAdd(data,onCallback).catch((error)=>{
        invokeScanInOut(data,onCallback);
      });
    }
  };
};

export const offlineOnlineScan = (responseArray,count) => {
  async function getIpAdd(oldArray){
    let originalArray = oldArray;
    const ipv4Address = await NetworkInfo.getIPV4Address();
    oldArray = {
      ...oldArray,
      ipAddress: ipv4Address
    };
    invokeScanInOut(oldArray[0],(status,response) => {
      setTimeout(()=>{
        if(status === true){
          originalArray.splice(0, 1);
          OfflineHelper.setScanDetails(originalArray).catch((err)=>{});
          count = 0;
          offlineOnlineScan(originalArray,count);
        }
        else if(count < 5){
          count++;
          offlineOnlineScan(originalArray,count);
        }
        else{
          originalArray.splice(0, 1);
          OfflineHelper.setScanDetails(originalArray).catch((err)=>{});
          count = 0;
          offlineOnlineScan(originalArray,count);
        }
      },5000);
    }).catch((er)=>{});
  }
  if(responseArray.length > 0){
    let oldArray = responseArray;
    let hit = true;
    while(hit ){
      getIpAdd(oldArray).catch((error)=>{
        invokeScanInOut(oldArray[0],(status,response) => {
          setTimeout(()=>{
            if(status === true){
              oldArray.splice(0, 1);
              OfflineHelper.setScanDetails(oldArray).catch((err)=>{});
              count = 0;
              offlineOnlineScan(oldArray,count);
            }
            else if(count < 5){
              count++;
              offlineOnlineScan(oldArray,count);
            }
            else{
              oldArray.splice(0, 1);
              OfflineHelper.setScanDetails(oldArray).catch((err)=>{});
              count = 0;
              offlineOnlineScan(oldArray,count);
            }
          },5000);
        }).catch((er)=>{});
      });
      hit = false;
    }
  }
};


export const offlineSyn = ()=>{
  return (dispatch)=>{
    OfflineHelper.getScanDetails().then((responseArray)=>{
      if (responseArray.length > 0) {
        let count = 0;
        offlineOnlineScan(responseArray,count);
      }
    }).catch((error)=>{
      myLog('error',error);
    });
  };
};