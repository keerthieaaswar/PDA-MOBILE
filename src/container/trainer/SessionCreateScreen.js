/**
 * pda
 * SessionCreateScreen.js
 * @author Socion Advisors LLP
 * @description Created on 10/06/2019
 * Copyright © 2019 pda. All rights reserved.
 */
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SessionCreate from '../../components/screens/trainer/SessionCreate';
import {
  sessionCreate
} from '../../redux/actions/SessionAction';
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
    sessionCreate
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SessionCreate);
