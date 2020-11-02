/**
 * pda
 * QrCodeScanner.js
 * @author PDA
 * @description Created on 04/04/2019
 * Copyright © 2019 pda. All rights reserved.
 */
import React , { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  Image,
  Platform
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {QRscanner, QRreader} from 'react-native-qr-scanner';
import RNFetchBlob from 'rn-fetch-blob';
import { Actions } from 'react-native-router-flux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import moment  from 'moment';
import AesUtil from '../../../utils/AesUtil';
import { verticalScale, TEXT_TYPE } from '../../../theme/pdaStyleSheet';
import { COLORS } from '../../../constants/Color';
import { stringsConvertor } from '../../../utils/I18n';
import { myLog, convertDateToUTC, IsValidJSONString, convertDateToLocal, navigateToScreen } from '../../../utils/StaticFunctions';
import { FOLDER, DATE_FORMAT } from '../../../constants/String';
import ButtonWithIcon from '../../common/ButtonWithIcon';
import ScanStatus from './ScanStatus';
import Toolbar from '../../common/Toolbar';
import BottomMenu from '../../common/BottomMenu';
import NotificationBell from '../../../container/common/NotificationBell';
import Spinner from 'react-native-spinkit';
import Geolocation from 'react-native-geolocation-service';
import PermissionHelper from '../../../utils/PermissionHelper';
import Ripple from '../../common/rippleEffect';
const permissionHelper = new PermissionHelper();


let aesUtil = new AesUtil();
let isExitingUser = false;
const styles = StyleSheet.create({
  container:{
    flex: 1
  },
  loadingView:{
    padding: verticalScale(10),
    justifyContent:'center',
    alignItems:'center'
  },
  statusText:{
    color: COLORS.white
  },
  topContainer:{
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex:5
  },
  bottomContainer:{
    flex:1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomIconContainer:{
    backgroundColor: COLORS.white,
    height: verticalScale(35),
    width: verticalScale(35),
    borderRadius: verticalScale(35/2),
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    marginHorizontal: verticalScale(6),
    marginVertical: verticalScale(10)
  },
  instructionText:{
    color: COLORS.white
  }
});
class QrCodeScanner extends Component {
  static propTypes ={
    userData: PropTypes.object,
    getUserDetails: PropTypes.func,
    onSuccess: PropTypes.func,
    title: PropTypes.string,
    ScanInOut: PropTypes.func,
    topicId: PropTypes.number,
    members: PropTypes.array,
    addTopic: PropTypes.func,
    type: PropTypes.string,
    name: PropTypes.string,
    isNetworkConnected: PropTypes.bool
  }


  static defaultProps = {
    topicId: 0,
    members: [],
    isNetworkConnected: false
  }
  constructor(){
    super();
    this.state ={
      flashMode : false,
      isQrError: false,
      repeat: false,
      isScanning: false,
      statusText: stringsConvertor('qrScanner.scanningQr'),
      isLoading: false,
      isSessionScanSuccess: false,
      isShowBottomButton: false,
      type:'startQR',
      sessionName:'',
      isErrorMessage:'',
      zoom: 0.2
    };
    this.onPressFlash = this.onPressFlash.bind(this);
    this.onClickGallery = this.onClickGallery.bind(this);
    this.onClose = this.onClose.bind(this);
  }


  componentDidMount(){
    setTimeout(() => {
      this.setState({isShowBottomButton: true});
    }, 1000);
  }
  onClose(){
    Actions.pop();
  }
  onPressFlash(){
    this.setState((preState)=>{
      return {
        flashMode : !preState.flashMode
      };
    });
  }


  showError() {
    this.setState({
      isQrError: true
    }, () => {
      setTimeout(() => {
        this.setState({
          isQrError: false,
          isScanning: false,
          isErrorMessage:'',
          statusText:stringsConvertor('qrScanner.scanningQr')
        });
      }, 5000);
    });
  }


  onClickGallery(){
    ImagePicker.openPicker({
      includeBase64: true
    }).then((image) => {
      myLog('IMAGE PICKER::::', image);
      this.downloadTempFile(image);
    }).catch((error)=>{
      myLog('Error::::', error);
      this.showError();
    });
  }


  downloadTempFile(image){
    const PATH_TO_WRITE = `${`${FOLDER.ROOT}/FW`}/qr_${new Date().getTime()}.jpeg`;
    RNFetchBlob.fs.writeFile(PATH_TO_WRITE, image.data, 'base64').then(() => {
      QRreader(PATH_TO_WRITE).then((data)=>{
        myLog('::::QR RESPONSE::', data, aesUtil.decrypt(data), aesUtil.decrypt(data).length);
        this.onValidateResult(data);
        RNFetchBlob.fs.unlink(PATH_TO_WRITE);
      }).catch((error)=>{
        myLog('::::QR ERROR::', error);
        RNFetchBlob.fs.unlink(PATH_TO_WRITE);
        this.showError();
      });
    }).catch(()=>{
      this.showError();
    });
  }
  invokeScanInOut(data,onCallback){
    const {
      ScanInOut
    } = this.props;
    ScanInOut(data,(status, response)=>{
      if (status === true) {
        onCallback(true, response);
      }else{
        onCallback(false, response);
      }
      this.setState({isShowBottomButton: true});
    });
  }
  onSessionScanInOut(item, onCallback){
    const {
      userData
    } = this.props;
    let isScanIn = true;
    const userId = _.has(userData,'userId') ? userData.userId : '';
    myLog('++++++++++++++++++++++Scan in /out+++++++++++++++++++++++++++++', item);
    if (item.type === 'startQR') {
      isScanIn = true;
    }else if (item.type === 'endstartQR') {
      isScanIn = false;
    }
    let data = {
      sessionName:item.sessionName,
      sessionId :item.id,
      isScanIn ,
      QRtype:item.type,
      time: convertDateToUTC(moment(), DATE_FORMAT.HHmmss),
      date: convertDateToUTC(moment(), DATE_FORMAT.YYYYMMdd),
      offline: false,
      userId
    };
    this.setState({isShowBottomButton: false});
    const title = 'checkLocationAccess';
    //const title = stringsConvertor('alert.appName');
    const message = stringsConvertor('alertMessage.locationPermission');
    const permission = 'location';
    permissionHelper.permissionChecker(permission, title, message,(status)=>{
      if(status === true){
        Geolocation.getCurrentPosition((position)=>{
          data = {
            ...data,
            latitude: position.coords.latitude,longitude: position.coords.longitude
          };
          this.invokeScanInOut(data,onCallback);
        },
        (error)=>{
          this.invokeScanInOut(data,onCallback);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, showLocationDialog:false }
        ).catch((err)=>{
          this.invokeScanInOut(data,onCallback);
        });
      }else{
        this.invokeScanInOut(data,onCallback);
      }
    });
  }
  onCallScanInOut(result){
    this.onSessionScanInOut(result,(status, response)=>{
      myLog('=====================to see response===========',result,status,response);
      if (status === true) {
        this.setState({sessionName: response, type: result.type},()=>{
          this.setState({isSessionScanSuccess: true});
        });
      }else{
        this.setState({ isErrorMessage: response },()=>{
          this.showError();
        });
      }
      this.setState({isLoading:false});
      this.setState({isShowBottomButton: true});
    });
  }
  validationDateTimeOffline(result){
    myLog('resultOfOfflineScan',result);
    let currentDateTime = convertDateToUTC(moment(),DATE_FORMAT.UTC);
    let startDateTime = moment(result.startDate, DATE_FORMAT.DDMMYYYYhmmss);
    let endDateTime = moment(result.endDate, DATE_FORMAT.DDMMYYYYhmmss);
    let startDate = moment(result.startDate).format(DATE_FORMAT.YYYYMMdd);
    let currentDateTimeItc = moment(currentDateTime, DATE_FORMAT.DDMMYYYYhmmss);
    let type = _.has(result, 'type') ? result.type:'' ;
    myLog('checkType', type);
    if((type == 'startQR') && (startDateTime >= currentDateTimeItc) ){
      myLog('checking startQr');
      this.setState({ isErrorMessage: stringsConvertor('qrScanner.scanAfterStart'),isLoading:false},()=>{
        this.showError();
      });
    }else if((type == 'startQR') && (endDateTime <= currentDateTimeItc)){
      this.setState({ isErrorMessage: stringsConvertor('qrScanner.scanQrExpire'),isLoading:false},()=>{
        this.showError();
      });
    }
    else if((type == 'endstartQR') && endDateTime <= currentDateTimeItc){
      this.setState({ isErrorMessage: stringsConvertor('qrScanner.scanOnEndDay'), isLoading:false},()=>{
        this.showError();
      });
    }
    else if((type == 'endstartQR') && startDateTime >= currentDateTimeItc){
      this.setState({ isErrorMessage: stringsConvertor('qrScanner.scanOutAfterStart'), isLoading:false},()=>{
        this.showError();
      });
    }
    else{
      myLog('i am in else');
      this.onCallScanInOut(result);
    }

    // if(_.has(result,'startDate') && moment(result.startDate, DATE_FORMAT.DDMMYYYYhmmss) >= moment(currentDateTime, DATE_FORMAT.DDMMYYYYhmmss)){
    //   this.setState({ isErrorMessage: stringsConvertor('qrScanner.scanAfterStart'),isLoading:false},()=>{
    //     this.showError();
    //   });
    // }else if(_.has(result,'startDate') && moment(result.startDate, DATE_FORMAT.DDMMYYYYhmmss) < moment(currentDateTime, DATE_FORMAT.DDMMYYYYhmmss)){
    //   this.setState({ isErrorMessage: stringsConvertor('qrScanner.scanQrExpire'),isLoading:false},()=>{
    //     this.showError();
    //   });
    // }
    // else if(_.has(result,'startDate')){
    //   this.onCallScanInOut(result);
    // }
    // if(_.has(result,'endDate') &&  moment(result.endDate, DATE_FORMAT.DDMMYYYYhmmss) <= moment(currentDateTime, DATE_FORMAT.DDMMYYYYhmmss)){
    //   this.setState({ isErrorMessage: stringsConvertor('qrScanner.scanOnEndDay'), isLoading:false},()=>{
    //     this.showError();
    //   });
    // }else{
    //   this.onCallScanInOut(result);
    // }
  }
  onValidateResult(data){
    myLog('--------------jhffffff=================================',this.props);
    const {
      getUserDetails,
      onSuccess,
      topicId,
      type,
      members,
      isNetworkConnected
    } = this.props;
    const { isScanning } = this.state;
    if (isScanning) {
      return;
    }else{
      this.setState({
        isScanning : true
      },()=>{
        let result;
        if(type !== 'topic'){
          if(!IsValidJSONString(data)){result = aesUtil.decrypt(data);}
        }
        if (type === 'topic' && IsValidJSONString(data)) {
          const item = JSON.parse(data);
          if (item.QRtype === 'TOPIC') {
            this.invokeAddTopic(item.id);
          }else {
            this.showError();
          }
        }else if (type === 'member' && result !== undefined && result.length === 36 ) {
          //let isExitingUser = false;
          let requests = members.reduce((promiseChain, item) => {
            return promiseChain.then(() => new Promise(async (resolve) => {
              myLog('item qrcodeScanner>>>>>>>>>>>>>>>, ', item.userId, result);
              if (item.userId === result) {
                isExitingUser = true;
              }
              resolve();
            }));
          }, Promise.resolve());
          requests.then(() => {
            myLog('item isExitingUser>>>>>>>>>>>>>>>, ', isExitingUser);
            if (isExitingUser) {
              this.showError();
              isExitingUser = false;
              return;
            }
            this.setState({statusText:stringsConvertor('qrScanner.scanningStatus'), isLoading:true});
            this.setState({isShowBottomButton: false});
            getUserDetails(result, topicId, (status, response)=>{
              if (status === true && response.eligibleAsTrainer === true) {
                onSuccess(true, response);
                Actions.pop();
              }else if (response.eligibleAsTrainer === false) {
                this.setState({isErrorMessage: stringsConvertor('qrScanner.userNotEligible')},()=>{
                  this.showError();
                });
              } else{
                this.showError();
              }
              this.setState({isLoading:false, isShowBottomButton: true});
            });
          });
        }else if((type === 'start' || type === 'end') && result !== undefined && IsValidJSONString(result)){
          result = JSON.parse(result);
          if(_.has(result,'type')&& (result.type === 'startQR' || result.type === 'endstartQR')){
            if (result.type === 'startQR') {
              this.setState({statusText:stringsConvertor('qrScanner.scanningInStatus'), isLoading:true, type:'start'});
            }else{
              this.setState({statusText:stringsConvertor('qrScanner.scanningOutStatus'), isLoading:true, type:'end'});
            }
            if(isNetworkConnected){
              this.onCallScanInOut(result);
            } else{
              this.validationDateTimeOffline(result);
            }
          }
          else{
            this.showError();
          }
        } else{
          this.showError();
        }
      });
    }
  }


  invokeAddTopic(id){
    const {
      addTopic,
      onSuccess
    } = this.props;
    this.setState({statusText:stringsConvertor('qrScanner.fetchingTopicData'), isLoading:true, isShowBottomButton: false});
    addTopic(id, (status, response)=>{
      myLog(':::response on add topic >>>>>', status, response);
      if (status === true) {
        onSuccess(true, response);
        Actions.pop();
      }else{
        this.setState({ isErrorMessage:response.message},()=>{
          this.showError();
        });
      }
      this.setState({isLoading:false, isShowBottomButton: true});
    });
  }
  onRead = (res) => {
    this.onValidateResult(res.data);
  }



  renderTopView(){
    return(
      <View style={styles.topContainer}>
        <Text style={[TEXT_TYPE.H4,styles.instructionText]}>{stringsConvertor('qrScanner.instructionText')}</Text>
      </View>
    );
  }
  renderButtonView(){
    const {
      flashMode
    } = this.state;
    const {
      type
    } = this.props;
    return(
      <View style={[styles.bottomContainer,{}]}>
        <ButtonWithIcon
          rippleBorderRadius = {verticalScale(25)}
          containerStyle={[styles.bottomIconContainer, { backgroundColor: flashMode ? COLORS.sessionButton : COLORS.white , padding:0}]}
          iconSize={verticalScale(18)}
          iconColor={COLORS.moreInfoColor}
          iconName="flash-symbol"
          isLight={flashMode ? false : true}
          isSolid={flashMode ? true : false}
          onPress={this.onPressFlash}
        />
        <Ripple style={{paddingBottm:5}} onPress={this.onClickGallery}>
          <Image
            style={{width: 63, height: 63}}
            source={require('../../../assets/Images/gallery-icon.png')}
          />


        </Ripple>
        {/* <ButtonWithIconß
          rippleBorderRadius = {verticalScale(25)}
          containerStyle ={styles.bottomIconContainer}
          iconSize={verticalScale(18)}
          iconColor={COLORS.moreInfoColor}
          isLight = {true}
          iconName=''
          onPress={this.onClickGallery}
        /> */}
        {
          type == 'topic' || type == 'member'?
            <ButtonWithIcon
              rippleBorderRadius = {verticalScale(15)}
              containerStyle ={[styles.bottomIconContainer,{backgroundColor:COLORS.flashErrorColor}]}
              iconSize={verticalScale(15)}
              iconColor={COLORS.white}
              isLight = {true}
              iconName="close"
              onPress={this.onClose}
              textStyle={{color:'white', paddingVertical: verticalScale(1)}}
            /> : null


        }
      </View>
    );
  }


  renderQrScanner(){
    const {
      flashMode
    } = this.state;
    return (
      <QRscanner
        isRepeatScan ={true}
        renderTopView={() => this.renderTopView()}
        onRead={this.onRead}
        flashMode = {flashMode}
        finderY={20}
        cornerColor={COLORS.sessionButton}
        cornerBorderWidth={verticalScale(3)}
        hintText=""
        cornerBorderLength={verticalScale(40)}
        rectHeight={verticalScale(200)}
        rectWidth={verticalScale(200)}
        scanBarColor={'#ff0000'}
      />
    );
  }


  renderSuccessView(){
    const {
      type,
      sessionName
    } = this.state;
    const{isNetworkConnected} = this.props;
    return(
      <ScanStatus sessionName={sessionName} type={type} isNetworkConnected={isNetworkConnected}  />
    );
  }
  render(){
    const{
      name,
      type
    } = this.props;
    const {
      isQrError,
      statusText,
      isLoading,
      isSessionScanSuccess,
      isErrorMessage,
      isShowBottomButton
    } = this.state;
    return(
      <View style={styles.container}  pointerEvents = {isLoading ? 'none':null}>
        <StatusBar color= {COLORS.moreInfoColor}/>
        <Toolbar title={stringsConvertor('screenTitle.scan')}
          // rightRender={
          //   type !== 'topic' && type !== 'member'?
          //     <NotificationBell color={COLORS.moreInfoColor} /> : null
          // }
          rightRender={
            <NotificationBell color={COLORS.white} />
          }
        />
        { isSessionScanSuccess ?
          this.renderSuccessView():
          <View style={{flex:1}}>
            <View style={[styles.loadingView,{backgroundColor: isQrError ? COLORS.flashErrorColor:COLORS.flashLoadingBackground}]}>
              {
                isExitingUser ?
                  <Text style={[TEXT_TYPE.H1,styles.statusText]}>{isQrError ? isErrorMessage.length !== 0 ? isErrorMessage:'member already added': statusText}</Text>
                  :
                  <Text style={[TEXT_TYPE.H1,styles.statusText]}>{isQrError ? isErrorMessage.length !== 0 ? isErrorMessage:stringsConvertor('qrScanner.invalidQr') : statusText}</Text>
              }
              {/* <Text style={[TEXT_TYPE.H1,styles.statusText]}>{isQrError ? isErrorMessage.length !== 0 ? isErrorMessage:stringsConvertor('qrScanner.invalidQr') : statusText}</Text> */}
            </View>
            {!isShowBottomButton ?
              <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                <Spinner
                  color={COLORS.sessionButton}
                  type="ChasingDots"
                  size={25}
                />
              </View>:
              <View style={{flex:1}}>
                {this.renderQrScanner()}
                <View style={{position:'absolute', top:0, bottom:verticalScale(80), right:0}}>
                  {this.renderButtonView()}
                </View>
              </View>}
            {
              type !== 'topic' && type !== 'member' ?
                <BottomMenu screen={name}/>:null
            }
          </View>
        }
      </View>
    );
  }
}


export default QrCodeScanner;
