/**
 * pda
 * NotificationReducer.js
 * @author Socion Advisors LLP
 * @description Created on 28/02/2019
 * Copyright © 2019 pda. All rights reserved.
 */
import { NOTIFICATION_COUNT_SUCCESS, NOTIFICATION_LIST_SUCCESS, NOTIFICATION_LIST_INITIAL,NOTIFICATION_LIST_ITEM_DELETE, NOTIFICATION_DELETE_SUCCESS } from '../actions/Types';
const initialState = {
  notifications : [],
  isUnReadNotification : false,
  pageSize: 10,
  pageNumber: 0,
  total: 0
};

export const notificationReducers = (state = initialState, action) => {
  switch (action.type) {
    case NOTIFICATION_COUNT_SUCCESS:
      return {
        ...state,
        isUnReadNotification: action.payload
      };
    case NOTIFICATION_LIST_SUCCESS:
      return {
        ...state,
        notifications: action.payload.notifications,
        pageSize: action.payload.pageSize,
        pageNumber: action.payload.pageNumber,
        total: action.payload.total
      };
    case NOTIFICATION_LIST_INITIAL:
      return {
        ...state,
        pageNumber: 0,
        total:0
      };
    case NOTIFICATION_DELETE_SUCCESS:
      return {
        ...state,
        notifications: action.payload
      };
    case NOTIFICATION_LIST_ITEM_DELETE:
      return {
        ...status
      };
    default:
      return state;
  }
};

export default notificationReducers;