/**
 * pda
 * StaticFunctions.js
 * @author PDA
 * @description Created on 27/02/2019
 * Copyright © 2019 pda. All rights reserved.
 */

import {
  Alert,
  ToastAndroid,
  Platform,
  Linking
} from 'react-native';
import { isDevelopment } from './httpClient/Url';
import { showMessage } from 'react-native-flash-message';
import { Actions } from 'react-native-router-flux';
import { COLORS } from '../constants/Color';
import RNFetchBlob from 'rn-fetch-blob';
import { stringsConvertor } from './I18n';
import PermissionHelper from './PermissionHelper';
import DeviceInfo from 'react-native-device-info';
import { Promise } from 'core-js';
let permissionHelper = new PermissionHelper();
import { FOLDER, DATE_FORMAT, PACKAGE } from '../constants/String';
import moment from 'moment';
import { verticalScale, deviceWidth } from '../theme/pdaStyleSheet';

export const isTrainerApp = ()=>{
  const id = DeviceInfo.getBundleId();
  switch (id) {
    case PACKAGE.ANDROID.PARTICIPANT:
      return false;
    case PACKAGE.ANDROID.PDAPARTICIPANT:
      return false;
    case PACKAGE.IOS.PARTICIPANT:
      return false;
    case PACKAGE.ANDROID.TRAINER:
      return true;
    case PACKAGE.ANDROID.PDATRAINER:
      return true;
    case PACKAGE.IOS.TRAINER:
      return true;
    default:
      return false;
  }
};

/**
   * To show log if only isDevelopment is true
   * @param {*} params
   */
export function myLog(...params) {
  if (isDevelopment) {
    // eslint-disable-next-line no-console
    return console.log(...params);
  }
}
export function showAlert(title, message) {
  return Alert.alert(title, message), [
    { text: stringsConvertor('alert.ok') }
  ];
}

