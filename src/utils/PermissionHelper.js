import { myLog } from './StaticFunctions';
import {PERMISSIONS, check, openSettings, request, RESULTS} from 'react-native-permissions';
import {
  Alert,
  Platform
} from 'react-native';
import { stringsConvertor } from './I18n';

export default class PermissionHelper {

  permissionChecker(permission, title, message, callback){
    let permissionName = '';

    if(permission === 'location'){
      permissionName =  Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_ALWAYS
      });
    }else if (permission === 'storage'){
      permissionName = PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
    }

    if(permissionName.length === 0){
      return;
    }
    check(permissionName)
      .then((response) => {
        myLog('response', response);
        switch (response) {
          case RESULTS.UNAVAILABLE:
            callback(false);
            myLog(
              'This feature is not available (on this device / in this context)',
            );
            break;
          case RESULTS.DENIED:
            this.requestPermission(permission, callback);
            myLog(
              'The permission has not been requested / is denied but requestable',
            );
            break;
          case RESULTS.GRANTED:
            callback(true);
            myLog('The permission is granted');
            break;
          case RESULTS.BLOCKED:
            myLog('The permission is denied and not requestable anymore');
            callback(false);
            break;
        }
      })
      .catch((error) => {
        myLog('permissionChecker:::::::::ERROR::', error);
        callback(false);
      });
  }


  requestPermission(permission, callback) {
    let permissionName = '';

    if(permission === 'location'){
      permissionName =  Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_ALWAYS
      });
    }else if (permission === 'storage'){
      permissionName = PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
    }
    else if(permission === 'camera'){
      permissionName =  Platform.select({
        ios: PERMISSIONS.IOS.CAMERA
      });
    }

    if(permissionName.length === 0){
      return;
    }
    request(permissionName).then((response) => {
      myLog('requestPermission:::::::::DEFAULT::RESPONSE::', permission, response);
      if (response === 'granted') {
        callback(true);
      }else{
        callback(false);
      }
    }).catch((error) => {
      myLog('requestPermission:::::::::DEFAULT::ERROR::', error);
      callback(false);
    });
    myLog('requestPermission:::::::::DEFAULT::', permission);
  }

  /**
   * Show alert to enable storage permission
   */
  showPermissionAlert(title, message, response,permission, callback){
    Alert.alert(
      title,
      message,
      [
        {
          text: Platform.OS === 'ios'? stringsConvertor('alertMessage.notNow') : 'OK',
          onPress: () => {callback(false);},
          style: 'cancel'
        },
        // response === 'undetermined' && Platform.OS === 'ios'
        //   ? { text: stringsConvertor('alert.ok'), onPress: () => callback(true) }
        //   : { text: Platform.OS === 'ios' ? 'Open Settings':'Allow', onPress: () => {
        //     if (Platform.OS === 'ios') {
        //       openSettings();
        //     }else{
        //       callback(true);
        //     }
        //   } }
        Platform.OS === 'ios'
          ? {'Open Settings':'Allow', onPress: () => {
            openSettings();
          }}:null
      ],
    );
  }
}
