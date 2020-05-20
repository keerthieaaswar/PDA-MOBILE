/**
 * pda
 * Url.js
 * @author Socion Advisors LLP
 * @description Created on 28/02/2019
 * Copyright © 2019 pda. All rights reserved.
 */
import {
  Alert
} from 'react-native';
import axios from 'axios';
import {
  BASE_URL, URL
} from './Url';
import { myLog} from '../StaticFunctions';
import store from '../../redux/Store';
import moment from 'moment';
import { authenticationLogic, userDataClearInLocal } from '../../redux/actions/UserActions';
import { stringsConvertor } from '../I18n';
import { hideMessage } from 'react-native-flash-message';
import { HTTP } from '../../constants/String';
import { Actions } from 'react-native-router-flux';
import { getUnReadCount } from '../../redux/actions/NotificationActions';
// axios instance for oauth http request
export const instanceOauth = axios.create({
  baseURL: BASE_URL
});



// axios instance for http request with authentication
export const instanceWithAuth = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'offset': new Date().getTimezoneOffset()
  }
});
// axios instance for http request without authentication
export const instanceWithoutAuth = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept':'application/json'
  }
});

export default class HttpBaseClient {

  /**
     * get method are used to access the get request API call
     * @param {*} url only end point
     * @param {*} params
     * @param {*} auth 0 = without authentication , 1 = with authentication ,
     */
  static get(url, auth = 0, params ={}) {
    return new Promise((resolve, reject) => {
      const config = {
        params
      };
      let instance = instanceWithoutAuth;
      if (auth === 1) {
        instance = instanceWithAuth;
      }
      myLog('::::::::::GET::::::::::input--::', url, params);
      instance.get(url, config).then((response) => {
        myLog('::::::::::GET::::::::::response::',url, response);
        return resolve(response.data);
      }).catch((error) => {
        myLog('::::::::::GET::::::::::error??????::',url, error.message, error.response);
        return reject(this.CatchErrorHandler(error.message));
      });
    });
  }


  /**
   * post method
   * @param {*} url
   * @param {*} data
   * @param {*} auth
   */

  static post(url, data = {}, auth = 0, params = {}) {
    return new Promise((resolve, reject) => {
      const config = {
        params
      };
      let instance = instanceWithoutAuth;
      if (auth === 1) {
        instance = instanceWithAuth;
      }
      myLog('::::::::::POST::::::::::input--::', url, data);
      instance.post(url, data, config).then((response) => {
        myLog('::::::::::post::::::::::response::',url, response);
        if (url !== URL.SIGN_IN && (response.data.responseCode === 401)) {
          return reject(this.CatchErrorHandler(response.data.responseCode));
        }else{
          return resolve(response.data);
        }
      }).catch((error) => {
        myLog('::::::::::POST::::::::::error??????::',url,error, error.message, error.response);
        return reject(this.CatchErrorHandler(error.message));
      });
    });
  }

  /**
   * put method are used to put request API call
   */
  static put(url, data = {}, auth = 0, params = {}) {
    return new Promise((resolve, reject) => {
      const config = {
        params
      };
      let instance = instanceWithoutAuth;
      if (auth === 1) {
        instance = instanceWithAuth;
      }
      myLog('::::::::::PUT::::::::::input--::', url, data);
      instance.put(url, data, config).then((response) => {
        myLog('::::::::::PUT::::::::::response::',url, response);
        if (url !== URL.SIGN_IN && (response.data.responseCode === 401)) {
          return reject(this.CatchErrorHandler(response.data.responseCode));
        }else{
          return resolve(response.data);
        }
      }).catch((error) => {
        myLog('::::::::::PUT::::::::::error??????::',url,error, error.message, error.response);
        return reject(this.CatchErrorHandler(error.message));
      });
    });
  }

