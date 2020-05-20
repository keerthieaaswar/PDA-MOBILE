/**
 * pda
 * Account.js
 * @author Socion Advisors LLP
 * @description Created on 07/06/2019
 * Copyright © 2019 pda. All rights reserved.
 */
import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Platform,
  Modal,
  Animated,
  Easing,
  Alert
} from 'react-native';
import Spinner from 'react-native-spinkit';
import LinearGradient from 'react-native-linear-gradient';
import Share from 'react-native-share';
import { deviceHeight, verticalScale, TEXT_TYPE, FONT_FAMILY, deviceWidth, horizontalScale } from '../../../theme/pdaStyleSheet';
import ButtonWithIcon from '../../common/ButtonWithIcon';
import AesUtil from '../../../utils/AesUtil';
import { myLog, showErrorMessage, showSuccessMessage, showLoadingMessage, showNoInternetErrorMessage,downloadFileFromUrl, navigateToScreen, validateText, validateSpecialChar} from '../../../utils/StaticFunctions';
import Toolbar from '../../common/Toolbar';
import { stringsConvertor } from '../../../utils/I18n';
import BottomMenu from '../../common/BottomMenu';
import Ripple from '../../common/rippleEffect';
import Switch from 'react-native-switch-pro';
import Button from '../../common/Button';
import TextInput from '../../common/TextInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import QrCodeModal from '../../common/QrCodeModal';
import { Actions } from 'react-native-router-flux';
import PropTypes from 'prop-types';
import QRCode from 'react-native-qrcode-svg';
import { hideMessage } from 'react-native-flash-message';
import ActionSheet from 'react-native-actionsheet';
import RootView from '../../common/RootView';
import NotificationBell from '../../../container/common/NotificationBell';
import { FOLDER } from '../../../constants/String';
import _ from 'lodash';
import { COLORS } from '../../../constants/Color';
import CustomIcon from '../../common/CustomIcon';
import RoundedButtonWithIcon from '../../common/RoundedButtonWithIcon';
import AddQualificationsAndRole from '../../common/AddQualificationsAndRole';
import PermissionHelper from '../../../utils/PermissionHelper';
import Geolocation from 'react-native-geolocation-service';
import SearchLocationModel from '../../common/SearchLocationModel';
import ToggleSwitchButton from '../../common/ToggleSwitchButton';

const permissionHelper = new PermissionHelper();
function elevationShadowStyle(elevation) {
  return {
    elevation,
    shadowColor: 'black',
    shadowOffset: { width: 3.5, height: 0.55 * elevation },
    shadowOpacity: 0.2,
    shadowRadius: 0.50 * elevation
  };
}
function elevationShadowButtonStyle(elevation) {
  return {
    elevation,
    shadowColor: 'black',
    shadowOffset: { width: 4, height: 0.4 * elevation },
    shadowRadius: 0.45 * elevation,
    shadowOpacity: 0.2
  };
}

const styles = StyleSheet.create({
  profileCard:{
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: {
      height: 0,
      width: 0
    },
    elevation: 8,
    backgroundColor:COLORS.white,
    borderRadius: 8
  },
  ProfileImageContainer:{
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    backgroundColor:COLORS.white,
    height:verticalScale(150),
    width: verticalScale(150),
    borderRadius: verticalScale(75),
    overflow:'hidden',
    alignItems:'center',
    justifyContent:'center'
  },
  buttonContainer:{
    padding:15,
    flexDirection:'row',
    alignItems:'center',
    backgroundColor: COLORS.profileBackground,
    borderBottomColor:COLORS.buttonContainerBorderColor,
    borderTopColor:COLORS.buttonContainerBorderColor,
    borderTopWidth:0.5,
    borderBottomWidth:0.5
  },
  buttonStyle:{
    width : verticalScale(100),
    marginVertical: verticalScale(20),
    borderRadius: verticalScale(10)
  },
  offlineText: {
    color: COLORS.red,
    padding: verticalScale(10),
    textAlign: 'center'
  },
  ProfileCardShadowElevation: {
    ...elevationShadowStyle(5),
    backgroundColor: 'white'
  },
  NavButtonShadow:{
    ...elevationShadowButtonStyle(5)

  },
  box:{
    borderWidth: 0.5,
    borderColor: 'white',
    margin:20,
    borderRadius:10,
    marginTop: 0
  },
  NavButtonStyle:{
    width: 33,
    height:33,
    borderRadius:33/2,
    backgroundColor:'white',
    alignItems:'center',
    justifyContent:'center'
  },
  AddButtonStyle:{
    width : horizontalScale(63),
    paddingVertical: verticalScale(5),
    borderRadius:verticalScale(23),
    backgroundColor:'#00b14e',
    paddingHorizontal:10
  },
  AddButtonTextStyle:{
    color: COLORS.white
  },
  bottonDocumentStyle:{
    paddingVertical: verticalScale(5),
    borderRadius:verticalScale(23),
    backgroundColor:'#00b14e',
    paddingHorizontal: horizontalScale(5)
  }
});
let aesUtil = new AesUtil();
let timeStamp = new Date();
class Account extends Component {
  static propTypes = {
    isNetworkConnected : PropTypes.bool,
    userSignOut:PropTypes.func,
    userData: PropTypes.object,
    changePassword: PropTypes.func,
    imageUploadToAWS: PropTypes.func,
    onUploadPhoto: PropTypes.func,
    updateEmail: PropTypes.func,
    getUserProfile: PropTypes.func,
    updateProfile: PropTypes.func,
    name: PropTypes.string,
    userAccountDeactivate: PropTypes.func,
    resendOTP: PropTypes.func,
    countryCode:PropTypes.string
  }

  static defaultProps = {
    userData: {},
    isNetworkConnected : false,
    changePassword: ()=>{},
    imageUploadToAWS: ()=>{},
    onUploadPhoto: ()=>{},
    updateEmail: ()=>{},
    getUserProfile: ()=>{},
    updateProfile: ()=>{},
    name: '',
    resendOTP: ()=>{}
  }


