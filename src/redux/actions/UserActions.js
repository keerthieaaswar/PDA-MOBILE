import HttpBaseClient, { instanceWithAuth } from '../../utils/httpClient/HttpBaseClient';
import { URL, AWS_CONFIG,awsConfigDocument } from '../../utils/httpClient/Url';
import { SIGN_IN_SUCCESS, SIGN_IN_ERROR, SIGN_IN_FAILURE, REGISTER_SUCCESS, REGISTER_ERROR, GET_PROFILE_SUCCESS, REFRESH_TOKEN_SUCCESS, COUNTRY_CODE_LIST,
  COUNTRY_NAME_LIST, COUNTRY_CODE_LIST_LOADING, LOGOUT_SUCESS,LOCATION_UPDATE_SUCCESS } from './Types';
import { stringsConvertor } from '../../utils/I18n';
import { myLog } from '../../utils/StaticFunctions';
import ImagePicker from 'react-native-image-crop-picker';
import {AsyncStorage} from 'react-native';
import { RNS3 } from 'react-native-aws3';
import { sendActionAnalytics, sendActionAnalyticsToDB } from '../../utils/AnalyticsHelper';
import _ from 'lodash';
import LocalStorageHelper from '../../utils/LocalStorageHelper';
import { STORAGE } from '../../constants/String';

/**
 *
 * @param {*} callback
 */
export const userDataClearInLocal = (callback)=>{
  LocalStorageHelper.deleteDataFromLocal(STORAGE.USER_DATA && STORAGE.ATTESTATION_LIST).then((userCleared)=>{
    myLog('----deleteDataFromLocal userCleared ::::::::::::::::::::::::::::::::::::::::::::::::::::::', userCleared);
    if (userCleared) {
      LocalStorageHelper.deleteDataFromLocal(STORAGE.IS_LOGGED_IN).then((isLoggedIn)=>{
        myLog('----deleteDataFromLocal isLoggedIn ', isLoggedIn);
        callback(true, stringsConvertor('alertMessage.logoutConfirmed'));
      }).catch((error)=>{
        myLog('----deleteDataFromLocal isLoggedIn ', error);
        callback(false, stringsConvertor('alertMessage.logoutFailed'));
      });
    }
  }).catch((error)=>{
    myLog('----deleteDataFromLocal catch ', error);
    callback(false, stringsConvertor('alertMessage.logoutFailed'));
  });
};
/**
 *
 * @param {*} response
 * @param {*} callback
 */
export const updateUserDataInState = (response, callback, isRefresh = false)=>{
  return (dispatch)=>{
    myLog('updateUserDataInState::::::');
    // instanceWithAuth.defaults.headers['Authorization'] = `Bearer ${ response.accessTokenResponseDTO.accessToken}`;
    instanceWithAuth.defaults.headers['access-token'] = `${response.accessTokenResponseDTO.accessToken}`;
    if (!_.has(response, 'accessTokenResponseDTO')) {
      response.accessTokenResponseDTO = {};
    }
    if (!isRefresh && !_.has(response, 'userDetails')) {
      response.userDetails = {};
    }
    myLog('userData update', response);
    dispatch({ type: isRefresh ? REFRESH_TOKEN_SUCCESS :SIGN_IN_SUCCESS, payload: response });
    callback(true, isRefresh ? response:`${response.userDetails.name}`);
  };
};

/**
 *
 * @param {*} response
 * @param {*} dispatch
 * @param {*} callback
 */
