/**
 * pda
 * SignUpScreen.js
 * @author PDA
 * @description Created on 07/06/2019
 * Copyright © 2019 pda. All rights reserved.
 */
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  userSignUp,
  getCountryCodeList
} from '../../redux/actions/UserActions';
import SignUp from '../../components/screens/common/SignUp';
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
    userSignUp,
    getCountryCodeList
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
