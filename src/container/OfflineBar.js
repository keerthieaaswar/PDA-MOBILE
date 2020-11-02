/**
 * pda
 * OfflineBar.js
 * @author PDA
 * @description Created on 27/02/2019
 * Copyright © 2019 pda. All rights reserved.
 */

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  saveInternetConnectivityStatus,
  saveInternetConnectivityType
} from '../redux/actions/AppActions';
import {offlineSyn} from '../redux/actions/ScanAction';
import OfflineBar from '../components/common/rnOfflineStatus';

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    saveInternetConnectivityStatus,
    saveInternetConnectivityType,
    offlineSyn
  },dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(OfflineBar);