export function validateEmail(email) {
  let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function validatePassword(password) {
  // let pass = /(?=^.{8,25}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
  let pass = /^\S*$/;
  return pass.test(password);
}
export function showErrorMessage(message = '') {
  showMessage({
    message,
    type: 'default',
    backgroundColor: COLORS.flashErrorColor,
    color: COLORS.white,
    duration:5000
  });
}

export function showNoInternetErrorMessage() {
  showMessage({
    message: stringsConvertor('alertMessage.noInternet'),
    type: 'default',
    backgroundColor: COLORS.flashErrorColor,
    color: COLORS.white
  });
}
export function IsValidJSONString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
export function showSuccessMessage(message) {
  showMessage({
    message,
    type: 'success',
    duration:5000
  });
}


export function showLoadingMessage(message) {
  myLog('-------', message);
  showMessage({
    message,
    type: 'default',
    backgroundColor: COLORS.flashLoadingBackground,
    color: COLORS.white,
    autoHide: false,
    hideOnPress: false
  });
}
export function navigateToScreen(key, params = {}) {
  myLog('======>>>>>', key, Actions.currentScene);
  if (Actions.currentScene === 'QrCodeScannerScreen' && key === 'QrCodeScannerScreen') {
    Actions.replace('DashboardScreen');
    return;
  }
  if (Actions.currentScene === key) {
    return;
  }
  if (Actions.currentScene === 'QrCodeScannerScreen') {
    Actions.replace(key, params);
  } else if (key ==='SignUpScreen'
  || key ==='SignUpScreen' ||
  key === 'OtpScreen' ||
  key === 'ForgotPasswordScreen' ||
  key === 'NotificationScreen' ||
  key === 'AttestationInfoScreen' ||
  key === 'SessionsScreen' ||
  key === 'SessionCreateScreen' ||
  key === 'AttestationsScreen'||
  key === 'QrCodeScannerScreen'||
  key === 'AccountScreen' ||
  key === 'SessionInfoScreen' ||
  key === 'VideoPlayScreen' ||
  key === 'PdfFileViewScreen'||
  key === 'AboutScreen'||
  key === 'PrivacyViewScreen' ||
  key === 'TermsConditionsViewScreen' ||
  key === 'ImageFileViewScreen') {
    Actions.push(key, params);
  }else{
    Actions.replace(key, params);
  }
}

export function fileIcon(fileType = '') {
  myLog('--File Icon', fileType);
  switch (fileType.toUpperCase()) {
    case 'MP4' || '3GP' || 'MPEG' || 'FLV':
      return 'play';
    case 'JPG' || 'JPEG' || 'PNG' || 'SVG' || 'GIF':
      return 'file-image';
    case 'AUDIO' || 'M4A' || 'MP3' || 'AAC':
      return 'music';
    case 'DOC' || 'DOCX':
      return 'file-word';
    case 'PDF':
      return 'file-pdf';
    default:
      return 'file';
  }
}

export const createFolder = (path) => {
  return new Promise((resolve, reject) => {
    RNFetchBlob.fs.exists(path).then((response, ) => {
      if (response === true) {
        resolve();
      } else {
        RNFetchBlob.fs.mkdir(path)
          .then((response) => {
            if (response === true) {
              resolve();
            } else {
              reject(stringsConvertor('alertMessage.createFileError'));
            }
          })
          .catch((err) => {
            myLog('error folder dir', err);
            reject(stringsConvertor('alertMessage.createFileError'));
          });
      }
    }).catch((error) => {
      myLog('error folder dir', error);
      reject(stringsConvertor('alertMessage.createFileError'));
    });
  });
};


export function writeFileToLocal(path, data, onCallback) {
  myLog('----File Path-----', path);
  RNFetchBlob.fs.writeFile(path, data, 'base64').then((response) => {
    myLog('writeFile response', response);
    onCallback(true, path);
  }).catch((error) => {
    myLog('error', error);
    onCallback(false, stringsConvertor('alertMessage.failed'));
  });
}

export function saveImageToLocal(data, folder, fileName, onCallback) {
  const PATH = `${FOLDER.ROOT}${folder}`;
  myLog('----saveImageToLocal-----', PATH, fileName, RNFetchBlob.fs.dirs);
  createFolder(PATH).then(() => {
    writeFileToLocal(`${`${PATH}/${fileName}`}.jpeg`, data, onCallback);
  }).catch(() => {
    onCallback(false, stringsConvertor('alertMessage.downloadError'));
  });
}

// eslint-disable-next-line max-lines-per-function
export async function downloadFileFromUrl(fileName, url, folder, isNotification, onCallback) {
  myLog('::::::downloadFileFromUrl:::::', fileName, url, folder, isNotification);
  const title = stringsConvertor('alert.appName');
  const message = stringsConvertor('alertMessage.storagePermission');
  const permission = 'storage';
  const PATH = FOLDER.ROOT + folder;
  myLog('++++++++++FIle Name Check++++',fileName);
  const fileNameWithPath = `${PATH}/${fileName.replace(/[`~!@#$%^&*()_|+\-=?;:'",<>\{\}\[\]\\\/]/gi, '')}`;
  myLog('++++++++++FIle Name Check++++',fileNameWithPath);
  if (Platform.OS === 'ios') {
    await RNFetchBlob.fs.exists(fileNameWithPath)
      .then(async (exist) => {
        if (exist === true) {
          await RNFetchBlob.fs.unlink(fileNameWithPath).catch((error) => { myLog(':::exists1111:error', error); });
        }
      }).catch((error)=>{
        myLog(':::exists2222::error', error);
        onCallback(false);
      });
    myLog(':::exists::DONE5555', PATH);
    createFolder(PATH).then(() => {
      RNFetchBlob.config({
        path: fileNameWithPath
      })
        .fetch('GET', url, {
          //some headers ..
        }
        )
        // .progress((received, total) => {
        //   const downloaded = ((received / total) * 100).toFixed(0);
        //   myLog('progress', received, total, downloaded);
        //   onCallback('progress', stringsConvertor('alertMessage.downloaded'));
        // })
        .then(() => {
          myLog('=====inside fetch then=====',url);
          onCallback(true, fileNameWithPath);
        }).catch((error)=>{
          myLog(':::DOWNLOAD333::error', error);
          onCallback(false);
        });
    }).catch(() => {
      onCallback(false);
    });
  } else {
    permissionHelper.permissionChecker(permission, title, message, async (status) => {
      myLog('storage status', status, fileNameWithPath);
      let option = {
        path: fileNameWithPath
      };
      if (isNotification) {
        option = {
          addAndroidDownloads: {
            useDownloadManager: true,
            title: fileName,
            description: fileName,
            path: fileNameWithPath,
            mediaScannable: true,
            notification: true
          },
          fileCache: true
        };
      }
      if (status === true) {
        await RNFetchBlob.fs.exists(fileNameWithPath)
          .then(async (exist) => {
            if (exist === true) {
              await RNFetchBlob.fs.unlink(fileNameWithPath).catch((error) => { myLog(':::exists::error', error); });
            }
          }).catch((error)=>{
            myLog(':::exists::error', error);
            onCallback(false, stringsConvertor('alertMessage.downloadError'));
          });
        myLog(':::exists::DONE');
        createFolder(PATH).then(() => {
          RNFetchBlob.config(option)
            .fetch('GET', url, {
              //some headers ..
            })
            .progress((received, total) => {
              myLog('progress', received, total, received / total);
            })
            .then((res) => {
              myLog('Download success', res, res.data);
              if (isNotification) {
                ToastAndroid.showWithGravity(
                  stringsConvertor('alertMessage.downloadSuccess'),
                  ToastAndroid.LONG,
                  ToastAndroid.BOTTOM
                );
              }
              onCallback(true, `file://${res.data}`);
            }).catch((error)=>{
              myLog(':::DOWNLOAD::error', error);
              onCallback(false, stringsConvertor('alertMessage.downloadError'));
            });
        }).catch(() => {
          onCallback(false, stringsConvertor('alertMessage.downloadError'));
        });
      } else {
        showErrorMessage(stringsConvertor('validationMessage.storagePermissionDenied'));
        onCallback(false, stringsConvertor('validationMessage.storagePermissionDenied'));
      }
    });
  }
}
export function convertDateToUTC(date, format = DATE_FORMAT.UTC) {
  // myLog('convertDateToUTC::INPUT', moment(date));
  let dateConvert = '';
  if (moment(date).isValid()) {
    // myLog('convertDateToUTC::VALLED', date);
    dateConvert = moment(date).utc().format(format);
  }
  // myLog('convertDateToUTC::OUTPUT', dateConvert);
  return dateConvert;
}

export const findDays = (startDate, endDate) => {
  let a = moment(endDate);
  let b = moment(startDate);
  return a.diff(b, 'days');
};

export const convertDateToLocal = (date = '', format) => {
  // myLog('convertDateToUTC::INPUT', date);
  let dateConvert = '';
  if (moment(date).isValid()) {
    dateConvert = moment.utc(date.toString()).local().format(format);
  }
  // myLog('convertDateToUTC::OUTPUT', dateConvert);
  return dateConvert;
};

export const convertToTitleCase = (str) => {
  return str.toLowerCase().replace(/\b(\w)/g, (s) => s.toUpperCase());
};
export const insertValueInArrayIndex = (arr, index, newItem) => [
  // part of the array before the specified index
  ...arr.slice(0, index),
  // inserted item
  newItem,
  // part of the array after the specified index
  ...arr.slice(index)
];

export const getNumberOfLines = (text,x=1) =>{
  const fontSize = verticalScale(12);
  const containerWidth = deviceWidth*x;
  const fontConstant = 2;
  let cpl = Math.floor(containerWidth / (fontSize / fontConstant) );
  const words = text.split(' ');
  const elements = [];
  let line = '';
  while(words.length > 0){
    if(line.length + words[0].length + 1 <= cpl || line.length === 0 && words[0].length + 1 >= cpl){
      let word = words.splice(0,1);
      if(line.length === 0){
        line = word;
      }else {
        line = `${line  } ${  word}`;
      }
      if(words.length === 0){
        elements.push(line);
      }
    }
    else {
      elements.push(line);
      line = '';
    }
  }
  return elements.length;
};

export function validateText(text){
  let textExp = /\S/;
  return textExp.test(text);
}
export function validateSpecialChar(text){
  let textCharExp = /[!@#$%^&*(),.?":{}|<>_]/;
  return textCharExp.test(text);
}
export function validateUrl(text){
  let textUrlExp = /.*\\..*$/;
  myLog('check validation+++++++', textUrlExp.test(text));
  return textUrlExp.test(text);
}

export function updateAppNotice(response){
  const APP_STORE_LINK_PARTICIPANT = 'Provide Link';
  const APP_STORE_LINK_TRAINER = 'Provide Link';
  const PLAY_STORE_LINK_PARTICIPANT = 'Provide Link';
  const PLAY_STORE_LINK_TRAINER = 'Provide Link';
  Alert.alert(
    'Update Available',
    `This version of the app is outdated. Please update app from the ${Platform.OS =='ios' ? 'app store' : 'play store'}.`,
    [
      response.recommendUpgrade && !response.forceUpgrade ? {
        text:'Update Later', onPress:()=>{},
        style: 'cancel'
      } : null,
      {text: 'Update Now', onPress: () => {
        if(Platform.OS =='ios'){
          Linking.openURL(isTrainerApp() ?APP_STORE_LINK_TRAINER:APP_STORE_LINK_PARTICIPANT ).catch((err) =>{});
        }
        else{
          Linking.openURL( isTrainerApp() ?  PLAY_STORE_LINK_TRAINER :PLAY_STORE_LINK_PARTICIPANT ).catch((err) => {});
        }
      }}
    ],
    {cancelable: false},
  );
}
