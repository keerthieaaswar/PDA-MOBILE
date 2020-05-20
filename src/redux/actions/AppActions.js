/**
 * pda
 * AppActions.js
 * @author Socion Advisors LLP
 * @description Created on 27/02/2019
 * Copyright © 2019 pda. All rights reserved.
 */
import { HAS_INTERNET_CONNECTIVITY,HAS_INTERNET_CONNECTIVITY_TYPE } from './Types';
import { URL } from '../../utils/httpClient/Url';
import HttpBaseClient from '../../utils/httpClient/HttpBaseClient';
import { myLog } from '../../utils/StaticFunctions';
export const saveInternetConnectivityStatus =(isInternetConnectivityAvailable)=>{
  return {type : HAS_INTERNET_CONNECTIVITY, isInternetConnectivityAvailable};
};
export const saveInternetConnectivityType =(networkInfo)=>{
  return {type : HAS_INTERNET_CONNECTIVITY_TYPE, networkInfo};
};

export const checkAppUpdate = (param,callback=()=>{})=>{
  return ()=>{
    myLog('----check update HttpBaseClient ', param);
    return HttpBaseClient.get(URL.UPDATE_APP,0, param).then((response) => {
      if (response.forceUpgrade || response.recommendUpgrade) {
        callback(true,response);
        myLog('----check update HttpBaseClient ', response);
      }else {
        callback(false,'');
        myLog('----check update HttpBaseClient else ', response);
      }
    }).catch((error)=>{
      myLog('----check update catch ', error);
      callback(false);
    });
  };
};