export const authenticationLogic = (data, dispatch, callback, isRefresh) => {
  let expireDateTime = new Date();
  let refreshExpireDateTime = new Date();
  expireDateTime.setMinutes(expireDateTime.getMinutes() + ((data.accessTokenResponseDTO.expiresIn - 60) / 60));
  refreshExpireDateTime.setMinutes(expireDateTime.getMinutes() + (data.accessTokenResponseDTO.refreshExpiresIn)/60);
  data.accessTokenResponseDTO = { ...data.accessTokenResponseDTO, expireDateTime: expireDateTime.toString(), refreshExpireDateTime: refreshExpireDateTime.toString()};
  myLog('----LOCAL_RESPONSE', data);
  LocalStorageHelper.storeValueToLocal(STORAGE.USER_DATA, JSON.stringify(data)).then((userSaved) => {
    myLog('----LocalStorageHelper USER_DATA ', userSaved);
    if (userSaved) {
      LocalStorageHelper.storeValueToLocal(STORAGE.IS_LOGGED_IN, 'true').then((responseLogged) => {
        myLog('----LocalStorageHelper IS_LOGGED_IN ', responseLogged);
        if (responseLogged) {
          dispatch(updateUserDataInState(data,(...params)=>callback(...params), isRefresh));
        }
      }).catch(() => {
        callback(false, stringsConvertor('ValidationMessage.500'));
        dispatch({ type: SIGN_IN_ERROR, payload: stringsConvertor('ValidationMessage.500') });
      });
    }
  }).catch((error) => {
    myLog('----LocalStorageHelper USER_DATA error', error);

    callback(false, stringsConvertor('ValidationMessage.500'));
    dispatch({ type: SIGN_IN_ERROR, payload: stringsConvertor('ValidationMessage.500') });
  });
};


export const saveUserDataToDB = (data,type)=>{
  return (dispatch, getState)=>{
    const{
      userData,
      authenticationData
    } = getState().userState;
    let response = {};
    if(type === 'qualification'){
      const qualification = data;
      response = {
        accessTokenResponseDTO: authenticationData,
        userDetails: {...userData, qualification}
      };
    } else{
      response = {
        accessTokenResponseDTO: authenticationData,
        userDetails: {...userData, ...data}
      };
    }
    LocalStorageHelper.storeValueToLocal(STORAGE.USER_DATA, JSON.stringify(response)).then((userSaved) => {
    }).catch((error)=>{});
    // RealmInstance.getInstance.saveUserDataToRealmDB(response);
    myLog('=======================user profile details in db==================',response.userDetails);
    dispatch({ type:GET_PROFILE_SUCCESS , payload: response.userDetails });
  };
};


export const userSignUp = (params, callback)=>{
  const signUpDetails ={
    countryCode:params.countryCode,
    name: params.name,
    phoneNumber: params.phoneNumber
  };
  return (dispatch)=>{
    return HttpBaseClient.post(URL.SIGN_UP, signUpDetails).then((response) => {
      if (response.responseCode === 200) {
        // sendActionAnalytics('Sign-up',signUpDetails);
        callback(true, response.message);
        dispatch ({type:REGISTER_SUCCESS, payload: response});
      }else{
        callback(false, response.message);
        dispatch ({type:REGISTER_ERROR, payload: response.message});
      }
    }).catch((error)=>{
      callback(false, error.message);
      dispatch ({type:REGISTER_ERROR, payload: error.message});
    });
  };
};

export const validateOTP = (params, callback)=>{
  const validateOTP = {
    otp: params.otp,
    typeOfOTP: params.typeOfOTP,
    phoneNumber: params.phoneNumber,
    countryCode:params.countryCode
  };
  return (dispatch, getState)=>{
    const{
      userData
    } = getState().userState;
    const userId = _.has(userData, 'userId') ? userData.userId : '';
    return HttpBaseClient.post(URL.VALIDATE_OTP, validateOTP).then((response) => {
      if (response.responseCode === 200) {
        callback(true, response.message);
        if(params.typeOfOTP === 'NewPhone-OTP'){
          sendActionAnalytics('Profile edit-Phone Number change',userData, {userId});
          sendActionAnalyticsToDB('Profile edit-Phone Number change',{userId});
        }
      }else{
        callback(false, response.message);
      }
    }).catch((error)=>{
      callback(false, error.message);
    });
  };
};