  /**
   * delete method are used to delete request API call
   * @param {*} url
   * @param {*} data
   * @param {*} auth
   */
  static delete (url, data = {}, auth = 0, params = {}){
    return new Promise((resolve, reject)=>{
      const config = {
        params,
        data
      };
      let instance = instanceWithoutAuth;
      if (auth === 1) {
        instance = instanceWithAuth;
      }
      myLog('::::::::::DELETE::::::::::input--::', url, data);
      instance.delete(url, config).then((response) => {
        if ((response.data.responseCode === 404 || response.data.responseCode === 401)) {
          return reject(this.CatchErrorHandler(response.data.responseCode));
        }else{
          myLog('::::::::::DELETE::::::::::response::',url, response);
          return resolve(response.data);
        }
      }).catch((error) => {
        myLog('::::::::::DELETE::::::::::error??????::',url,error, error.message, error.response);
        return reject(this.CatchErrorHandler(error.message));
      });
    });
  }


  static CatchErrorHandler(error){
    let errorMessage = error;
    if (error === undefined ||error === 400 || error === 401) {
      error = '401';
    }
    if (error === 404) {
      error = '404';
    }

    myLog('::::::::::CatchErrorHandler::::::::::Error::',error);
    if (error.includes('Error: Network Error') || error.includes('Error: Request failed with status code 500')) {
      myLog('---if---', error);
      errorMessage = {
        status: HTTP.CODE.REQUEST_TIMED_OUT_FAILURE,
        message:stringsConvertor('validationMessage.500')
      };
    }else if (error.includes('401')) {
      myLog('---else if 401---');
      hideMessage();
      Alert.alert(
        stringsConvertor('alert.appName'),
        stringsConvertor('validationMessage.401'),
        [
          {text: stringsConvertor('alert.ok'), onPress:()=>{
            userDataClearInLocal(()=>{
              // navigateToScreen('LoginScreen');
              Actions.reset('LoginScreen');
            });
          }}
        ],
        {cancelable: false},
      );
    } else {
      myLog('---else ---');
      errorMessage = {
        status: HTTP.CODE.REQUEST_TIMED_OUT_FAILURE,
        message:stringsConvertor('validationMessage.500')
      };
    }
    myLog('---errorMessage ---',errorMessage);
    return errorMessage;
  }
}

instanceWithoutAuth.interceptors.response.use((config) => {
  myLog('without token',config );
  return config;
}, (error) => {
  // Error handle
  return Promise.reject(error);
});


instanceWithAuth.interceptors.request.use((config) => {
  myLog('instanceWithAuth request',config );
  const expireDateTime = store.getState().userState.authenticationData.expireDateTime;
  let currentDateTime = new Date();
  let originalRequest = config;

  if (!moment(currentDateTime.toString()).isBefore(expireDateTime)) {
    const refreshToken = store.getState().userState.authenticationData.refreshToken;
    const params = {refreshToken,grantType : 'refresh_token'};
    myLog(currentDateTime,'--------Expired-----------', expireDateTime, params);
    return HttpBaseClient.post(URL.OAUTH, params).then((response)=>{
      if (response.responseCode === 200) {
        const userDetails = store.getState().userState.userData;
        response.response = {
          userDetails,
          ...response.response
        };
        authenticationLogic(response.response, store.dispatch, () => {}, true);
        // originalRequest.headers['Authorization'] = `Bearer ${ response.response.accessTokenResponseDTO.accessToken}`;
        originalRequest.headers['access-token'] = `${response.response.accessTokenResponseDTO.accessToken}`;
        return Promise.resolve(originalRequest);
      }else {
        return Promise.reject('error');
      }
    }).catch((error)=>{
      return Promise.reject(error);
    });
  }
  return config;
}, (err) => {
  return Promise.reject(err);
});

instanceWithAuth.interceptors.response.use((response) => {
  myLog('instanceWithAuth response',response, response.config.url.replace(BASE_URL,'') );
  if (response.status === 200 && response.data.responseCode === 200 && response.config.url.replace(BASE_URL,'') !== URL.NOTIFICATION_UN_READ_COUNT) {
    store.dispatch(getUnReadCount());
  }
  return Promise.resolve(response);
}, (err) => {
  return Promise.reject(err);
});