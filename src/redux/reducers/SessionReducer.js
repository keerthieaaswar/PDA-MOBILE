/*
 * pda
 * sessionReducers.js
 * @author PDA
 * @description Created on 27/02/2019
 * Copyright © 2019 pda. All rights reserved.
 */
import { GET_SESSION_LIST_SUCCESS, SESSION_CARD_OBJECT_SELECT, GET_SESSION_LIST_LOADING,
  SESSION_INFO_DETAILS_SUCCESS,GET_TRAININGORGANIZATIONLIST_SUCCESS, GET_ATTESTATION_TEMPLATE_SUCCESS,
  GET_ATTESTATION_TEMPLATE_LOADING,SESSION_INFO_DATA_CLEAR_SUCCESS, GET_ADDITIONAL_LINK_SUCCESS } from '../actions/Types';


const initialState = {
  sessions: [],
  cardObject:{},
  sessionInfo:{},
  isSessionListLoading: false,
  trainingOrganizationOriginal:[],
  trainingOrganizationArray:[],
  traineeAttestationTemplateArray: [],
  memberAttestationTemplateArray:[],
  isAttestationTemplateLoading:false,
  additionalLinkArray:[]
};


export const sessionReducers = (state = initialState, action) => {
  switch (action.type) {
    case GET_SESSION_LIST_SUCCESS:
      return {
        ...state,
        sessions: action.payload
      };
    case SESSION_CARD_OBJECT_SELECT:
      return {
        ...state,
        cardObject: action.payload
      };
    case SESSION_INFO_DETAILS_SUCCESS:
      return {
        ...state,
        sessionInfo: action.payload
      };
    case GET_SESSION_LIST_LOADING:
      return {
        ...state,
        isSessionListLoading: action.payload
      };
    case GET_TRAININGORGANIZATIONLIST_SUCCESS:
      return {
        ...state,
        trainingOrganizationOriginal:action.payload.trainingOrganizationOriginal,
        trainingOrganizationArray:action.payload.trainingOrganizationArray
      };
    case GET_ATTESTATION_TEMPLATE_SUCCESS:
      return {
        ...state,
        traineeAttestationTemplateArray:action.payload.traineeAttestationTemplateArray,
        memberAttestationTemplateArray: action.payload.memberAttestationTemplateArray
      };
    case GET_ATTESTATION_TEMPLATE_LOADING:
      return{
        ...state,
        isAttestationTemplateLoading:action.payload
      };
    case SESSION_INFO_DATA_CLEAR_SUCCESS:
      return{
        ...state,
        sessionInfo:action.payload
      };
    case GET_ADDITIONAL_LINK_SUCCESS:
      return{
        ...state,
        additionalLinkArray:action.payload.additionalLinkArray
      }
    default:
      return state;
  }
};

export default sessionReducers;
