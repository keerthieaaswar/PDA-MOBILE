/**
 * pda
 * LoginScreen.js
 * @author Socion Advisors LLP
 * @description Created on 04/06/2019
 * Copyright © 2019 pda. All rights reserved.
 */
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  userSignIn,
  getCountryCodeList
} from '../../redux/actions/UserActions';
import Login from '../../components/screens/common/Login';

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
    userSignIn,
    getCountryCodeList
  },dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);