export const setPassword = (params, callback)=>{
  const validateOTP = {
    password: params.password,
    userName: params.userName,
    countryCode: params.countryCode
  };
  return (dispatch)=>{
    return HttpBaseClient.post(URL.SET_PASSWORD, validateOTP).then((response) => {
      if (response.responseCode === 200) {
        const userId = _.has(response.response.userDetails,'userId') ? response.response.userDetails.userId : '';
        sendActionAnalyticsToDB('Sign-up',{userId});
        this.setTimeout(()=>{
          sendActionAnalyticsToDB( 'Consent PII',{userId});
        },3000);
        this.setTimeout(()=>{
          sendActionAnalytics('Consent PII',response.response.userDetails,{userId});
        },5000);
        sendActionAnalytics('Sign-up', response.response.userDetails,{userId});

        authenticationLogic(response.response, dispatch, (...params)=>{
          sendActionAnalytics('Login', response.response.userDetails,{userId});
          sendActionAnalyticsToDB('Login',{userId});
          callback(...params);
        });
      }else{
        callback(false, response.message);
      }
    }).catch((error)=>{
      callback(false, error.message);
    });
  };
};
export const resendOTP = (countryCode,phoneNumber,typeOfOTP, callback=()=>{})=>{
  const signUpDetails = {
    phoneNumber,
    countryCode,
    typeOfOTP
  };
  return ()=>{
    myLog(`countryCode ${ countryCode}`,`phoneNumber ${ phoneNumber}`,`typeOfOTP ${ typeOfOTP}`);
    return HttpBaseClient.get(URL.RESEND_OTP, 0, signUpDetails).then((response) => {
      myLog('response:::::', response, signUpDetails);
      if (response.responseCode === 200) {
        myLog('===============>>>>>>>>>>>>>>resend');
        callback(true, response.message);
      }else{
        callback(false, response.message);
      }
    }).catch((error)=>{
      myLog('ERROR', error);
      callback(false, error.message);
    });
  };
};

/**
 *
 * @param {*} params
 * @param {*} callback
 */
export const userSignIn = (params, callback) => {
  const signInDetails ={
    countryCode:params.countryCode,
    password: params.password,
    userName: params.userName
  };
  return (dispatch) => {
    myLog('+++++++++++++++SignINParams+++++++',signInDetails);
    return HttpBaseClient.post(URL.SIGN_IN,signInDetails ).then((response) => {
      myLog('----userSignIn response', response);
      if (response.responseCode === 200) {
        const userId = _.has(response.response.userDetails,'userId') ? response.response.userDetails.userId : '';
        setTimeout(()=>{
          sendActionAnalytics('Login', response.response.userDetails,{userId});
          sendActionAnalyticsToDB('Login',{userId});
        },5000);
        authenticationLogic(response.response, dispatch, (...params)=>{
          callback(...params);
        });
      }else if (response.responseCode === 400) {
        callback(400, response.message);
      }else if (response.responseCode === 401) {
        callback(false, response.message);
      }
      else {
        callback(false, response.message);
        dispatch({ type: SIGN_IN_FAILURE, payload: response.message });
      }
    }).catch((error) => {
      callback(false, error.message);
      dispatch({ type: SIGN_IN_ERROR, payload: error.message });
    });
  };
};

/**
 *
 * @param {*} callback
 */
export const userSignOut = (userId, callback)=>{
  return (dispatch, getState)=>{
    const{
      userData,
      attestationList
    } = getState().userState;
    if (getState().appState.isInternetConnectivityAvailable !== true) {
      myLog('::::::::::::::::::datacleared:::::::::::::::::');
      return userDataClearInLocal((...params) => {
        callback(...params);
        dispatch({ type: LOGOUT_SUCESS, payload:'' });
      });
    } else {
      return HttpBaseClient.post(URL.SIGN_OUT, {}, 1).then((response) => {
        myLog('----userSignOut response', response,userData);
        if (response.responseCode === 200) {
          const userId = _.has(userData, 'userId') ? userData.userId : '';
          sendActionAnalytics('Logout', userData,{userId});
          sendActionAnalyticsToDB('Logout',{userId});
          myLog('::::::::::::::::::datacleared:::::::::::::::::');
          userDataClearInLocal((...params) => {
            callback(...params);
          });
          dispatch({ type: LOGOUT_SUCESS, payload: '' });
        } else {
          callback(false, response.message);
          dispatch({ type: SIGN_IN_FAILURE, payload: response.message });
        }
      }).catch((error) => {
        callback(false, error.message);
        dispatch({ type: SIGN_IN_ERROR, payload: error.message });
        myLog('----userSignOut error', error);
      });
    }
  };
};

