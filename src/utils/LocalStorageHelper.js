/**
 * pda
 * LocalStorageHelper.js
 * @author Socion Advisors LLP
 * @description Created on 27/02/2019
 * Copyright © 2019 pda. All rights reserved.
 */

import SInfo from 'react-native-sensitive-info';
import { STORAGE } from '../constants/String';
import { myLog } from './StaticFunctions';

export default class LocalStorageHelper {

    /**
   * Method used to store the value to Local Storage
   * @param  {} key - Stored key
   * @param  {} value - Stored values
   */
    static storeValueToLocal =(key, value)=>{
      return new Promise(function (success, failed) {
        SInfo.setItem(key, value, {
          sharedPreferencesName: STORAGE.SHARED_PREFERENCES_NAME,
          keychainService: STORAGE.KEY_CHAIN_NAME
        }).then((res) => {
          if(res !== null){
            success(true);
          } else{
            failed(false);
          }
        })
          .catch((error) => {
            failed(error);
            myLog(error.message,error.code);
          });
      });

    }

    /**
   * Method used to get the value from Local Storage
   * @param  {} key - Stored key
   */
    static getDataFromLocal=(key)=>{
      return new Promise(function (success, failed) {
        try {
          SInfo.getItem(key, {
            sharedPreferencesName: STORAGE.SHARED_PREFERENCES_NAME,
            keychainService: STORAGE.KEY_CHAIN_NAME}).then((value) => {
            if (value !== null && value !== undefined) {
              success(value);
            }else {
              success('');
            }
          });
        } catch (error) {
          failed(error);
        }
      });
    }


    /**
   * Method used to delete the value from Local Storage
   * @param  {} key - Stored key
   */
    static deleteDataFromLocal =(key)=>{
      return new Promise(function (success, failed) {
        SInfo.deleteItem(key, {
          sharedPreferencesName: STORAGE.SHARED_PREFERENCES_NAME,
          keychainService: STORAGE.KEY_CHAIN_NAME,
          attestataionData: STORAGE.ATTESTATION_LIST,
        }).then(() => {
          success(true);
        }).catch((error) => {
          failed(error);
          myLog(error);
        });
      });

    }
}