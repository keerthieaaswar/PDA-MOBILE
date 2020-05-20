import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  attestationCardSelect,
  attestationList,
  attestationInfoDataClear
} from '../../redux/actions/AttestationAction';
import Attestation from '../../components/screens/common/Attestation';
import AttestationInfo from '../../components/screens/common/AttestationInfo';
const mapStateToProps = (state) => {
  const { isInternetConnectivityAvailable } = state.appState;
  const {
    attestation,
    cardObject,
    isAttestationListLoading
  } = state.attestationState;
  const {
    userData
  } = state.userState;
  return {
    isNetworkConnected : isInternetConnectivityAvailable,
    attestation,
    cardObject,
    userData,
    isAttestationListLoading
  };
};


const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    attestationCardSelect,
    attestationList,
    attestationInfoDataClear
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Attestation,AttestationInfo);