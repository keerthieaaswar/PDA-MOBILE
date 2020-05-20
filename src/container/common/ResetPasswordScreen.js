/**
 * pda
 * ForgotPasswordScreen.js
 * @author Socion Advisors LLP
 * @description Created on 04/06/2019
 * Copyright © 2019 pda. All rights reserved.
 */

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ResetPassword from '../../components/screens/common/ResetPassword';
import {
  userForgotPassword
} from '../../redux/actions/UserActions';

const mapStateToProps = (state) => {
  const { isInternetConnectivityAvailable } = state.appState;
  return {
    isNetworkConnected : isInternetConnectivityAvailable
  };
};


const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    userForgotPassword
  },dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);