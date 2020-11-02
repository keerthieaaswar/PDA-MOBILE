/**
 * pda
 * TermsConditionsViewScreen.js
 * @author PDA
 * @description Created on 07/09/2019
 * Copyright © 2019 pda. All rights reserved.
 */

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TermsConditionsView from '../../components/screens/common/TermsConditionsView';


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

export default connect(mapStateToProps, mapDispatchToProps)(TermsConditionsView);
