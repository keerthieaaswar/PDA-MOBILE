/**
 * pda
 * SignUpSuccessScreen.js
 * @author PDA
 * @description Created on 09/06/2019
 * Copyright © 2019 pda. All rights reserved.
 */
import { connect } from 'react-redux';
import SignUpSuccess from '../../components/screens/common/SignUpSuccess';

const mapStateToProps = (state) => {
  const { isInternetConnectivityAvailable } = state.appState;
  return {
    isNetworkConnected : isInternetConnectivityAvailable
  };
};


export default connect(mapStateToProps, null)(SignUpSuccess);
