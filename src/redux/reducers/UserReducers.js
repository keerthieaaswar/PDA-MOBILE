/**
 * pda
 * UserReducers.js
 * @author Socion Advisors LLP
 * @description Created on 27/02/2019
 * Copyright © 2019 pda. All rights reserved.
 */

import { SIGN_IN_SUCCESS, GET_PROFILE_SUCCESS, REFRESH_TOKEN_SUCCESS, UPDATE_PHONE_SUCCESS, COUNTRY_NAME,
  COUNTRY_NAME_LIST, COUNTRY_CODE_LIST,LOCATION_UPDATE_SUCCESS, CONSENT_INFO_SUCCESS} from '../actions/Types';

const initialState = {
  userData: {},
  authenticationData: {},
  countryList: [],
  countryCodeWithCountryList: [],
  updatedLocation:{},
  consentInfo:{}
};


export const UserReducers = (state = initialState, action) => {
  switch (action.type) {
    case SIGN_IN_SUCCESS:
      return {
        ...state,
        userData: action.payload.userDetails,
        authenticationData: action.payload.accessTokenResponseDTO
      };
    case REFRESH_TOKEN_SUCCESS:
      return {
        ...state,
        authenticationData: action.payload.accessTokenResponseDTO
      };
    case UPDATE_PHONE_SUCCESS:
      return {
        ...state,
        authenticationData: action.payload
      };
    case GET_PROFILE_SUCCESS:
      return {
        ...state,
        userData: action.payload
      };
    case COUNTRY_NAME_LIST:
      return {
        ...state,
        countryList: action.payload
      };
    case COUNTRY_CODE_LIST:
      return {
        ...state,
        countryCodeWithCountryList: action.payload
      };
    case LOCATION_UPDATE_SUCCESS:
      return {
        ...state,
        updatedLocation:action.payload
      };
    case CONSENT_INFO_SUCCESS:
      return{
        ...state,
        consentInfo: action.payload
      };
    default:
      return state;
  }
};

export default UserReducers;