export const getUserProfile = (callback=()=>{})=>{
  return (dispatch, getState)=>{
    if (getState().appState.isInternetConnectivityAvailable !== true) {
      // dispatch(getUserDataFromDB());
      callback(true, '');
    } else {
      return HttpBaseClient.get(URL.VIEW_PROFILE, 1, {}).then((response) => {
        if (response.responseCode === 200) {
          dispatch(saveUserDataToDB(response.response),'personal');
          callback(true, response.response);
          myLog('----user profile HttpBaseClient response from backend ', response);
        }else {
          callback(false, stringsConvertor('alertMessage.somethingWrong'));
        }
      }).catch((error)=>{
        myLog('----user profile catch ', error);
        callback(false, stringsConvertor('alertMessage.somethingWrong'));
      });
    }
  };
};

export const userForgotPassword = (params, callback) => {
  const validateOTP = {
    password: params.password,
    userName: params.userName,
    countryCode:params.countryCode
  };
  return (dispatch) => {
    myLog('+++++++++++++++SignINParams+++++++',params);
    return HttpBaseClient.post(URL.FORGOT_PASSWORD, validateOTP).then((response) => {
      if (response.responseCode === 200) {
        const userId = _.has(response.response.userDetails,'userId') ? response.response.userDetails.userId : '';
        sendActionAnalytics('Forget Password', response.response.userDetails,{userId});
        sendActionAnalyticsToDB('Forget Password',{userId});
        authenticationLogic(response.response, dispatch, (...params)=>{
          sendActionAnalytics('Login', response.response.userDetails,{userId});
          sendActionAnalyticsToDB('Login',{userId});
          callback(...params);
        });
      } else {
        callback(false, response.message);
      }
    }).catch((error) => {
      callback(false, error.message);
    });
  };
};


export const onUploadPhoto =(option, callback)=>{
  return ()=>{
    if (option === 0) {
      ImagePicker.openCamera({
        width: 300,
        height: 300,
        cropping: true,
        includeBase64:true
      }).then((image) => {
        myLog('Image', image);
        callback(true, image);
        // ImagePicker.clean().then(() => {
        //   myLog('removed all tmp images from tmp directory');
        // }).catch((e) => {
        //   myLog('error',e);
        // });
      }).catch(()=>{
        callback(false, stringsConvertor('alertMessage.failedToUpload'));
      });
    }else if (option === 1) {
      ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
        includeBase64:true
      }).then((image) => {
        myLog('Image', image);
        callback(true, image);
        // ImagePicker.clean().then(() => {
        //   myLog('removed all tmp images from tmp directory');
        // }).catch((e) => {
        //   myLog('error',e);
        // });
      }).catch(()=>{
        callback(false, stringsConvertor('alertMessage.failedToUpload'));
      });
    }
  };
};


export const userAccountDeactivate=(active, callback)=>{
  return (dispatch, getState)=>{
    const{
      userData
    } = getState().userState;
    const userId = _.has(userData, 'userId') ? userData.userId : '';
    HttpBaseClient.post(URL.DEACTIVATE_ACCOUNT, {active}, 1).then((response)=>{
      myLog('userAccountDeactivate response',response);
      if (response.responseCode === 200) {
        sendActionAnalytics('Deactivate Account',userData,{userId});
        sendActionAnalyticsToDB('Deactivate Account',{userId});
        dispatch(getUserProfile());
        callback(true, response.message);
      }else{
        callback(false, response.message);
      }
    }).catch((error)=>{
      myLog('userAccountDeactivate error',error);
      callback(false, error.message);
    });
  };
};

