import LocalStorageHelper from './LocalStorageHelper';
import { STORAGE } from '../constants/String';
import { myLog } from './StaticFunctions';
import { stringsConvertor } from './I18n';

class OfflineHelper {

  getAttestation(){
    return new Promise((resolve, reject)=>{
      LocalStorageHelper.getDataFromLocal(STORAGE.ATTESTATION_LIST).then((response)=>{
        if (response) {
          let data = JSON.parse(response);
          resolve(data);
        }else {
          reject('error');
        }
      }).catch((error) =>{
        reject(error);
      });
    });
  }

  setAttestation(data){
    return new Promise((resolve, reject)=>{
      data = JSON.stringify(data);
      LocalStorageHelper.storeValueToLocal(STORAGE.ATTESTATION_LIST, data).then((response)=>{
        if (response === true) {
          resolve(true);
        }else {
          reject('error');
        }
      }).catch((error) =>{
        reject(error);
      });
    });
  }
  setAttestationDetails(key, data){
    myLog('setAttestationDetails',key.toString(), data);
    return new Promise((resolve, reject)=>{
      data = JSON.stringify(data);
      LocalStorageHelper.storeValueToLocal(key.toString(), data).then((response)=>{
        if (response === true) {
          resolve(true);
        }else {
          reject('error');
        }
      }).catch((error) =>{
        reject(error);
      });
    });
  }

  getAttestationDetails(key){
    myLog('getAttestationDetails',key);
    return new Promise((resolve, reject)=>{
      LocalStorageHelper.getDataFromLocal(key.toString()).then((response)=>{
        if (response) {
          let data = JSON.parse(response);
          resolve(data);
        }else {
          reject('error');
        }
      }).catch((error) =>{
        reject(error);
      });
    });
  }


  getScanDetails(){
    return new Promise((resolve, reject)=>{
      LocalStorageHelper.getDataFromLocal('scan').then((response)=>{
        if (response) {
          let data =  JSON.parse(response);
          resolve(data);
        }else {
          reject('error');
        }
      }).catch((error) =>{
        reject(error);
      });
    });
  }

  setScanDetails(data,onCallback=()=>{}){
    return new Promise((resolve, reject)=>{
      data = JSON.stringify(data);
      LocalStorageHelper.storeValueToLocal('scan', data).then((response)=>{
        myLog('===========check response during storage==========',response);
        if (response === true) {
          let dataParsed = JSON.parse(data);
          let index = dataParsed.length;
          onCallback(true, dataParsed[index-1].sessionName);
          resolve(true);
        }else {
          reject('error');
          onCallback(false, stringsConvertor('qrScanner.tryScanAgain'));
        }
      }).catch((error) =>{
        onCallback(false, stringsConvertor('qrScanner.tryScanAgain'));
        reject(error);
      });
    });
  }
}
let offlineHelper = new OfflineHelper();
export { offlineHelper as OfflineHelper};