  constructor(props){
    super(props);
    this.state ={
      changePasswordModalVisible: false,
      currentPassword:'',
      password:'',
      reTypePassword:'',
      currentPasswordError:'',
      passwordError:'',
      reTypePasswordError:'',
      reTypePasswordStatus:'',
      isLoadingPassword: false,
      passwordChangeStatus: '',
      passwordChangeStatusColor: COLORS.red,
      qrModalVisible: false,
      isEditName: false,
      isEditEmail: false,
      isEditPhone: false,
      isLoadingName: false,
      isLoadingEmail: false,
      isLoadingPhone: false,
      isDeActiveLoading: false,
      nameError: '',
      phoneError: '',
      emailError: '',
      phoneNumberStatus:'',
      name:'',
      phone:'',
      email:'',
      photoPath:'',
      photoObject: {},
      isLoading: false,
      countryCode:'',
      crtdDttm: '',
      osid: '',
      updtDttm: '',
      profileCardUrl: '',
      initialState:'',
      addQualificationsModalVisible: false,
      addRoleModalVisible: false,
      sharePII: false,
      lat:'',
      long:'',
      city:'',state:'',country:'',district:'',editLocation:false,searchLocText:'',
      searchLocationModalVisible:false,
      locActive: false,
      piiLoading:false
    };

    this.onChangeTextPassword = this.onChangeTextPassword.bind(this);
    this.onChangeTextCurrentPassword = this.onChangeTextCurrentPassword.bind(this);
    this.onChangeTextRePassword = this.onChangeTextRePassword.bind(this);
    this.onChangePasswordPress = this.onChangePasswordPress.bind(this);
    this.onChangePasswordSavePress = this.onChangePasswordSavePress.bind(this);
    this.onChangePasswordCancelPress = this.onChangePasswordCancelPress.bind(this);

    this.isInvokeUserSignOut = this.isInvokeUserSignOut.bind(this);
    this.invokeUserSignOut = this.invokeUserSignOut.bind(this);
    this.invokeDeactivateAccount = this.invokeDeactivateAccount.bind(this);

    this.onEditNamePress = this.onEditNamePress.bind(this);
    this.onEditPhonePress = this.onEditPhonePress.bind(this);
    this.onEditEmailPress = this.onEditEmailPress.bind(this);

    this.onChangeTextName = this.onChangeTextName.bind(this);

    this.onOpenActionSheet = this.onOpenActionSheet.bind(this);
    this.onPressActionSheet = this.onPressActionSheet.bind(this);

    this.onSaveNamePress = this.onSaveNamePress.bind(this);

    this.navigateToAbout = this.navigateToAbout.bind(this);
    this.animation = new Animated.Value(0);
    this.navigateToTermsConditions = this.navigateToTermsConditions.bind(this);
    this.navigateToPrivacyView = this.navigateToPrivacyView.bind(this);
    this.onSharePIICLick =this.onSharePIICLick.bind(this);
    this.invokeSharePIIApi = this.invokeSharePIIApi.bind(this);
    this.onPressForLocation = this.onPressForLocation.bind(this);
    this.onPressSubmitLoc = this.onPressSubmitLoc.bind(this);
    this.updateLocation = this.updateLocation.bind(this);
  }

  componentDidMount(){
    const{userData} = this.props;
    const{country,state,district,city} =userData;
    this.setState({city,country,district,state});
    this.getAccountDetails(false);
  }

  componentWillReceiveProps(){
    const{userData} = this.props;
    const{country,state,district,city} =userData;
    this.setState({city,country,district,state});
  }

  onPressActionSheet(item){
    const {
      imageUploadToAWS,
      onUploadPhoto,
      userData
    } = this.props;
    if (item === 2) {
      timeStamp = new Date();
      this.setState({isImageUploadedSuccess:true, isLoading:true, photoPath: ''});
      this.invokeUpdateProfile('', true,  (status, response)=>{
        if (status === true) {
          showSuccessMessage(response);
        }else{
          showErrorMessage(response);
        }
        this.setState({isLoading: false});
      });
    }else{
      onUploadPhoto(item, (status, response)=>{
        myLog('---------', status, response);
        if (status) {
          timeStamp = new Date();
          this.setState({
            photoPath: response.path,
            photoObject: response
          });
          const fileExtension  = response.path.split('.')[1];
          const file = {
            type: response.mime,
            name: `${userData.userId}.${fileExtension}`,
            uri: response.path
          };

          this.setState({isLoading: true},()=>{
            imageUploadToAWS(file, (status, response)=>{
              myLog('imageUploadToAWS ', status, response);
              if (status) {
                this.setState({isImageUploadedSuccess:true, photoPath: response.location});
                this.invokeUpdateProfile(response.location, false, (status, response)=>{
                  if (status === true) {
                    showSuccessMessage(response);
                  }else{
                    showErrorMessage(response);
                  }
                  this.setState({isLoading: false});
                });
              }else{
                showErrorMessage(stringsConvertor('alertMessage.profileUpdateError'));
                this.setState({isLoading: false});
              }
            });
          });
        }else {
          showErrorMessage(response);
        }
      });
    }
  }

  onSaveNamePress(){
    const {
      name
    } = this.state;
    if(name === '' || !validateText(name)){
      this.setState({name:'',nameError:stringsConvertor('validationMessage.nameIsRequired')});
    }
    else if(validateSpecialChar(name)){
      this.setState({nameError:stringsConvertor('validationMessage.validNameIsRequired')});
    }
    else{
      this.setState({isLoading: true, isLoadingName: true},()=>{
        this.invokeUpdateProfile('', false, (status, response)=>{
          if (status === true) {
            showSuccessMessage(response);
          }else{
            showErrorMessage(response);
          }
          this.setState({isLoading: false, isLoadingName: false, isEditName: false});
        });
      });
    }
  }

  onPhoneNumberModifiedAlert(message){
    Alert.alert(
      stringsConvertor('alert.appName'),
      message,
      [
        {text: stringsConvertor('alert.ok'), onPress:()=>{
          Actions.replace('LoginScreen');
        }}
      ],
      {cancelable: false},
    );
  }

  invokeUpdateProfile(photoPath = '', isRemovePhoto = false,  onCallback =()=>{}){
    const {
      name,
      crtdDttm,
      osid,
      countryCode,
      profileCardUrl
    } = this.state;
    const {
      updateProfile,
      userData
    } = this.props;

    const fullName = _.has(userData, 'name') ? userData.name : '';
    const params = {
      osid: userData.osid === undefined ? osid : userData.osid,
      name: name === '' ? fullName : name,
      photo: photoPath === '' ? isRemovePhoto ? '' : userData.photo : photoPath,
      userId: userData.userId,
      crtdDttm: userData.crtdDttm === undefined ? crtdDttm : userData.crtdDttm,
      profileCardUrl,
      countryCode,
      updtDttm:userData.updtDttm,
      active:userData.active,
      userName: userData.userName
    };
    const nameChange = photoPath === '' && isRemovePhoto === false ? true :false;
    updateProfile(params,nameChange, onCallback);
  }
  getAccountDetails(isLoader){
    myLog('=====================get acout============');
    const {
      isNetworkConnected,
      getUserProfile
    } = this.props;
    if (!isNetworkConnected) {
      const{userData} = this.props;
      const{country,state,district,city} =userData;
      this.setState({city,country,district,state});
      return;
    }
    if (isLoader) {
      showLoadingMessage(stringsConvertor('alertMessage.loading'));
      this.setState({isRefreshing: true});
    }
    this.setState({isGetProfileLoading: true},()=>{
      getUserProfile((status,message )=>{
        myLog('===========to see data  in profile===tttttttttttttttttttt======',this.props);
        myLog('getAccount', status, message);
        if (status) {
          timeStamp = new Date();
          const {
            crtdDttm,
            osid,
            countryCode,
            profileCardUrl,
            country,state,district,city,latitude,longitude
          } =this.props.userData;
          this.setState({isGetProfileSuccess:true,countryCode,crtdDttm,osid,profileCardUrl,
            city,country,district,state,lat:latitude,long:longitude
          });
          hideMessage();
        }else{
          showErrorMessage(message);
          this.setState({isGetProfileSuccess:false});
        }
        this.setState({isGetProfileLoading: false, isRefreshing: false});
      });
    });
  }

