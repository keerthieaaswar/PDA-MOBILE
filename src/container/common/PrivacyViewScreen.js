/**
 * pda
 * PrivacyViewScreen.js
 * @author Socion Advisors LLP
 * @description Created on 09/10/2019
 * Copyright © 2019 pda. All rights reserved.
 */

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PrivacyView from '../../components/screens/common/PrivacyView';


const mapStateToProps = (state) => {
  const { isInternetConnectivityAvailable } = state.appState;
  return {
    isNetworkConnected : isInternetConnectivityAvailable
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    //updateUserDataInState
  },dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(PrivacyView);