export const imageUploadToAWS = (file, callback)=>{
  return ()=>{
    const {
      keyPrefix,
      bucket,
      region,
      accessKey,
      secretKey
    } = AWS_CONFIG;
    const options = {
      keyPrefix,
      bucket,
      region,
      accessKey,
      secretKey,
      successActionStatus: 201
    };
    myLog('imageUploadToAWS :::::::INPUT:::::', file, options);

    RNS3.put(file, options).then((response) => {
      myLog('imageUploadToAWS:::::SUCCESS:::::', response);
      if (response.status === 201) {
        callback(true, response.body.postResponse);
      }else{
        callback(false, stringsConvertor('alertMessage.failedToUpload'));
      }
    }).catch((error)=>{
      callback(false, stringsConvertor('alertMessage.failedToUpload'));
      myLog('imageUploadToAWS:::::ERROR:::::', error);
    });
  };
};
export const updateProfile = (data,nameChange,callback)=>{
  return (dispatch, getState)=>{
    const {
      userData
    } = getState().userState;
    const isRemovePhoto = data.photo === '' ? true : false;
    const userId = _.has(userData, 'userId') ? userData.userId : '';
    HttpBaseClient.put(URL.UPDATE_PROFILE, data, 1, { }).then((response) => {
      myLog('-------', response, userData, data);
      if (response.responseCode === 200) {
        dispatch(getUserProfile());
        callback(true, response.message);
        if (data.name !== userData.name) {
          sendActionAnalytics('Profile edit-Name change', userData,{userId});
          sendActionAnalyticsToDB('Profile edit-Name change',{userId});
          LocalStorageHelper.getDataFromLocal(STORAGE.USER_DATA).then((userData)=>{
            myLog(' Splash STORAGE.USER_DATA userData', userData);
            let response = JSON.parse(userData);
            response.userDetails.name = data.name;
            LocalStorageHelper.storeValueToLocal(STORAGE.USER_DATA, JSON.stringify(response)).then((userSaved) => {
            }).catch((error)=>{});
          }).catch((error)=>{});
        }
        else if(!nameChange){
          sendActionAnalytics('Profile edit-Photo change', userData,{userId});
          sendActionAnalyticsToDB('Profile edit-Photo change',{userId});
          HttpBaseClient.post(URL.NOTIFICATION_UPDATE_PHOTO, {},1,{isRemovePhoto}).then((response) => {
            myLog('===================notification update photo',response);
          }).catch((err) => {myLog('===================notification update photo',err);});
        }
      } else {
        callback(false, response.message);
      }
    }).catch((error) => {
      myLog('-------', error);
      callback(false, error.message);
    });
  };
};

export const updateEmail = (email, userId, onCallback)=>{
  return(dispatch, getState)=>{
    const params = {
      emailId: email,
      userId
    };
    const {
      userData
    } = getState().userState;
    return HttpBaseClient.get(URL.UPDATE_EMAIL, 1, params).then((response)=>{
      if (response.responseCode === 200) {
        sendActionAnalytics('Profile edit-Email Id change', userData,{userId});
        sendActionAnalyticsToDB('Profile edit-Email Id change',{userId});
        onCallback(true, response.message);
      }else{
        onCallback(false, response.message);
      }
    }).catch((error) => {
      myLog('-------', error);
      onCallback(false, error.message);
    });
  };
};
export const changePassword = ( params, callback)=>{
  return (dispatch, getState)=>{
    const{
      userData
    } = getState().userState;
    const userId = _.has(userData, 'userId') ? userData.userId : '';
    const data = {
      currentPassword: params.currentPassword,
      newPassword: params.newPassword
    };
    HttpBaseClient.post(URL.CHANGE_PASSWORD, data,1).then((response)=>{
      if (response.responseCode === 200) {
        sendActionAnalytics('Profile edit-Password change',userData,{userId});
        sendActionAnalyticsToDB('Profile edit-Password change',{userId});
        userDataClearInLocal(()=>{
          sendActionAnalytics('Logout', userData,{userId});
          sendActionAnalyticsToDB('Logout',{userId});
          callback(true, response.message);
        });
      }else{
        callback(false, response.message);
      }
    }).catch((error)=>{
      myLog('changePassword error',error);
      callback(false, error.message);
    });
  };
};

export const verifyNewPhoneNumberOTP = (phoneNumber,typeOfOTP,countryCode, callback)=>{
  const signUpDetails = {
    phoneNumber,
    countryCode,
    typeOfOTP
  };
  return ()=>{
    return HttpBaseClient.get(URL.VERIFY_OTP, 1, signUpDetails).then((response) => {
      myLog('response:::::', response, signUpDetails);
      if (response.responseCode === 200) {
        myLog('===============>>>>>>>>>>>>>>verifyNewPhoneNumberOTP',phoneNumber,countryCode);
        callback(true, response.message);
      }else{
        callback(false, response.message);
      }
    }).catch((error)=>{
      myLog('ERROR', error);
      callback(false, error.message);
    });
  };
};

