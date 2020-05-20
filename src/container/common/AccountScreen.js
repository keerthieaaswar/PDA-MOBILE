import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  changePassword,
  userSignOut,
  getUserProfile,
  onUploadPhoto,
  imageUploadToAWS,
  updateProfile,
  updateEmail,
  userAccountDeactivate,
  resendOTP,
  userPIIShare,
  getlinkedPrograms,
  documentUploadToAWS,
  addQualification,
  getUserQualification,
  userQualificationUpdate,
  deleteUserQualification,
  getBaseLocationLatLongApi,
  updateBaseLocation,
  getSearchedLocation,
  getLocationByPlaceId,
  deleteBaseLocation
} from '../../redux/actions/UserActions';
import Account from '../../components/screens/common/Account';

const mapStateToProps = (state) => {
  const { isInternetConnectivityAvailable } = state.appState;
  const {
    userData,
    updatedLocation
  } = state.userState;
  return {
    isNetworkConnected : isInternetConnectivityAvailable,
    userData,
    updatedLocation
  };
};


const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    userSignOut,
    changePassword,
    getUserProfile,
    onUploadPhoto,
    imageUploadToAWS,
    updateProfile,
    updateEmail,
    userAccountDeactivate,
    resendOTP,
    userPIIShare,
    getlinkedPrograms,
    documentUploadToAWS,
    addQualification,
    getUserQualification,
    userQualificationUpdate,
    deleteUserQualification,
    getBaseLocationLatLongApi,
    updateBaseLocation,
    getSearchedLocation,
    getLocationByPlaceId,
    deleteBaseLocation
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Account);
