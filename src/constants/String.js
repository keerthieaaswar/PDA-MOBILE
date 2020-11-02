/**
 * pda
 * String.js
 * @author PDA
 * @description Created on 27/02/2019
 * Copyright © 2019 pda. All rights reserved.
 */
import RNFetchBlob from 'rn-fetch-blob';
import {
  Platform
} from 'react-native';

export const STORAGE = {
  KEY_CHAIN_NAME:'@pda_LLP_Key_chain',
  SHARED_PREFERENCES_NAME:'@pda_LLP_Preferences',
  IS_LOGGED_IN:'IS_LOGGED_IN',
  USER_DATA:'@userData',
  ATTESTATION_LIST:'attestationList'
};
export const PACKAGE = {
  ANDROID: {
    PARTICIPANT: 'com.pda.participant',
    TRAINER: 'com.pda.trainer',
    PDAPARTICIPANT: 'com.pda.pda.participant',
    PDATRAINER: 'com.pda.pda.trainer'
  },
  IOS: {
    PARTICIPANT: 'com.pda.participant',
    TRAINER: 'com.pda.trainer'
  }
};
export const FOLDER ={
  ROOT: Platform.OS === 'ios' ? `${RNFetchBlob.fs.dirs.DocumentDir}` : `${RNFetchBlob.fs.dirs.DownloadDir}`,
  PROFILE:'',
  SESSION:'',
  DOWNLOAD:'',
  SHARE:'',
  ATTESTATION:''
};

export const HTTP = {
  CODE:{
    SUCCESS : 200,
    INSERT_SUCCESS: 201,
    AUTHENTICATION_FAILURE : 401,
    REQUIRED_MISSING : 403,
    REQUEST_TIMED_OUT_FAILURE : 500,
    INPUT_VALIDATION_ERROR :400,
    NOT_FOUND:404,
    NO_INTERNET: 503
  }
};
export const DATE_FORMAT ={
  UTC:'YYYY-MM-DD HH:mm:ss.SSS',
  dddMMMDDYYYYhmmA:'ddd MMM DD,YYYY h:mm A',
  dddMMMDDYYYY:'ddd MMM DD, YYYY',
  hhmmAMMMDDYYY:'hh:mm A | MMM DD, YYYY',
  hhmmA:'hh:mm A',
  YYYYMMdd:'YYYY-MM-DD',
  DDMMYYYY:'DD-MM-YYYY',
  DDMMMYYYY:'DD-MMM-YYYY',
  DDMMYYYYhhmmA:'DD-MM-YYYY hh:mm A',
  DDMMMYYYYhhmmA:'DD-MMM-YYYY hh:mm A',
  HHmmss:'HH:mm:ss',
  DDMMMMYYYY: 'DD-MMMM-YYYY',
  DDMMMMDDYYYYhmmA:'DD-MMMM-YYYY   h:mm A',
  DDMMYYYYhmmA: 'DD-MM-YYYY h:mm A',
  DDMMYYYYhmmssA: 'DD-MM-YYYY h:mm:ss A',
  DDMMMYYYYhmmssA: 'DD-MMM-YYYY h:mm:ss A',
  hmmA: 'h:mm A'

};
