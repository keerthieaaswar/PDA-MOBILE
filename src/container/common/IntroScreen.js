/**
 * pda
 * IntroScreen.js
 * @author PDA
 * @description Created on 06/06/2019
 * Copyright © 2019 pda. All rights reserved.
 */
import { connect } from 'react-redux';
import Into from '../../components/screens/common/Intro';

const mapStateToProps = (state) => {
  const { isInternetConnectivityAvailable } = state.appState;
  return {
    isNetworkConnected : isInternetConnectivityAvailable
  };
};


export default connect(mapStateToProps, null)(Into);
