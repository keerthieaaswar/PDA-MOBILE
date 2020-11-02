/**
 * pda
 * LoginScreen.js
 * @author PDA
 * @description Created on 07/06/2019
 * Copyright © 2019 pda. All rights reserved.
 */
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DashBoard from '../../components/screens/common/DashBoard';
import {
  getUnReadCount
} from '../../redux/actions/NotificationActions';
import{getUserProfile, getConsentInfo,postConsentInfo} from '../../redux/actions/UserActions';
import {offlineSyn} from '../../redux/actions/ScanAction';
const mapStateToProps = (state) => {
  const { isInternetConnectivityAvailable } = state.appState;
  return {
    isNetworkConnected : isInternetConnectivityAvailable
  };
};


const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getUnReadCount,
    offlineSyn,
    getUserProfile,
    getConsentInfo,
    postConsentInfo
  },dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(DashBoard);
