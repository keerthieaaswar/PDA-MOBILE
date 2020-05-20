import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  sessionList,
  sessionCardSelect,
  sessionInfoDetails
} from '../../redux/actions/SessionAction';
import Session from '../../components/screens/trainer/Session';
const mapStateToProps = (state) => {
  const { isInternetConnectivityAvailable } = state.appState;
  const {
    sessions,
    cardObject
  } = state.sessionState;
  const isSessionListLoading =  state.sessionState.isSessionListLoading;
  const {
    userData
  } = state.userState;
  return {
    isNetworkConnected : isInternetConnectivityAvailable,
    sessions,
    cardObject,
    isSessionListLoading,
    userData
  };
};


const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    sessionList,
    sessionCardSelect,
    sessionInfoDetails
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Session);