/**
 * pda
 * SplashScreen.js
 * @author Socion Advisors LLP
 * @description Created on 27/02/2019
 * Copyright © 2019 pda. All rights reserved.
 */
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  getUserDetails,
  ScanInOut
} from '../../redux/actions/ScanAction';
import {
  addTopic
} from '../../redux/actions/SessionAction';
import QrCodeScanner from '../../components/screens/common/QrCodeScanner';

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
    getUserDetails,
    ScanInOut,
    addTopic
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(QrCodeScanner);