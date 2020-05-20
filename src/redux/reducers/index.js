/**
 * pda
 * index.js
 * @author Socion Advisors LLP
 * @description Created on 27/02/2019
 * Copyright © 2019 pda. All rights reserved.
 */

import { combineReducers } from 'redux';
import AppReducer from './AppReducer';
import UserReducers from './UserReducers';
import sessionReducers from './SessionReducer';
import attestationReducers from './AttestationReducer';
import notificationReducers from './NotificationReducer';
import { LOGOUT_SUCESS } from '../actions/Types';

const appReducer = combineReducers({
  appState : AppReducer,
  userState : UserReducers,
  sessionState : sessionReducers,
  attestationState : attestationReducers,
  notificationState: notificationReducers
});
const rootReducer = (state, action) => {
  // when a logout action is dispatched it will reset redux state
  if (action.type === LOGOUT_SUCESS) {
    state = undefined;
  }

  return appReducer(state, action);
};
export default rootReducer;
