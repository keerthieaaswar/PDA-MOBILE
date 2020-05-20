import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SessionInfo from '../../components/screens/trainer/SessionInfo';
import {
  sessionInfoDetails,
  sessionUpdate,
  addMember,
  updateMember,
  deleteMember,
  deleteSession,
  sessionList,
  additionalLinkUpdate,
  deleteAdditionalLink
} from '../../redux/actions/SessionAction';
const mapStateToProps = (state) => {
  const { isInternetConnectivityAvailable } = state.appState;
  const {
    sessionInfo,
    additionalLinkArray
  } = state.sessionState;
  const {
    userData
  } = state.userState;
  return {
    isNetworkConnected : isInternetConnectivityAvailable,
    sessionInfo,
    userData,
    additionalLinkArray
  };
};


const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    sessionInfoDetails,
    sessionUpdate,
    updateMember,
    addMember,
    deleteMember,
    deleteSession,
    sessionList,
    additionalLinkUpdate,
    deleteAdditionalLink
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SessionInfo);
