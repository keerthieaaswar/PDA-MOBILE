/*
 * pda
 * AttestationReducers.js
 * @author PDA
 * @description Created on 27/02/2019
 * Copyright © 2019 pda. All rights reserved.
 */
import { GET_ATTESTATION_LIST_SUCCESS, ATTESTATION_CARD_OBJECT_SELECT, GET_ATTESTATION_LIST_LOADING, ATTESTATION_INFO_DETAILS_SUCCESS,SESSION_INFO_DETAILS_LOADING , SESSION_INFO_DETAILS_CLEAR_DATA} from '../actions/Types';


const initialState = {
  attestation:[],
  attestationInfo:{},
  cardObject:{},
  isAttestationListLoading: false,
  isAttestationInfoLoading:false

};


export const attestationReducers = (state = initialState, action) => {
  switch (action.type) {
    case GET_ATTESTATION_LIST_SUCCESS:
      return {
        ...state,
        attestation: action.payload
      };
    case ATTESTATION_CARD_OBJECT_SELECT:
      return {
        ...state,
        cardObject: action.payload
      };
    case ATTESTATION_INFO_DETAILS_SUCCESS:
      return{
        ...state,
        attestationInfo: action.payload
      };
    case SESSION_INFO_DETAILS_LOADING:
      return{
        ...state,
        isAttestationInfoLoading:action.payload
      };
    case GET_ATTESTATION_LIST_LOADING:
      return{
        ...state,
        isAttestationListLoading:action.payload
      };
    case SESSION_INFO_DETAILS_CLEAR_DATA:
      return{
        ...state,
        attestationInfo:action.payload
      };
    default:
      return state;
  }
};

export default attestationReducers;
