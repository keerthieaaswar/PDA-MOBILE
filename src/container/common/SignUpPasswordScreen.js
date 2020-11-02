/**
 * pda
 * SignUpPasswordScreen.js
 * @author PDA
 * @description Created on 08/06/2019
 * Copyright © 2019 pda. All rights reserved.
 */
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  setPassword
} from '../../redux/actions/UserActions';
import SignUpPassword from '../../components/screens/common/SignUpPassword';

const mapStateToProps = (state) => {
  const { isInternetConnectivityAvailable } = state.appState;
  return {
    isNetworkConnected : isInternetConnectivityAvailable
  };
};


const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setPassword
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUpPassword);
