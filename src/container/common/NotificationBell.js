/**
 * pda
 * NotificationBell.js
 * @author Socion Advisors LLP
 * @description Created on 15/06/2019
 * Copyright © 2019 pda. All rights reserved.
 */
import { connect } from 'react-redux';
import BellIcon from '../../components/common/BellIcon';

const mapStateToProps = (state) => {
  const { isInternetConnectivityAvailable } = state.appState;
  const { isUnReadNotification } = state.notificationState;
  return {
    isNetworkConnected : isInternetConnectivityAvailable,
    isUnReadNotification
  };
};

export default connect(mapStateToProps, null)(BellIcon);
