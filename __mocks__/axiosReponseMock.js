import fs from 'fs';
import { URL } from '../src/utils/httpClient/Url';
import { myLog } from '../src/utils/StaticFunctions';


let SignInUrl = URL.SIGN_IN;
let viewProfile = URL.VIEW_PROFILE;
export const axiosResponseMap =(url, data, callback)=>{
  let flag = false;
  let filePath = '';
  let error = {};
  myLog('axiosResponseMap', url, data);
  
  if (url === SignInUrl) {
    if (data === null || data === undefined || !validateField(data.userName)  ||
    !validateField(data.password) ) {
      error = {
        status : 401,
        error : 'Invalid Input data',
      };
      flag = false;
    }else if (data.userName === 'test@gmail.com' && data.password === '123456' && data.grantType === 'password') {
      filePath = './__mockData__/login.json';
      flag = true;
    }else {
      error = {
        status : 500,
        error : 'Request Failed',
      };
      flag = false;
    }
  }else if (url.includes(viewProfile)) {
    if (url.includes('')) {
      filePath = './__mockData__/userProfile.json';
      flag = true;
    }else{
      error = {
        status : 500,
        error : 'Request Failed',
      };
      flag = false;
    }
  }

  if (flag) {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        callback(false, err);
        return;
      }
      //Parse the data as JSON and put in the key entity
      myLog('======axiosresponsemap',data);
      callback(true, {data: JSON.parse(data)});
    });
  }else{
    callback(false, error);
  }
};


export const validateField=(value)=>{
  if (value === null) {
    return false;
  }
  else if(value === undefined){
    return false;
  }else if (value === '') {
    return false;
  }else{
    return true;
  }
};