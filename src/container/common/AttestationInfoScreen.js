import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  attestationInfoDataClear
} from '../../redux/actions/AttestationAction';
import AttestationInfo from '../../components/screens/common/AttestationInfo';
const mapStateToProps = (state) => {
  const { isInternetConnectivityAvailable } = state.appState;
  const {
    userData
  } = state.userState;
  const {
    attestationInfo,
    isAttestationInfoLoading
  } = state.attestationState;
  return {
    isNetworkConnected : isInternetConnectivityAvailable,
    userData,
    attestationInfo,
    isAttestationInfoLoading
  };
};


const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    attestationInfoDataClear
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(AttestationInfo);