export const getCountryCodeList = (callback=()=>{})=>{
  return (dispatch)=>{
    return HttpBaseClient.get(URL.COUNTRY_CODE_LIST).then((response) => {
      if (response.responseCode === 200) {
        callback(true, response.response);
        let originalResponse = response.response;
        let countryArray = [];
        _.map(originalResponse, (item)=>{
          countryArray.push(`${item.country  } (${  item.code  })`);
        });

        dispatch({type: COUNTRY_CODE_LIST, payload: originalResponse});
        dispatch({type: COUNTRY_NAME_LIST, payload: countryArray});
        myLog('----countryCode+++++++++++ ',originalResponse, countryArray);
      }else {
        callback(false, stringsConvertor('alertMessage.somethingWrong'));
      }
    }).catch((error)=>{
      myLog('----+countryCode----------- ', error);
    });
  };
};

export const userPIIShare =  (data, callback) =>{
  myLog('share Pii data check +++', data);
  const {enable} = data;
  return (dispatch, getState)=>{
    const{
      userData
    } = getState().userState;
    const userId = _.has(userData, 'userId') ? userData.userId : '';
    myLog('----Share PII  response-------', data);
    return HttpBaseClient.put(URL.SHARE_PII_PROFILE ,{},1,data).then((response)=>{
      myLog('----Share PII  response After API call-------', response);
      if (response.responseCode === 200) {
        sendActionAnalytics(enable ? 'Consent PII' :'Withdraw Consent PII', userData,{userId});
        sendActionAnalyticsToDB(enable ? 'Consent PII' :'Withdraw Consent PII',{userId});
        callback(true, response.response);
      }else{
        callback(false, response.message);
      }
    }).catch((error) => {
      callback(false, error.message);
    });
  };
};

export const documentUploadToAWS = (file, callback)=>{
  return ()=>{
    const {
      keyPrefix,
      bucket,
      region,
      accessKey,
      secretKey
    } = awsConfigDocument;
    const options = {
      keyPrefix,
      bucket,
      region,
      accessKey,
      secretKey,
      successActionStatus: 201
    };
    myLog('documentUploadToAWS :::::::INPUT:::::', file, options);

    RNS3.put(file, options).then((response) => {
      myLog('documentUploadToAWS:::::SUCCESS:::::', response);
      if (response.status === 201) {
        callback(true, response.body.postResponse);
      }else{
        callback(false, stringsConvertor('alertMessage.failedToUpload'));
      }
    }).catch((error)=>{
      callback(false, stringsConvertor('alertMessage.failedToUpload'));
      myLog('documentUploadToAWS:::::ERROR:::::', error);
    });
  };
};

export const getlinkedPrograms = (callback=()=>{})=>{
  return (dispatch, getState)=>{
    if (getState().appState.isInternetConnectivityAvailable !== true) {
      callback(false, 'Please connect to internet');
    } else {
      return HttpBaseClient.get(URL.GET_LINKEDPROGRAM, 1, {}).then((response) => {
        if (response.responseCode === 200) {
          myLog('============get all linked program===',response);
          callback(true, response.response);
        }else {
          callback(false, stringsConvertor('alertMessage.somethingWrong'));
        }
      }).catch((error)=>{
        myLog('----user linked program catch ', error);
        callback(false, stringsConvertor('alertMessage.somethingWrong'));
      });
    }
  };
};

