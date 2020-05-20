/**
 * pda
 * PhoneNumberUpdateScreen.js
 * @author Socion Advisors LLP
 * @description Created on 30/07/2019
 * Copyright © 2019 pda. All rights reserved.
 */

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PhoneNumberUpdate from '../../components/screens/common/PhoneNumberUpdate';
import {
  userSignIn,
  verifyNewPhoneNumberOTP,
  getCountryCodeList
} from '../../redux/actions/UserActions';

const mapStateToProps = (state) => {
  const { isInternetConnectivityAvailable } = state.appState;
  const {
    userData
  } = state.userState;
  return {
    isNetworkConnected : isInternetConnectivityAvailable,
    userData,
    countryList: state.userState.countryList,
    countryCodeWithCountryList: state.userState.countryCodeWithCountryList
  };
};


const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    userSignIn,
    verifyNewPhoneNumberOTP,
    getCountryCodeList
  },dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(PhoneNumberUpdate);