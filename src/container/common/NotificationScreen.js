/**
 * pda
 * NotificationScreen.js
 * @author Socion Advisors LLP
 * @description Created on 07/05/2019
 * Copyright © 2019 pda. All rights reserved.
 */

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Notification from '../../components/screens/common/Notification';
import {
  getNotificationList,
  setNotificationToInitial,
  putNotificationStatus
} from '../../redux/actions/NotificationActions';
import {
  attestationList,
  attestationInfoDetails
} from '../../redux/actions/AttestationAction';
const mapStateToProps = (state) => {
  const { isInternetConnectivityAvailable } = state.appState;
  const {
    notifications,
    pageSize,
    pageNumber,
    total
  } = state.notificationState;
  const {
    attestation,
    isAttestationListLoading
  } = state.attestationState;
  return {
    isNetworkConnected : isInternetConnectivityAvailable,
    notifications,
    pageSize,
    pageNumber,
    total,
    attestation,
    isAttestationListLoading
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getNotificationList,
    setNotificationToInitial,
    putNotificationStatus,
    attestationList,
    attestationInfoDetails
  },dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Notification);