export const addQualification =  (data, callback) =>{
  return (dispatch,getState)=>{
    const{
      userData
    } = getState().userState;
    const userId = _.has(userData, 'userId') ? userData.userId : '';
    const {qualificationTitle,documents,qualificationPrograms} = data;
    let contentFileName = '' ;
    documents.map((item)=>{
      if(contentFileName !== ''){
        contentFileName = `${contentFileName},${item}`;
      } else{
        contentFileName = item;
      }
    });
    const qualification = qualificationTitle;
    return HttpBaseClient.post(URL.ADD_QUALIFICATION, data, 1).then((response)=>{
      myLog('----addQalification response', response,data);
      if (response.responseCode === 200) {
        qualificationPrograms.map((item)=>{
          let programId = item.verifierId;
          let programName = item.verifierName;
          sendActionAnalytics('Submit Qual Req', userData,{userId,qualification,contentFileName,programId,programName});
          sendActionAnalyticsToDB('Submit Qual Req',{userId,qualification,contentFileName,programId,programName});
        });
        callback(true, response.response);
      }else{
        callback(false, response.message);
      }
    }).catch((error) => {
      callback(false, error.message);
    });
  };
};

export const getUserQualification = (callback=()=>{})=>{
  return (dispatch, getState)=>{
    if (getState().appState.isInternetConnectivityAvailable !== true) {
      callback(false, 'Please connect to internet');
    } else {
      return HttpBaseClient.get(URL.GET_USERQUALIFICATION, 1, {}).then((response) => {
        myLog('============get user qualification===',response);
        if (response.responseCode === 200) {
          myLog('============get user qualification===',response);
          dispatch(saveUserDataToDB(response.response),'qualification');
          callback(true, response.response);
        }else {
          callback(false, stringsConvertor('alertMessage.somethingWrong'));
        }
      }).catch((error)=>{
        myLog('----user qualification catch ', error);
        callback(false, stringsConvertor('alertMessage.somethingWrong'));
      });
    }
  };
};

