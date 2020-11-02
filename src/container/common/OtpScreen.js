/**
 * pda
 * ForgotPasswordScreen.js
 * @author PDA
 * @description Created on 04/06/2019
 * Copyright © 2019 pda. All rights reserved.
 */

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Otp from '../../components/screens/common/Otp';
import {
  resendOTP,
  validateOTP,
  userSignOut,
  verifyNewPhoneNumberOTP,
  userSignUp
} from '../../redux/actions/UserActions';

const mapStateToProps = (state) => {
  const { isInternetConnectivityAvailable } = state.appState;
  const {
    userData
  } = state.userState;
  return {
    isNetworkConnected : isInternetConnectivityAvailable,
    userData
  };
};


const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    resendOTP,
    validateOTP,
    userSignOut,
    verifyNewPhoneNumberOTP,
    userSignUp
  },dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Otp);
