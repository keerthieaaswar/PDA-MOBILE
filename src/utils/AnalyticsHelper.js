/**
 * pda
 * Analytics.js
 * @author Socion Advisors LLP
 * @description Created on 02/04/2019
 * Copyright © 2019 pda. All rights reserved.
 */
import {
  Platform
} from 'react-native';
// import firebase from 'react-native-firebase';
import { myLog } from './StaticFunctions';
import DeviceInfo from 'react-native-device-info';
import CleverTap from 'clevertap-react-native';
import _ from 'lodash';
import Store from '../redux/Store';
import axios from 'axios';
import PermissionHelper from './PermissionHelper';
import { stringsConvertor } from './I18n';
import  {NetworkInfo}  from 'react-native-network-info';
import Geolocation from 'react-native-geolocation-service';
import { BASE_URL, URL} from './httpClient/Url';
CleverTap.enableDeviceNetworkInfoReporting(true);
const permissionHelper = new PermissionHelper();
class AnalyticsHelper{
  sendActionAnalytics(keyName, userDetails = {}, extraParams ={}){
    let params = {
      'Timestamp': (new Date()).toString(),
      'Device Type': DeviceInfo.getDeviceType(),
      'Device Id': DeviceInfo.getUniqueID(),
      'platform': Platform.OS,
      'Web app/mobile app': 'Mobile App',
      'Identity':_.has(userDetails,'userId') ? userDetails.userId:'',
      'baseLocationLatitude': _.has(Store.getState().userState.userData,'latitude') ? Store.getState().userState.userData.latitude : '',
      'baseLocationLongitude': _.has(Store.getState().userState.userData,'longitude') ? Store.getState().userState.userData.longitude : '',
      ...extraParams,
      'Network Provider': _.has(Store.getState().appState,'internetConnectivityType') ?
        (Store.getState().appState.internetConnectivityType +  (_.has(Store.getState().appState,'internetConnectivityEffectiveType')?
          `/${  Store.getState().appState.internetConnectivityEffectiveType}`:'')): ''
    };
    async function getIpAdd() {
      const ipv4Address = await NetworkInfo.getIPV4Address();
      params = {
        ...params,
        ipAddress: ipv4Address
      };
      myLog('Analytics:::INPUT async', params);
      CleverTap.profileSet(params);
      CleverTap.recordEvent(keyName, params);
      myLog('+++++++++++++++++ip+++++++++++++++++++++++++++++++',ipv4Address);
    }
    const title = 'checkLocationAccess';
    // const title = stringsConvertor('alert.appName');
    const message = stringsConvertor('alertMessage.locationPermission');
    const permission = 'location';
    permissionHelper.permissionChecker(permission, title, message,(status)=>{
      if(status === true && !(keyName === 'Session Scan in' || keyName === 'Session Scan Out' )){
        myLog('=========================check from analytic true============',status);
        Geolocation.getCurrentPosition((position) => {
          myLog('===================location analytic================',position);
          params = {
            ...params,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          async function getIpAdd() {
            const ipv4Address = await NetworkInfo.getIPV4Address();
            params = {
              ...params,
              ipAddress: ipv4Address
            };
            myLog('Analytics:::INPUT async', params);
            CleverTap.profileSet(params);
            CleverTap.setLocation(position.coords.latitude, position.coords.longitude);
            CleverTap.recordEvent(keyName, params);
            myLog('+++++++++++++++++ip+++++++++++++++++++++++++++++++',ipv4Address);
          }
          getIpAdd().catch((error)=>{
            myLog('Analytics:::INPUT error', params);
            CleverTap.profileSet(params);
            CleverTap.setLocation(position.coords.latitude, position.coords.longitude);
            CleverTap.recordEvent(keyName, params);
            myLog('+++++++++++++++++ip error+++++++++++++++++++++++++++++++',error);});
        },
        (error) => {
          getIpAdd().catch((error)=>{
            myLog('Analytics:::INPUT error', params);
            CleverTap.profileSet(params);
            CleverTap.recordEvent(keyName, params);});
          myLog('===================location================',error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, showLocationDialog:false}
        ).catch((err)=>{
          getIpAdd().catch((error)=>{
            myLog('Analytics:::INPUT error', params);
            CleverTap.profileSet(params);
            CleverTap.recordEvent(keyName, params);});myLog('========location service catch===========',err);});
      } else{
        myLog('=========================check from analytic false============',status);
        getIpAdd().catch((error)=>{
          myLog('Analytics:::INPUT error', params);
          CleverTap.profileSet(params);
          CleverTap.recordEvent(keyName, params);});
      }
    });

  }
  sendActionAnalyticsToDB(keyName, extraParams={}){
    myLog('==============all extra params passing to telemetry=============',keyName,extraParams);
    let data ={
      'eventType': keyName,
      'timestamp': (new Date()).toString(),
      'deviceType': DeviceInfo.getDeviceType(),
      'deviceId': DeviceInfo.getUniqueID(),
      'appType': 'Mobile App',
      'osType': Platform.OS,
      'netWorkProvider': _.has(Store.getState().appState,'internetConnectivityType') ?
        (Store.getState().appState.internetConnectivityType +  (_.has(Store.getState().appState,'internetConnectivityEffectiveType')?
          `/${  Store.getState().appState.internetConnectivityEffectiveType}`:'')): '',
      'baseLocationLatitude': _.has(Store.getState().userState.userData,'latitude') ? Store.getState().userState.userData.latitude : '',
      'baseLocationLongitude': _.has(Store.getState().userState.userData,'longitude') ? Store.getState().userState.userData.longitude : '',
      ...extraParams
    };
    async function getIpAdd() {
      const ipv4Address = await NetworkInfo.getIPV4Address();
      data = {
        ...data,ipAddress: ipv4Address
      };
      axios.post(BASE_URL+URL.ENTITY_TELEMETRY, data).then((response) => {
        myLog('***********telemetry without location***********',data,response);
      }).catch((error)=>{
        myLog(error);
      });
    }
    const title = 'checkLocationAccess';
    // const title = stringsConvertor('alert.appName');
    const message = stringsConvertor('alertMessage.locationPermission');
    const permission = 'location';
    permissionHelper.permissionChecker(permission, title, message,(status)=>{
      if(status === true && !(keyName === 'Session Scan in' || keyName === 'Session Scan Out' )){
        myLog('=========================check from analytic db true============',status);
        setTimeout(()=>{
          Geolocation.getCurrentPosition((position) => {
            myLog('===================location analytic db================',position);
            data = {
              ...data,
              sessionLat: position.coords.latitude,
              sessionLon: position.coords.longitude
            };
            async function getIpAdd() {
              const ipv4Address = await NetworkInfo.getIPV4Address();
              data = {
                ...data,
                ipAddress: ipv4Address
              };
              axios.post(BASE_URL+URL.ENTITY_TELEMETRY, data).then((response) => {
                myLog('***********telemetry location success***********',data,response);
              }).catch((error)=>{
                myLog(error);
              });
            }
            getIpAdd().catch((error)=>{
              myLog('Analytics:::INPUT error', data);
              axios.post(BASE_URL+URL.ENTITY_TELEMETRY, data).then((response) => {
                myLog('***********telemetry Ip error***********',data,response);
              }).catch((error)=>{
                myLog(error);
              });
              myLog('+++++++++++++++++ip error+++++++++++++++++++++++++++++++',error);});
          },
          (error) => {
            getIpAdd().catch((error)=>{
              axios.post(BASE_URL+URL.ENTITY_TELEMETRY, data).then((response) => {
                myLog('***********telemetry location error***********',data,response);
              }).catch((error)=>{
                myLog(error);
              });
            });
            myLog('===================location error================',error.code, error.message);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, showLocationDialog:false}
          ).catch((err)=>{
            getIpAdd().catch((error)=>{
              axios.post(BASE_URL+URL.ENTITY_TELEMETRY, data).then((response) => {
                myLog('***********telemetry location error***********',data,response);
              }).catch((error)=>{
                myLog(error);
              });
            });
          });
        },10000);
      } else{
        getIpAdd().catch((error)=>{
          axios.post(BASE_URL+URL.ENTITY_TELEMETRY, data).then((response) => {
            myLog('***********telemetry without location and ip***********',data,response);
          }).catch((error)=>{
            myLog(error);
          });
          myLog('+++++++++++++++++ip error+++++++++++++++++++++++++++++++',data,error);});
      }
    });
  }
}
let analyticsHelper = new AnalyticsHelper();
export default analyticsHelper;

export const {
  sendActionAnalytics,
  sendActionAnalyticsToDB
} = analyticsHelper;