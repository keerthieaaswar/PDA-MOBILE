/**
 * pda
 * AppReducer.js
 * @author PDA
 * @description Created on 27/02/2019
 * Copyright © 2019 pda. All rights reserved.
 */

import { HAS_INTERNET_CONNECTIVITY, UPDATE_COUNTRY_CODE,HAS_INTERNET_CONNECTIVITY_TYPE } from '../actions/Types';

export const initialState = {
  isInternetConnectivityAvailable : true,
  countryCode: '',
  internetConnectivityType: '',
  internetConnectivityEffectiveType: ''
};

export const AppReducer =(state = initialState, action)=>{
  switch (action.type) {
    case HAS_INTERNET_CONNECTIVITY :
      return {
        ...state,
        isInternetConnectivityAvailable : action.isInternetConnectivityAvailable
      };
    case UPDATE_COUNTRY_CODE:
      return {
        ...state,
        countryCode: action.payload
      };
    case HAS_INTERNET_CONNECTIVITY_TYPE:
      return{
        ...state,
        internetConnectivityType: action.networkInfo.type,
        internetConnectivityEffectiveType: action.networkInfo.effectiveType
      };
    default:
      return state;
  }
};

export default AppReducer;
