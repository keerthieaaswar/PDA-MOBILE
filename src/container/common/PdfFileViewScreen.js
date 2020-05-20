import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PdfFileView from '../../components/screens/common/PdfFileView';

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
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(PdfFileView);