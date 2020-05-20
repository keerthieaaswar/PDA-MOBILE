/**
 * pda
 * ForgotPasswordScreen.js
 * @author Socion Advisors LLP
 * @description Created on 04/06/2019
 * Copyright © 2019 pda. All rights reserved.
 */

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ForgotPassword from '../../components/screens/common/ForgotPassword';
import {
  resendOTP,
  getCountryCodeList
} from '../../redux/actions/UserActions';

const mapStateToProps = (state) => {
  const { isInternetConnectivityAvailable } = state.appState;
  return {
    isNetworkConnected : isInternetConnectivityAvailable,
    countryList: state.userState.countryList,
    countryCodeWithCountryList: state.userState.countryCodeWithCountryList
  };
};


const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    resendOTP,
    getCountryCodeList
  },dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);