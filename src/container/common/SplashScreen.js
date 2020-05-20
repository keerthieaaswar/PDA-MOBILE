/**
 * pda
 * SplashScreen.js
 * @author Socion Advisors LLP
 * @description Created on 27/02/2019
 * Copyright © 2019 pda. All rights reserved.
 */

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Splash from '../../components/screens/common/Splash';
import {
  updateUserDataInState
} from '../../redux/actions/UserActions';
import {
  checkAppUpdate
} from '../../redux/actions/AppActions';
const mapStateToProps = (state) => {
  const { isInternetConnectivityAvailable } = state.appState;
  return {
    isNetworkConnected : isInternetConnectivityAvailable
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    updateUserDataInState,
    checkAppUpdate
  },dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Splash);