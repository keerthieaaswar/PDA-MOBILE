/**
 * pda
 * EmailUpdateScreen.js
 * @author PDA
 * @description Created on 01/08/2019
 * Copyright © 2019 pda. All rights reserved.
 */

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import EmailUpdate from '../../components/screens/common/EmailUpdate';
import {
  updateEmail
} from '../../redux/actions/UserActions';

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
    updateEmail
  },dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(EmailUpdate);