export const userQualificationUpdate =  (data, callback) =>{
  const {qualificationPrograms,id} = data;
  const programData = {
    qualificationPrograms
  };
  return ()=>{
    myLog('----update user qualification data-------', data);
    return HttpBaseClient.put(URL.UPDATE_QUALIFICATION + id, programData ,1).then((response)=>{
      myLog('----update user qualification response-------', response);
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

export const deleteUserQualification =  (id,name, callback) =>{
  return (dispatch,getState)=>{
    const{
      userData
    } = getState().userState;
    const userId = _.has(userData, 'userId') ? userData.userId : '';
    const qualification = name;
    return HttpBaseClient.delete(URL.DELETE_QUALIFICATION+id,{}, 1).then((response)=>{
      myLog('---- Delete response++++++++++', response);
      if (response.responseCode === 200) {
        myLog('=============================== delete===========');
        sendActionAnalytics('Delete Qual', userData,{userId,qualification});
        sendActionAnalyticsToDB('Delete Qual',{userId,qualification});
        callback(true, response.response);
      }else{
        callback(false, response.message);
      }
    }).catch((error) => {
      callback(false, error.message);
    });
  };
};

export const getBaseLocationLatLongApi =(lat,long,callback) =>{
  const uurl ='BASE LOCATION API';
  return()=>{
    return HttpBaseClient.get(`${uurl}latlng=${lat},${long}`,0,{}).then((response) =>{
      if(response){
        myLog('============response on get here api call=======',response,response.results[0]);
        const locationArray = response.results[0];
        myLog('locationarray',locationArray);
        callback(true,response.results[0]);
      }
    }).catch((error) => {
      callback(false, error);
    });
  };
};
export const updateBaseLocation =  (data, callback) =>{
  return (dispatch,getState)=>{
    const{
      userData
    } = getState().userState;
    const userId = _.has(userData, 'userId') ? userData.userId : '';
    const baseLocation  = _.has(userData,'baseLocation')? userData.baseLocation: false;
    const{latitude,longitude} = data;
    const baseLocationLatitude = latitude;
    const baseLocationLongitude = longitude;
    myLog('=====i am in update base location call=====',data);
    return HttpBaseClient.post(URL.UPDATE_BASE_LOCATION, data, 1).then((response)=>{
      myLog('----update base location response', response,data);
      if (response.responseCode === 200) {
        dispatch({type:LOCATION_UPDATE_SUCCESS,payload:data});
        myLog('checkBaseLocation',baseLocation);
        if (baseLocation) {
          myLog('when true', baseLocation);
          sendActionAnalyticsToDB('Base Location Change',{userId,baseLocationLatitude,baseLocationLongitude});
          this.setTimeout(()=>{
            sendActionAnalytics('Base Location Change', userData,{userId,baseLocationLatitude,baseLocationLongitude});
          },3000);

        }else{
          myLog('when true', baseLocation);
          this.setTimeout( ()=>{
            sendActionAnalyticsToDB('Consent Location',{userId,baseLocationLatitude,baseLocationLongitude});
            sendActionAnalytics('Base Location Change', userData,{userId,baseLocationLatitude,baseLocationLongitude});
          },4000);
          sendActionAnalyticsToDB('Base Location Change',{userId,baseLocationLatitude,baseLocationLongitude});
          sendActionAnalytics('Consent Location', userData,{userId,baseLocationLatitude,baseLocationLongitude});
        }
        callback(true, response.response);
      }else{
        callback(false, response.message);
      }
    }).catch((error) => {
      callback(false, error.message);
    });
  };
};

export const getSearchedLocation =(data,callback) =>{
  const uurl ='AUTO COMPLETE API URL';
  return(dispatch)=>{
    return HttpBaseClient.get(`${uurl}input=${data}`,0,{}).then((response) =>{
      if(response){
        myLog('============response on search location api call=======',response);
        // dispatch({type:LATLONG_LOCATION_SUCCESS,payload:locationArray});
        callback(response.status,response.predictions);
      }
    }).catch((error) => {
      callback(false, error);
    });
  };
};

export const getLocationByPlaceId =(data,callback) =>{
  myLog('data12',data);
  const uurl ='MAPS API';
  return(dispatch)=>{
    return HttpBaseClient.get(`${uurl}place_id=${data.place_id}&language=${data.detectedLanguageCode}`,0,{}).then((response) =>{
      if(response){
        myLog('============response on search location place id api call=======',response);
        callback(true,response.result);
      }
    }).catch((error) => {
      callback(false, error);
    });
  };
};

export const deleteBaseLocation = (callback) =>{
  return (dispatch,getState)=>{
    const{
      userData
    } = getState().userState;
    const userId = _.has(userData, 'userId') ? userData.userId : '';
    const baseLocationLatitude = _.has(userData, 'latitude') ? userData.latitude : '';
    const baseLocationLongitude = _.has(userData, 'longitude') ? userData.longitude : '';
    return HttpBaseClient.delete(URL.DELETE_BASE_LOCATION,{}, 1).then((response)=>{
      myLog('---- Delete location response++++++++++', response);
      if (response.responseCode === 200) {
        myLog('=============================== delete===========');
        sendActionAnalytics('Withdraw Consent Location', userData,{userId,baseLocationLatitude,baseLocationLongitude});
        sendActionAnalyticsToDB('Withdraw Consent Location',{userId,baseLocationLatitude,baseLocationLongitude});
        callback(true, response);
      }else{
        callback(false, response);
      }
    }).catch((error) => {
      callback(false, error.message);
    });
  };
};
export const getConsentInfo = (userId,callback)=>{
  return()=>{
    // const{
    //   userData
    // } = getState().userState;
    // const userId = _.has(userData, 'userId') ? userData.userId : '';
    myLog('checkUserID',userId);
    return HttpBaseClient.get(URL.GETCONSENTINFO+userId, 0).then((response)=>{
      myLog('----getConsentInfo------', response);
      if (response.responseCode === 200) {
        myLog('response', response);
        callback(true, response);
      }else{
        callback(false, response);
      }
    }).catch((error) => {
      callback(false, error.message);
    });
  };

};
export const postConsentInfo = (data,callback)=>{
  myLog('data123412342',data);
  const params ={
    consentId: data.consentId,
    action : data.action,
    appType : data.appType
  };
  const userId = data.userId;
  return()=>{
    // const{
    //   userData
    // } = getState().userState;
    // const userId = _.has(userData, 'userId') ? userData.userId : '';
    return HttpBaseClient.post(URL.GETCONSENTINFO+userId,params, 0).then((response)=>{
      myLog('----postConsentInfo------', response);
      if (response.responseCode === 200) {
        myLog('response', response);
        callback(true, response);
      }else{
        callback(false, response);
      }
    }).catch((error) => {
      callback(false, error.message);
    });
  };

};
