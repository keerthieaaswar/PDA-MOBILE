/**
 * pda
 * VideoPlayScreen.js
 * @author Socion Advisors LLP
 * @description Created on 26/07/2019
 * Copyright © 2019 pda. All rights reserved.
 */

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import VideoPlay from '../../components/screens/common/VideoPlay';
import {
  updateUserDataInState
} from '../../redux/actions/UserActions';
const mapStateToProps = (state) => {
  const { isInternetConnectivityAvailable } = state.appState;
  return {
    isNetworkConnected : isInternetConnectivityAvailable
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    updateUserDataInState
  },dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(VideoPlay);