  animationConstants = {
    DURATION: 800,
    TO_VALUE: 4,
    INPUT_RANGE: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4],
    OUTPUT_RANGE: [0, -15, 0, 15, 0, -15, 0, 15, 0]
  };

  triggerAnimation = () => {
    this.animation.setValue(0);
    Animated.timing(this.animation, {
      duration: this.animationConstants.DURATION,
      toValue: this.animationConstants.TO_VALUE,
      useNativeDriver: true,
      ease: Easing.bounce
    }).start();
  };

  onOpenActionSheet(){
    this.ActionSheet.show();
  }
  onChangeTextName(text) {
    myLog('name', text);
    this.setState({ name: text,nameError: ''});
  }
  onEditNamePress() {
    const {
      userData
    } = this.props;
    const fullName = _.has(userData, 'name') ? userData.name : '';
    this.setState({ name: fullName, isEditName: true, isEditPhone: false, isEditEmail: false, nameError: '' });
  }
  onEditPhonePress() {
    const {
      userData,
      isNetworkConnected,
      resendOTP
    } = this.props;
    const phoneNumber = _.has(userData, 'userName') ? userData.userName : '';
    const emailId = _.has(userData, 'emailId')  ? userData.emailId : '';
    let countryCode = _.has(userData, 'countryCode')  ? userData.countryCode : '';
    if(countryCode === ''){
      countryCode = this.state.countryCode;
    }
    if( emailId !== ''){
      if (isNetworkConnected) {
        this.setState({ isLoading: true }, () => {
          if (isNetworkConnected) {
            const typeOfOTP = 'UpdatePhone-OTP';
            resendOTP(countryCode, phoneNumber, typeOfOTP,(status, response) => {
              myLog('resendOTP', status, response);
              if (status === true) {
                navigateToScreen('OtpScreen', {phoneNumber,typeOfOTP, countryCode });
              } else {
                showErrorMessage(response);
              }
              this.setState({ isLoading: false });
            });
          }
        });
      }
    }
    else{
      navigateToScreen('PhoneNumberUpdateScreen',{phoneNumber, countryCode});
    }
  }
  onEditEmailPress() {
    const {
      userData,
      isNetworkConnected,
      resendOTP
    } = this.props;
    myLog('+++++++CountryCOde++++++++++++',this.props);
    const phoneNumber = _.has(userData, 'userName') ? userData.userName : '';
    let countryCode = _.has(userData, 'countryCode') ? userData.countryCode : '';
    if(countryCode === ''){
      countryCode = this.state.countryCode;
    }
    if (isNetworkConnected) {
      this.setState({ isLoading: true }, () => {
        if (isNetworkConnected) {
          const typeOfOTP = 'UpdateEmail-OTP';
          resendOTP(countryCode,phoneNumber,typeOfOTP,  (status, response) => {
            myLog('resendOTP', status, response);
            if (status === true) {
              navigateToScreen('OtpScreen', {countryCode,typeOfOTP, phoneNumber });
            } else {
              showErrorMessage(response);
            }
            this.setState({ isLoading: false });
          });
        }
      });
    }
  }
  navigateToAbout(){
    navigateToScreen('AboutScreen');
  }
  navigateToLanguage =()=>{
    Actions.push('LanguageDetection');
  }

  navigateToPrivacyView(){
    navigateToScreen('PrivacyViewScreen');
  }
  navigateToTermsConditions(){
    navigateToScreen('TermsConditionsViewScreen');
  }
  onChangePasswordSavePress(){

    const {
      password,
      reTypePassword,
      currentPassword
    } = this.state;
    const {
      isNetworkConnected,
      changePassword
    } = this.props;
    if (currentPassword.length === 0) {
      this.setState({currentPasswordError: stringsConvertor('validationMessage.passwordIsRequired')
      });
      this.currentPassword.focus();
      return;
    }
    if (password.length === 0) {
      this.setState({passwordError: stringsConvertor('validationMessage.passwordIsRequired')
      });
      this.password.focus();
      return;
    }
    if (reTypePassword.length === 0) {
      this.setState({reTypePasswordError: stringsConvertor('validationMessage.retypePasswordIsRequired')
      });
      this.reTypePassword.focus();
      return;
    }

    if (password !== reTypePassword) {
      this.setState({reTypePasswordError: stringsConvertor('validationMessage.passwordMatching')
      });
      this.reTypePassword.focus();
      return;
    }

    if (isNetworkConnected) {
      const data = {
        currentPassword : aesUtil.encrypt(currentPassword),
        newPassword: aesUtil.encrypt(password)
      };
      this.setState({isLoadingPassword: true, passwordChangeStatus:''}, ()=>{
        changePassword(data, (status, response)=>{
          if (status === true) {
            this.onPhoneNumberModifiedAlert(stringsConvertor('alertMessage.passwordChangedSuccess'));
          }else{
            this.showChangePasswordStatus(response, status);
          }
          this.setState({isLoadingPassword: false});
        });
      });
    }
  }
  showChangePasswordStatus(text, status){
    this.setState({
      passwordChangeStatus: text,
      passwordChangeStatusColor: status ? COLORS.password:COLORS.red
    },()=>{
      this.triggerAnimation();
    });
  }

  onChangePasswordPress(){
    this.setState({
      changePasswordModalVisible: true,
      password: '',
      reTypePassword: '',
      currentPasswordError: '',
      passwordError: '',
      reTypePasswordError: '',
      currentPassword: '',
      passwordChangeStatus: ''
    });
  }
  onChangePasswordCancelPress(){
    this.setState({changePasswordModalVisible: false, passwordChangeStatus:''});
  }
  onChangeTextCurrentPassword(text) {
    this.setState({ currentPassword: text, currentPasswordError: '', passwordError: '', reTypePasswordError: '', passwordChangeStatus: '' });
  }

  onChangeTextPassword(text) {
    const {
      reTypePassword
    } = this.state;
    this.setState({ password: text, passwordError: '', reTypePasswordError: '', passwordChangeStatus: '', reTypePasswordStatus: text === reTypePassword ? 'success' : '' });
  }

  onChangeTextRePassword(text) {
    const {
      password
    } = this.state;
    this.setState({ reTypePassword: text, passwordError: '', reTypePasswordError: '', reTypePasswordStatus: text === password ? 'success' : '', passwordChangeStatus: '' });
  }

  isInvokeUserSignOut(){
    Alert.alert(
      stringsConvertor('alert.logout'),
      stringsConvertor('alertMessage.logoutConfirmation'),
      [
        {
          text: stringsConvertor('alert.no'),
          onPress: () => (''),
          style: 'cancel'
        },
        {text: stringsConvertor('alert.yes'), onPress:this.invokeUserSignOut}
      ],
      {cancelable: true},
    );
  }



  reset = (initialState) => {
    this.setState(initialState);
    myLog('data is cleared ');
  }
  invokeUserSignOut(){
    const {
      userId
    } = this.props.userData;
    this.setState({isLoading:true},()=>{
      this.reset();
      this.props.userSignOut(userId ,(status, message) => {
        myLog('status, message', status, message);
        if (status) {
          showSuccessMessage(message);
          Actions.reset('LoginScreen');
        }else {
          showErrorMessage(message);
        }
        this.setState({isLoading:false});
      });
    });
  }


  invokeDeactivateAccount = () =>{
    // const {
    //   userAccountDeactivate
    // } = this.props;
    // const {
    //   userData
    // } = this.props;
    // const active = _.has(userData, 'active') ? userData.active : false;
    // this.setState({isDeActiveLoading : true},()=>{
    //   userAccountDeactivate(!active, (status, response)=>{
    //     if (status === true) {
    //       showSuccessMessage(response);
    //     }else {
    //       showErrorMessage(response);
    //     }
    //     this.setState({isDeActiveLoading: false});
    //   });
    // });
  }

  onShare = (url) => {
    const {isNetworkConnected} = this.props;
    if (!isNetworkConnected) {
      showNoInternetErrorMessage();
      return;
    }
    if (url === '' || url === null) {
      showErrorMessage(stringsConvertor('alertMessage.noProfileCard'));
      return;
    }
    const fileName = `${url.split('/').pop().split('#')[0].split('?')[0]}.pdf`;
    // const fileName = `PDA Profile-${userData.name}.pdf`;
    const folder = FOLDER.PROFILE ;
    this.setState({isDownloading: true, status:stringsConvertor('alertMessage.downloading')},()=>{
      downloadFileFromUrl(fileName,url, folder, false,async (status, path ='')=>{
        myLog('==========status===========', status, path);
        if (status === true) {
          this.setState({isDownloading: true});
          const shareOptions = {
            message :'',
            url : path,
            failOnCancel: false
          };
          await Share.open(shareOptions).catch(()=>{});
        }else{
          this.setState({isDownloading: false});
          //showErrorMessage(stringsConvertor('alertMessage.downloadError'));
        }
      });
    });
  };
  onDownloadPress(url){
    myLog('=================on download press url=============',url);
    const {userData, isNetworkConnected} = this.props;
    // const fileName = `${url.split('/').pop().split('#')[0].split('?')[0]}.pdf`;
    const fileName = `PDA Profile-${userData.name}.pdf`;
    const folder = FOLDER.PROFILE ;
    if (!isNetworkConnected) {
      showNoInternetErrorMessage();
      return;
    }
    if (url === '' || url === null) {
      showErrorMessage(stringsConvertor('alertMessage.noProfileCard'));
      return;
    }
    showLoadingMessage(stringsConvertor('alertMessage.downloading'));
    this.setState({isDownloading: true, status:stringsConvertor('alertMessage.downloading')},()=>{
      downloadFileFromUrl(fileName,url, folder, true,(status)=>{
        if (status === true) {
          this.setState({isDownloading: true});
          if (Platform.OS === 'ios') {
            showSuccessMessage(stringsConvertor('alertMessage.downloadSuccessIos'));
          } else {
            showSuccessMessage(stringsConvertor('alertMessage.downloadSuccess'));
          }
        }
      });
    });
  }

  invokeSharePIIApi(data, onCallback){
    const{
      userPIIShare
    }= this.props;
    myLog('sharePII', userPIIShare);
    userPIIShare(data, onCallback);
  }
  onSharePIICLick(sharePII,osid){
    const data = {
      enable:sharePII,
      osId:osid
    };
    myLog('sharePII1',data);
    this.setState((preState)=>{
      return {
        sharePII : !preState.sharePII
      };
    });
    myLog('hello share Pii enable', sharePII);
    this.setState({isLoading:true,piiLoading:true},()=>{
      this.invokeSharePIIApi(data, (status, response)=>{
        myLog('check +++++++++', data);
        if (status === true) {
          this.getAccountDetails();
        }
        else {
          showErrorMessage(response);
        }
        setTimeout(()=>{
          this.setState({isLoading:false,piiLoading:false});
        },1500);
      });
    });
  }
  isInvokeSharePII(){
    myLog('userData',this.props);
    const{
      userData
    }= this.props;
    const sharePII = _.has(userData, 'piiInfo')? userData.piiInfo:'false';
    const osid = _.has(userData, 'osid')? userData.osid:'';
    if (sharePII) {
      Alert.alert(
        stringsConvertor('alert.sharePII'),
        stringsConvertor('alertMessage.sharePIIConfirmation'),
        [
          {
            text: stringsConvertor('alert.no'),
            onPress: () => (''),
            style: 'cancel'
          },
          {text: stringsConvertor('alert.yes'), onPress:()=>{this.onSharePIICLick(!sharePII,osid);}}
        ],
        {cancelable: true},
      );
    } else {
      this.onSharePIICLick(!sharePII,osid);
    }
  }
  onBaseLocationClick(baseLocation){
    myLog('base location', baseLocation);
    if(baseLocation ===  true){
      Alert.alert(
        stringsConvertor('alert.baseLocation'),
        stringsConvertor('alertMessage.withdrawLocationConfirmation'),
        [
          {
            text: stringsConvertor('alert.no'),
            onPress: () =>{this.setState({isLoading:false});},
            style: 'cancel'
          },
          {text: stringsConvertor('alert.yes'), onPress:()=>{
            this.setState({isLoading:true},()=>{
              this.props.deleteBaseLocation((status, response)=>{
                if (status === true) {
                  this.getAccountDetails();
                }
                else {
                  showErrorMessage(response);
                }
                setTimeout(()=>{ this.setState({isLoading:false});},1000);
              });
            });
          }}
        ],
        {cancelable: true},
      );
    } else{
      this.setState({isLoading:true},()=>{
        this.onPressForLocation();
      });
    }
  }
  getLocationBasedOnLatLong(lat,long){
    myLog('==============on get location api',this.props);
    this.props.getBaseLocationLatLongApi(lat,long,(status,response)=>{
      if(status){
        const {location} = response.geometry;
        this.setState({lat:location.lat,long:location.lng,searchLocationModalVisible:true,isLoading:false});
        // showSuccessMessage('location fetched successfully');
        myLog('==============on get location api==========',this.props);
        response.address_components.map((item)=>{
          if(item.types[0] === 'locality'){
            this.setState({city:item.long_name});
          }
          if(item.types[0] === 'administrative_area_level_2'){
            this.setState({district:item.long_name});
          }
          if(item.types[0] === 'administrative_area_level_1'){
            this.setState({state:item.long_name});
          }
          if(item.types[0] === 'country'){
            this.setState({country:item.long_name});
          }
        });
      }
    }).catch((err)=>{});
  }
  onPressForLocation(){
    const title = stringsConvertor('alert.appName');
    const message = stringsConvertor('alertMessage.locationPermission');
    const permission = 'location';
    permissionHelper.permissionChecker(permission, title, message,(status)=>{
      if(status === true){
        Geolocation.getCurrentPosition((position)=>{
          {this.getLocationBasedOnLatLong(position.coords.latitude,position.coords.longitude);}
          this.setState({
            lat:position.coords.latitude,
            long:position.coords.longitude
          });
          myLog('==============error on press loc success=========');
        },
        (error)=>{
          this.setState({isLoading:false,searchLocationModalVisible:true});
          myLog('==============error on press loc=========',this.state.lat,this.state);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, showLocationDialog:false }
        ).catch((err)=>{
          this.setState({isLoading:false});
          myLog('==============error on press loc catch=========',err);
        });
      }
      else{
        this.setState({isLoading:false,searchLocationModalVisible:true});
        myLog('==============error on press loc====in else part on press loc =====',);
      }
    });
  }
  updateLocation(data,onCallback){
    myLog('==========on update callnfrom ------======',data,this.props);
    this.setState({searchLocationModalVisible:false,isLoading:true});
    this.props.updateBaseLocation(data,(status,response)=>{
      myLog('==========to see udate response =====',status,response);
      if(status){
        this.getAccountDetails();
        this.setState(()=>({
          isLoading:false
        }),()=>onCallback());
      }
    }).catch((err)=>{});
  }
  onPressSubmitLoc(){
    const{country,state,city,district,lat,long} =this.state;
    const data ={
      country,
      state,
      city,
      district,
      latitude:lat,
      longitude:long
    };
    if(country === '' || state === '' || city === '' || lat ==='' || long === ''){
      showErrorMessage('All data is not available');
    } else{
      this.updateLocation(data,()=>{
        //showSuccessMessage('Location updated successfully');
      });
    }
  }

  onPressCancelLoc(){
    const{userData} = this.props;
    const{country,state,district,city} =userData;
    myLog('userData1', userData);
    this.setState({city,country,district,state});
  }
  renderProfile(image) {
    if (image) {
      const profileImage = Platform.OS === 'ios' ? {
        uri: image.toString().search('http') !== -1 ? `${image}?random_number=${timeStamp.getTime()}` : image
      }
        : { uri: `${image}?${timeStamp}` };
      return (
        <Image
          key={new Date()}
          testID = "profileImage"
          source={profileImage}
          style={{ height: verticalScale(145), width: verticalScale(145), borderRadius: verticalScale(72.5) }}
        />
      );
    }
    return (
      <Image
        source={require('../../../assets/Images/profile.png')}
        style={{ height: verticalScale(145), width: verticalScale(145), borderRadius: verticalScale(72.5) }}
      />
    );
  }

  renderProfileCardView(){
    const {
      photoPath
    } = this.state;
    const {
      userData
    } = this.props;
    myLog('+++++++UserData++++++++++++++++++++++++',userData);
    const name = _.has(userData, 'name')  ? userData.name :'';
    let profilePhoto  = _.has(userData, 'photo')  ? userData.photo :'';
    const qrCodeValue = userData.userId;
    const profileCardUrl = _.has(userData, 'profileCardUrl')  ? userData.profileCardUrl :'';
    profilePhoto = photoPath === '' ? profilePhoto : photoPath;
    return(
      <View>
        <LinearGradient colors={[COLORS.password, COLORS.gradient]} start={{ x: 0, y: 2 }} end={{ x: 1, y: 0 }}
          locations={[0,1]}
          style={{height: (deviceHeight/100)*38}}
        />
        <View style={{height: (deviceHeight/100)*12}}/>
        <View style={{position:'absolute',  right:0, left:0, margin: 20, height: (deviceHeight/100)*35, top:30}}>
          <View style={{flex:1, paddingTop:verticalScale(70)}}>
            <View style={[styles.profileCard,{height: (deviceHeight/100)*30}]}>
              <View style={{flex:1}}>
                <View style={{flex:2.5,padding:20,justifyContent:'flex-end', alignItems:'center'}}>
                  <Text numberOfLines={2} style={[TEXT_TYPE.H4,{color:COLORS.shadowColor}]}>{name}</Text>
                </View>
                <View style={{height:0.5, backgroundColor:COLORS.gray}}/>
                <View style={{flex:1,flexDirection:'row'}}>
                  <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                    <ButtonWithIcon
                      iconSize={Platform.OS === 'ios'? verticalScale(13) : verticalScale(20)}
                      iconName="share-icon"
                      name={stringsConvertor('account.share')}
                      textStyle={{color:COLORS.shareTextColor}}
                      iconColor={COLORS.shareTextColor}
                      onPress={()=>this.onShare(profileCardUrl)}
                    />
                  </View>
                  <View style={{width:0.5, backgroundColor:COLORS.gray}}/>
                  <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                    <ButtonWithIcon
                      iconSize={Platform.OS === 'ios'? verticalScale(13) : verticalScale(20)}
                      iconName="download-small-icon"
                      isLight={true}
                      name={stringsConvertor('account.download')}
                      textStyle={{color:COLORS.shareTextColor}}
                      iconColor={COLORS.shareTextColor}
                      onPress={()=>this.onDownloadPress(profileCardUrl)}
                    />
                  </View>
                  <View style={{width:0.5, backgroundColor:COLORS.gray}}/>
                  <View style={{flex:1, alignItems:'center', justifyContent:'center', overflow:'hidden'}}>
                    <Ripple
                      rippleContainerBorderRadius={verticalScale(40)}
                      style={{padding:10}}
                      onPress={()=>{
                        this.setState({qrModalVisible: true});
                      }}
                    >
                      <QRCode
                        value={qrCodeValue}
                        size={verticalScale(30)}
                      />
                    </Ripple>
                  </View>
                </View>
              </View>
            </View>
            <View style={{position:'absolute', top:-5, left:0, alignItems:'center', justifyContent:'center', right:0}}>
              <View style={[styles.ProfileImageContainer,{overflow:'visible'}]}>
                {this.renderProfile(profilePhoto)}
                <View style={{position:'absolute',bottom:'-10%'}}>
                  <Ripple rippleContainerBorderRadius={40} style={{ padding:5}} onPress={this.onOpenActionSheet}>
                    <Image
                      source={require('../../../assets/Images/camera.png')}
                      style={{height:30, width: 30, borderRadius:15, zIndex:-5}}
                    />
                  </Ripple>
                </View>
              </View>
            </View>
          </View>

        </View>
      </View>
    );
  }
  renderProfileItem({ title, value, isEdit, disabled, onEdit, onSave, onChangeText, onSubmitEditing, rightViewType, error, ref, maxLength}){
    return(
      <View style={{flexDirection:'row', padding: 10,borderBottomWidth: 0.8, borderBottomColor:'#eaeaea'}}>
        <View style={{flex:1, paddingHorizontal: verticalScale(10)}}>
          {isEdit && title === 'Name' ?
            <TextInput
              ref={ref}
              style={{marginVertical:0, paddingVertical:0}}
              label={title}
              baseColor={COLORS.gray}
              tintColor={COLORS.tintColor}
              textColor ={COLORS.textColor}
              value={value}
              onChangeText={onChangeText}
              error={error}
              onSubmitEditing={onSubmitEditing}
              rightViewType={rightViewType}
              maxLength={maxLength}
              keyboardType={title === 'Mobile number' ? 'numeric' : 'default'}
            /> :
            <View>
              <Text numberOfLines={1} style={[TEXT_TYPE.H2, {paddingBottom:5, color:COLORS.titleColor}]}>{title}</Text>
              <Text numberOfLines={1} style={[TEXT_TYPE.H2, {color:COLORS.black}]}>{value}</Text>
            </View>
          }
        </View>
        <View style={{}}>
          <ButtonWithIcon
            containerStyle={{marginVertical:0, paddingVertical:0}}
            iconColor={COLORS.saveIconColor}
            disabled={disabled}
            name={isEdit ? stringsConvertor('account.save') : stringsConvertor('account.edit')}
            textStyle={{ color: COLORS.saveButtonColor , fontSize: 11, fontWeight:'500'}}
            onPress={isEdit ? onSave : onEdit}
          />
        </View>
      </View>
    );
  }
  renderPIIView(){
    const{
      userData
    }= this.props;
    const sharePII = _.has(userData, 'piiInfo')? userData.piiInfo:'false';
    const osid = _.has(userData, 'osid')? userData.osid:'';
    myLog('::::::::::::::::::::::::::::pii check+++++:::::::::::::::', sharePII);
    return(
      <View style={{
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
      }}
      >
        <View style={{flex:.20}}>
          <ToggleSwitchButton
            switchOn={sharePII}
            onPress={()=>this.isInvokeSharePII(userData)}
            circleColorOff= {'#717171'}
            circleColorOn={'#46b051'}
            duration={500}
          />
        </View>
        <View style={{flex:.995,marginLeft:verticalScale(10),marginTop:verticalScale(9), marginRight: Platform.OS === 'ios'? 5: 0}}>
          <Text style={{fontSize:verticalScale(9), lineHeight:verticalScale(14),fontFamily:'Roboto-Light'}}>
            {sharePII ?stringsConvertor('account.PIIWithdraw'):stringsConvertor('account.PIIConsent')}</Text>
        </View>
      </View>

    );
  }

  renderProfileDetails(userData) {
    const {
      isEditName,
      isEditEmail,
      isEditPhone,
      isLoadingName,
      isLoadingEmail,
      isLoadingPhone,
      nameError,
      name
    } = this.state;
    const fullName = _.has(userData, 'name') ? userData.name : '';
    const emailId = _.has(userData, 'emailId') ? userData.emailId : '';
    const phoneNumber = _.has(userData, 'userName') ? userData.userName : '';

    const nameView = {
      icon: require('../../../assets/Images/name.png'),
      title: stringsConvertor('account.name'),
      value: isEditName ? name : fullName,
      isEdit: isEditName,
      disabled: isLoadingName,
      onEdit: this.onEditNamePress,
      onSave: this.onSaveNamePress,
      error: nameError,
      ref: (input) => this.name = input,
      onSubmitEditing: this.onSaveNamePress,
      rightViewType: '',
      onChangeText: this.onChangeTextName,
      maxLength: 105
    };
    const phoneNumberView = {
      icon: require('../../../assets/Images/phone.png'),
      title: stringsConvertor('account.mobileNumber'),
      value: phoneNumber,
      isEdit: isEditPhone,
      disabled: isLoadingPhone,
      onEdit: this.onEditPhonePress
    };
    const emailView = {
      icon: require('../../../assets/Images/email.png'),
      title: stringsConvertor('account.email'),
      value: emailId,
      isEdit: isEditEmail,
      disabled: isLoadingEmail,
      onEdit: this.onEditEmailPress
    };
    return(
      <View style={[styles.ProfileCardShadowElevation, styles.box]}>
        <View style={{paddingHorizontal: 20, paddingTop: 10}}>
          <Text style={{fontWeight: '700',color:COLORS.modalText, fontSize:13,letterSpacing: -0.7}}>{stringsConvertor('account.profileDetails')}</Text>
        </View>
        <View >
          {this.renderProfileItem(nameView)}
          {this.renderProfileItem(phoneNumberView)}
          {this.renderProfileItem(emailView)}
          {/* <View style={{paddingLeft:verticalScale(20),paddingBottom:verticalScale(20), paddingTop:5}}>
            {this.renderPIIView()}
          </View> */}
        </View>
      </View>
    );
  }
  renderLocationConsent(){
    const {
      userData
    } = this.props;
    const {
      isDeActiveLoading,
      locActive
    } = this.state;

    const baseLocation = _.has(userData, 'baseLocation') ? userData.baseLocation : false;
    return (
      <View style={{
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
      }}
      >
        <View style={{flex:.20,paddingRight:verticalScale(5)}}>
          <ToggleSwitchButton
            switchOn={baseLocation}
            onPress={()=>{this.onBaseLocationClick(baseLocation);}}
            circleColorOff= {'#717171'}
            circleColorOn={'#46b051'}
            duration={500}
          />
        </View>
        <View style={{flex:.995,marginTop:verticalScale(9),marginLeft:verticalScale(9)}}>
          <Text style={{fontSize:verticalScale(9),lineHeight:verticalScale(14),fontFamily:'Roboto-Light'}}>{baseLocation ? stringsConvertor('location.withdrawConsent'):stringsConvertor('location.grantConsent')}</Text>
        </View>
      </View>
    );
  }
  renderLocationView(){
    const{city,state,country,district} = this.props.userData;
    const {isNetworkConnected} = this.props;
    return(
      <View style={[styles.box,styles.ProfileCardShadowElevation,{paddingVertical:10}]}>
        <View>
          <View style={{flexDirection:'row',alignContent:'center'}}>
            <View style={{}}>
              <ButtonWithIcon
                iconName={'aim'}
                iconColor= {'#bb5048'}
                iconSize = {24}
                onPress={''}
                disabledRipple={true}
              />
            </View>
            <Text style={{fontSize:verticalScale(12),fontFamily:'Roboto-Bold', fontWeight:'600', color: COLORS.gray,marginTop:verticalScale(8)}}>BASE LOCATION</Text>
          </View>
          <View style={{marginVertical:5,display:'flex',flexDirection:'row',justifyContent:'center',alignContent:'center',paddingLeft:verticalScale(12),marginLeft:verticalScale(12)}}>
            <Ripple style={{flex:.90}} onPress= {()=>{city === '' && district === '' && state === '' && country === '' ?
              this.onPressForLocation():this.setState({searchLocationModalVisible:isNetworkConnected?true:false});}} disabled={!isNetworkConnected}
            >
              {city === '' && district === '' && state === '' && country === '' ?
                <Text style={{fontSize:verticalScale(14),fontFamily:'Roboto-Regular',color:'#bcbbbb'}}>Add Location</Text>:
                <Text style={{fontSize:verticalScale(14),fontFamily:'Roboto-Regular', color:'black'}}>
                  {city === '' ? null:<Text >{city}, </Text>}
                  {district === '' || city === district?null:<Text >{district}, </Text>}
                  {state === '' ? null :<Text >{state}, </Text>}
                  {<Text >{country}</Text>}
                </Text>}
            </Ripple>
          </View>
          <View style={{borderBottomWidth:0.8,borderBottomColor:'#8f5566',marginHorizontal:verticalScale(15)}} />
        </View>
        <View style={{paddingLeft:verticalScale(20),paddingBottom:verticalScale(10), paddingTop:5}}>
          {this.renderLocationConsent()}
        </View>
      </View>
    );
  }
  renderButtonView({icon, title, onPress}){
    return (
      <Ripple
        onPress={onPress}
        style={styles.buttonContainer}
      >
        <View style={{flexDirection:'row', justifyContent:'center'}}>
          <View style={{ width: 20,alignItems:'center', justifyContent:'center'}}>
            <CustomIcon
              name= {icon}
              color ={COLORS.profileIcon}
              size={15}
            />
          </View>
          <View style={{flex:1, paddingHorizontal: verticalScale(10)}}>
            <Text numberOfLines={1} style={[TEXT_TYPE.H2,{color:COLORS.shareTextColor}]}>{title}</Text>
          </View>
        </View>
      </Ripple>
    );
  }
  renderDeActiveView(){
    const {
      userData
    } = this.props;
    const {
      isDeActiveLoading
    } = this.state;

    const active = _.has(userData, 'active') ? userData.active : false;
    return (
      <View style={{
        padding:verticalScale(15),
        paddingLeft:verticalScale(18),
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:COLORS.buttonContainerBackgroundColor,
        borderBottomColor:COLORS.buttonContainerBorderColor,
        borderTopColor:COLORS.buttonContainerBorderColor,
        borderTopWidth:0.5,
        borderBottomWidth:0.5
      }}
      >
        <View style={{ width: 20}}>
          <CustomIcon
            name= {'deactivate-icon'}
            size={15}
            color={COLORS.red}
          />
        </View>
        <View style={{flex:1, paddingHorizontal: verticalScale(10)}}>
          <Text numberOfLines={1} style={[TEXT_TYPE.H2,{color:COLORS.deactivate}]}>{stringsConvertor('account.deactivateAccount')}</Text>
        </View>
        <View style={{paddingRight:verticalScale(9)}}>
          {isDeActiveLoading ?
            <Spinner
              color={COLORS.primaryColor}
              type="Wave"
              size={25}
            /> :
            <Switch
              value={active}
              backgroundActive = {COLORS.password}
              backgroundInactive = {COLORS.deactivate}
              onSyncPress={this.invokeDeactivateAccount}
            />}
        </View>
      </View>
    );
  }
  renderBottomView(){
    const changePasswordView = {
      icon : 'password',
      title: stringsConvertor('account.changePassword'),
      onPress : this.onChangePasswordPress
    };
    const logoutView = {
      icon : 'log-out',
      title: stringsConvertor('account.logout'),
      onPress : this.isInvokeUserSignOut
    };
    const aboutView = {
      icon : 'about',
      title: stringsConvertor('account.about'),
      onPress : this.navigateToAbout
    };
    const userGuideView = {
      icon : 'user-guide',
      title: stringsConvertor('account.userGuide'),
      onPress : ''
    };
    const fAQView = {
      icon : 'faq',
      title: stringsConvertor('account.fAQ'),
      onPress :''
    };
    const privacyPolicyView = {
      icon : 'privacy-policy',
      title: stringsConvertor('account.privacyPolicy'),
      onPress : this.navigateToPrivacyView
    };
    const termsConditionView = {
      icon :'terms-conditions',
      title: stringsConvertor('account.termCondition'),
      onPress : this.navigateToTermsConditions
    };

    return(
      <View>
        <View style={{height:20}}/>
        {this.renderButtonView(changePasswordView)}
        {this.renderButtonView(logoutView)}
        <View style={{height:30}}/>
        {this.renderButtonView(aboutView)}
        <View style={{height:30}}/>
        {/* {this.renderButtonView(userGuideView)}*/}
        {/* {this.renderButtonView(fAQView)} */}
        {this.renderButtonView(privacyPolicyView)}
        {this.renderButtonView(termsConditionView)}
        {/* <View style={{height:30}}/>
        {this.renderDeActiveView()} */}
      </View>
    );
  }
  renderTextInputView({label, value, error, ref, rightViewType,  onSubmitEditing, onChangeText}){
    return(
      <TextInput
        ref={ref}
        label={label}
        baseColor={COLORS.gray}
        tintColor={COLORS.tintColor}
        textColor ={COLORS.textColor}
        value={value}
        secureTextEntry = {true}
        onChangeText={onChangeText}
        error={error}
        onSubmitEditing={onSubmitEditing}
        rightViewType={rightViewType}
      />
    );
  }
  renderBodyView() {
    const {
      currentPassword,
      password,
      reTypePassword,
      currentPasswordError,
      passwordError,
      reTypePasswordError,
      reTypePasswordStatus
    } = this.state;
    const currentPasswordView = {
      label: stringsConvertor('account.enterCurrentPassword'),
      value: currentPassword,
      error: currentPasswordError,
      ref: (input) => this.currentPassword = input,
      onSubmitEditing: () => this.password.focus(),
      rightViewType: 'password',
      onChangeText: this.onChangeTextCurrentPassword
    };
    const passwordView = {
      label: stringsConvertor('account.enterDesiredPassword'),
      value: password,
      error: passwordError,
      ref: (input) => this.password = input,
      onSubmitEditing: () => this.reTypePassword.focus(),
      rightViewType: 'password',
      onChangeText: this.onChangeTextPassword
    };
    const rePasswordView = {
      label: stringsConvertor('account.reenterPassword'),
      value: reTypePassword,
      error: reTypePasswordError,
      ref: (input) => this.reTypePassword = input,
      onSubmitEditing:this.onChangePasswordSavePress,
      rightViewType: reTypePasswordStatus,
      onChangeText: this.onChangeTextRePassword
    };
    return(
      <View>
        <KeyboardAwareScrollView>
          {this.renderTextInputView(currentPasswordView)}
          {this.renderTextInputView(passwordView)}
          {this.renderTextInputView(rePasswordView)}
        </KeyboardAwareScrollView>
      </View>
    );
  }
  renderChangePasswordModal(){
    const {
      changePasswordModalVisible,
      isLoadingPassword,
      passwordChangeStatus,
      passwordChangeStatusColor
    } = this.state;

    const interpolated = this.animation.interpolate({
      inputRange: this.animationConstants.INPUT_RANGE,
      outputRange: this.animationConstants.OUTPUT_RANGE
    });
    const animationStyle = {
      transform: [{ translateX: interpolated }]
    };
    return(
      <Modal
        animationType="slide"
        transparent={true}
        visible={changePasswordModalVisible}
      >
        <View style={{height: deviceHeight, backgroundColor:COLORS.modalBackground}}>
          <View style={{backgroundColor:COLORS.white, padding: 15,paddingTop: Platform.OS === 'ios'? 35 : 15}}>
            <View>
              <View style={{position:'absolute', right: 5, top: 5, zIndex:10}}>
                <ButtonWithIcon
                  iconSize={verticalScale(20)}
                  iconName="close"
                  isLight={true}
                  iconColor={COLORS.timesIconColor}
                  onPress={this.onChangePasswordCancelPress}
                />
              </View>
              <View style={{}}>
                <View style={{padding:15}}>
                  <View>
                    <Text style={[TEXT_TYPE.H5,{fontFamily: FONT_FAMILY.SEMI_BOLD, color:COLORS.black}]}>Change password</Text>
                  </View>

                  <Animated.Text style={[styles.offlineText, animationStyle, { color: passwordChangeStatusColor }]}>
                    {passwordChangeStatus}
                  </Animated.Text>
                  {this.renderBodyView()}
                </View>
              </View>
              <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                <View style={{paddingHorizontal: verticalScale(10)}}>
                  <Button
                    name={stringsConvertor('account.cancelCaps')}
                    isGradient={false}
                    textStyle={[styles.buttonText, TEXT_TYPE.H3, { color:COLORS.cancelText }]}
                    containerStyle={{width: (deviceWidth /100)*35}}
                    onPress={this.onChangePasswordCancelPress}
                  />
                </View>
                <View style={{paddingHorizontal: verticalScale(10)}}>
                  <Button
                    name={stringsConvertor('account.saveCaps')}
                    textStyle={[styles.buttonText, TEXT_TYPE.H3]}
                    onPress={this.onChangePasswordSavePress}
                    containerStyle={{width: (deviceWidth /100)*35}}
                    isLoading={isLoadingPassword}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
  renderQualificationAndRoleView(){
    return(
      <View>
        <AddQualificationsAndRole props = {this.props}/>
      </View>

    );
  }
  renderSearchLocationModel(){
    const {
      searchLocationModalVisible,
      city,state,district,country,lat,long
    } = this.state;
    const{getSearchedLocation,getLocationByPlaceId} =this.props;
    const data ={
      city,state,district,country,
      latitude:lat,
      longitude:long
    };
    return(
      <SearchLocationModel
        visible={searchLocationModalVisible}
        searchApi = {getSearchedLocation}
        searchByPlaceIdApi = {getLocationByPlaceId}
        onCancelPress={() => {
          const{city,state,country,district} = this.props.userData;
          this.setState({ searchLocationModalVisible: false,city,district,state,country});
        }}
        onSavePress={this.updateLocation}
        data = {data}
      />
    );
  }

  renderQrView(){
    const {
      qrModalVisible
    } = this.state;
    const {
      userData
    } = this.props;
    const qrCodeValue = _.has(userData, 'userId')  ? userData.userId :'';
    return(
      <View>
        <QrCodeModal
          value={aesUtil.encrypt(qrCodeValue)}
          visible={qrModalVisible}
          onClosePress={()=>{
            this.setState({qrModalVisible: false});
          }}
        />
      </View>
    );
  }
  render(){
    const {
      userData,
      name
    } = this.props;
    const {
      isLoading,
      piiLoading
    } = this.state;
    return (
      <RootView style={{flex:1}}  pointerEvents={isLoading ? 'none': null}>
        <Toolbar title={stringsConvertor('screenTitle.account')} gradientColor={[COLORS.password, COLORS.gradient]}
          rightRender={
            <NotificationBell color={COLORS.white} />
          }
        />
        {
          isLoading ?
            <View style={{backgroundColor:piiLoading ? COLORS.flashLoadingBackground:''}}>
              <Text style={{textAlign:'center',color:piiLoading?COLORS.white:''}}>{piiLoading ?'Updating...' :stringsConvertor('alertMessage.loading')}</Text>
            </View>
            :null
        }
        <ScrollView contentContainerStyle={{paddingBottom: verticalScale(150)}} showsVerticalScrollIndicator={false}>
          <View style={{backgroundColor:COLORS.profileDetailsBackground}}>
            {this.renderProfileCardView()}
            {this.renderProfileDetails(userData)}
            {/* {this.renderLocationView()} */}
            {/* {this.renderQualificationAndRoleView()} */}
          </View>
          {this.renderBottomView()}

        </ScrollView>
        {this.renderChangePasswordModal()}
        {this.renderQrView()}
        <BottomMenu screen={name}/>
        <ActionSheet
          ref={(o) => this.ActionSheet = o}
          title={stringsConvertor('account.choose')}
          options={[stringsConvertor('account.takeAPhoto'), stringsConvertor('account.gallery'),stringsConvertor('account.removePhoto'), stringsConvertor('account.cancel')]}
          cancelButtonIndex={3}
          destructiveButtonIndex={3}
          onPress={this.onPressActionSheet}
        />
        {this.renderSearchLocationModel()}
      </RootView>
    );
  }

}
export default Account;