
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Platform,TextInput
} from 'react-native';
import PropTypes from 'prop-types';
import Toolbar from '../../common/Toolbar';
import { stringsConvertor } from '../../../utils/I18n';
import MemberInfoItem from '../../common/listItem/MemberInfoItem';
import { TEXT_TYPE, FONT_FAMILY, verticalScale, deviceWidth, horizontalScale,deviceHeight } from '../../../theme/pdaStyleSheet';
import ButtonWithIcon from '../../common/ButtonWithIcon';
import QRCode from 'react-native-qrcode-svg';
import _ from 'lodash';
import FileItem from '../../common/listItem/FileItem';
import DatePicker from 'react-native-datepicker';
import NotificationBell from '../../../container/common/NotificationBell';
import Spinner from 'react-native-spinkit';
import { myLog, convertDateToLocal, showSuccessMessage, showErrorMessage, navigateToScreen, convertDateToUTC, getNumberOfLines, showNoInternetErrorMessage, downloadFileFromUrl,validateUrl,validateSpecialChar, showLoadingMessage } from '../../../utils/StaticFunctions';
import AesUtil from '../../../utils/AesUtil';
import { DATE_FORMAT, FOLDER } from '../../../constants/String';
import { COLORS } from '../../../constants/Color';
import AddTopicModel from '../../common/AddTopicModel';
import AddMemberModel from '../../common/AddMemberModel';
import Button from '../../common/Button';
import Ripple from '../../common/rippleEffect';
import moment from 'moment';
import { Actions } from 'react-native-router-flux';
import AlertModal from '../../common/AlertModal';
import BottomMenu from '../../common/BottomMenu';
import Share from 'react-native-share';
import CustomIcon from '../../common/CustomIcon';
import AdditionalLinkItem from '../../common/listItem/AdditionalLinkItem';

let isVideoIcon = false;
let isImageIcon = false;
let isPdfIcon = false;
let aesUtil = new AesUtil();
const styles = StyleSheet.create({
  container :{
    flex:1,
    backgroundColor:COLORS.white
  },
  topicContainer:{
    margin:15,
    backgroundColor:COLORS.topicContainerBackground,
    borderRadius: 5,
    borderColor:COLORS.showLineBackground,
    borderWidth:0.5,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 1,
    overflow:'hidden'
  },
  addButton:{
    borderRadius:verticalScale(25),
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
    elevation: 4
  },
  deleteSessionButton:{
    borderRadius:verticalScale(25),
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
    elevation: 2
  },
  addButtonText:{
    paddingVertical:verticalScale(10),
    paddingHorizontal:verticalScale(10),
    color:'white',
    fontSize:verticalScale(16)
  },
  dateStyle:{
    borderBottomWidth: verticalScale(.5),
    alignItems:'center',
    justifyContent:'center',
    paddingTop: verticalScale(5),
    paddingHorizontal:verticalScale(1),
    borderColor: COLORS.sessionLocationTextColor,
    width: (deviceWidth/100)*80
  },
  bottomStyle:{
    flexDirection:'row',
    paddingTop:verticalScale(40),
    paddingBottom:verticalScale(25),
    paddingLeft:verticalScale(0),
    alignItems:'center'
  },
  addressStyle:{
    fontFamily:FONT_FAMILY.SEMI_BOLD,
    color:COLORS.sessionLocationTextColor,
    borderBottomWidth: 0.5
  },
  qrContainer:{
    backgroundColor:COLORS.topicContainerBackground,
    borderRadius: 5,
    borderColor:COLORS.showLineBackground,
    borderWidth:0.5,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 4,
    overflow:'hidden'
  },
  additionalLinkInputStyle:{
    fontFamily:FONT_FAMILY.NORMAL,
    borderBottomWidth: verticalScale(.5),
    color:COLORS.cancelText
  }
});
class SessionInfo extends Component {


  static propTypes = {
    sessionInfo: PropTypes.object,
    deleteMember: PropTypes.func,
    sessionUpdate: PropTypes.func,
    addMember: PropTypes.func,
    updateMember: PropTypes.func,
    sessionInfoDetails:PropTypes.func,
    sessionId: PropTypes.number,
    userData: PropTypes.object,
    name: PropTypes.string,
    cardObject: PropTypes.object,
    deleteSession: PropTypes.func,
    sessionList: PropTypes.func,
    isNetworkConnected: PropTypes.bool
  }
  static defaultProps = {
    cardObject: {},
    deleteMember: ()=>{},
    name: '',
    sessionInfoDetails: ()=>{},
    deleteSession: ()=>{},
    sessionList: ()=>{},
    isNetworkConnected: false,
    deleteAdditionalUrl: ()=>{}
  }
  constructor(props){
    super(props);

    this.state = {
      currentQrCodeStart: true,
      isLoading: true,
      showFile: false,
      showLinkButton:false,
      imageResultType:'base64',
      topicObject: {},
      memberObject:{},
      sessionData: {},
      addTopicModalVisible : false,
      memberEditIndex: -1,
      addMemberModalVisible: false,
      isEditData: false,
      sessionStartDate: moment().format('DD-MMM-YYYY h:mm A'),
      sessionEndDate: '',
      location:'',
      isStartDateError: false,
      isEndDateError: false,
      isLocationError: false,
      startDateError:'',
      endDateError:'',
      locationError:'',
      isLoadingBasic: false,
      alertTitle: stringsConvertor('alertMessage.cancel'),
      alertDescription: stringsConvertor('alertMessage.cancelDescription'),
      alertVisible: false,
      alertType:1,
      deleteMemberIndex: -1,
      isBottomIcons: true,
      isReadMore: false,
      additionalLink:'',
      isadditionalLinkError: false,
      additionalLinkPlaceholder:'Add links to any session related information you would like to share here...'
    };
    this.onLeftQrPress = this.onLeftQrPress.bind(this);
    this.onRightQrPress = this.onRightQrPress.bind(this);
    this.renderFileItem = this.renderFileItem.bind(this);

    this.onAddTopicPress=this.onAddTopicPress.bind(this);
    this.onAddTopicSavePress=this.onAddTopicSavePress.bind(this);
    this.onAddMemberPress = this.onAddMemberPress.bind(this);

    this.onAddMemberSavePress = this.onAddMemberSavePress.bind(this);
    this.onConfirmPress = this.onConfirmPress.bind(this);


    this.onChangeStartDateObject=this.onChangeStartDateObject.bind(this);
    this.onChangeEndDateObject=this.onChangeEndDateObject.bind(this);
    this.onChangeTextLocation=this.onChangeTextLocation.bind(this);


    this.onCancelPress = this.onCancelPress.bind(this);
    this.onAlertSuccessPress = this.onAlertSuccessPress.bind(this);
    this.onDeleteSessionPress = this.onDeleteSessionPress.bind(this);
    this.onReadPress = this.onReadPress.bind(this);
    this.onChangeAdditionalLink = this.onChangeAdditionalLink.bind(this);
    this.onAddAdditionalLink = this.onAddAdditionalLink.bind(this);
    this.onCloseAddlink= this.onCloseAddlink.bind(this);
    this.onDeleteLink = this.onDeleteLink.bind(this);
  }
  componentDidMount(){
    this.invokeSessionInfoApi();
  }
  componentWillReceiveProps(props){
    const topic = _.has(props.sessionInfo,'topicInfo') ? props.sessionInfo.topicInfo : {};
    this.setState({
      sessionData : props.sessionInfo,
      topicObject: topic,
      sessionStartDate: convertDateToLocal(props.sessionInfo.sessionStartDate, DATE_FORMAT.DDMMMYYYYhhmmA),
      sessionEndDate: convertDateToLocal(props.sessionInfo.sessionEndDate, DATE_FORMAT.DDMMMYYYYhhmmA),
      location: props.sessionInfo.address
    });
  }

  onAlertSuccessPress(){
    const {
      sessionData,
      alertType,
      deleteMemberIndex
    } = this.state;
    if (alertType === 2) {
      const data = {
        sessionId: sessionData.sessionId,
        userId: sessionData.members[deleteMemberIndex].userId
      };
      this.props.deleteMember(data, (status, response)=>{
        if (status === true) {
          let arrayOld = sessionData.members;
          arrayOld.splice(deleteMemberIndex, 1);
          this.setState((preState)=>({
            sessionData :{...preState.sessionData, members: arrayOld}
          }));
        }else{
          showErrorMessage(response);
        }
      });
    }else if (alertType === 1) {
      const startDateData = _.has(sessionData,'sessionStartDate') ? convertDateToLocal(sessionData.sessionStartDate, DATE_FORMAT.DDMMMYYYYhmmA) : '';
      const endDateData = _.has(sessionData,'sessionEndDate') ?  convertDateToLocal(sessionData.sessionEndDate, DATE_FORMAT.DDMMMYYYYhmmA) : '';
      const address = _.has(sessionData,'address') ? sessionData.address : '';
      this.setState({isEditData: false, isBottomIcons: true,location:address,sessionStartDate:startDateData,
        sessionEndDate:endDateData});
    }
    if (alertType === 3) {
      const data = {
        sessionId: sessionData.sessionId
      };
      this.props.deleteSession(data, (status, response)=>{
        if (status === true) {
          showSuccessMessage('This session has been deleted');
          this.props.sessionList();
          Actions.pop();
        }else{
          showErrorMessage(response);
        }
      });
    }
    this.setState({
      alertTitle: stringsConvertor('alertMessage.cancel'),
      alertDescription: stringsConvertor('alertMessage.cancelDescription'),
      alertVisible: false,
      alertType:1,
      deleteMemberIndex: -1
    });
  }
  onCancelPress(){
    this.setState({
      alertTitle: stringsConvertor('alertMessage.cancel'),
      alertDescription: stringsConvertor('alertMessage.cancelDescription'),
      alertVisible: true,
      alertType: 1
    });
  }
  onChangeStartDateObject(date){
    this.setState({sessionStartDate:date, isStartDateError:false,startDateError:''});
  }
  onChangeEndDateObject(date){
    this.setState({sessionEndDate:date, isEndDateError:false,endDateError:''});
  }
  onChangeTextLocation(text) {
    this.setState({location: text,locationError:'',isLocationError:false});
  }
  onChangeAdditionalLink(text){
    this.setState({additionalLink : text, showLinkButton: true, isadditionalLinkError: false});
  }
  invokeAdditionalLinkApi(data, onCallback){
    const{
      additionalLinkUpdate
    }= this.props;
    additionalLinkUpdate(data, onCallback);
  }
  onDeleteLink(id){
    const {
      isNetworkConnected,
      deleteAdditionalLink,
      sessionInfo
    }= this.props;
    const sessionId = _.has(sessionInfo, 'sessionId') ? sessionInfo.sessionId : '';
    if (isNetworkConnected) {
      const data = {
        sessionId,
        id
      };
      deleteAdditionalLink(data, (status, response)=>{
        myLog('Additional Link Delete inside+++++++++++',data, response);
        if (status === true) {
          showSuccessMessage(stringsConvertor('validationMessage.linkDeleteSuccess'));
          this.invokeSessionInfoApi();
        }else{
          showErrorMessage(response);
        }
      });
    }


  }
  onAddAdditionalLink(){
    const{
      additionalLink,
      sessionData
    }=this.state;
    const {
      isNetworkConnected
    }= this.props;
    const userId = _.has(sessionData.user, 'userId') ? sessionData.user.userId : '';
    const sessionId = _.has(sessionData, 'sessionId') ? sessionData.sessionId : '';
    if (additionalLink.length === 0) {
      this.setState({additionalLink:'',isadditionalLinkError: true});
      return;
    }
    else if(!additionalLink.includes('.')){
      this.setState({isadditionalLinkError: true});
      return;
    }
    else{
      if (isNetworkConnected) {
        const data = {
          additionalLink,
          userId,
          sessionId
        };
        myLog('Additional Link+++++++++++', additionalLink,data);
        this.setState({isLoadingBasic: true},()=>{
          this.invokeAdditionalLinkApi(data, (status, response)=>{
            if (status === true) {
              showSuccessMessage(stringsConvertor('validationMessage.linkAddSuccess'));
              this.setState({additionalLink:'',showLinkButton:false,additionalLinkPlaceholder:'Add links to any session related information you would like to share here...'});
              this.invokeSessionInfoApi();
            }else{
              showErrorMessage(response);
            }
            this.setState({isLoadingBasic: false});
          });
        });
      }
    }
  }
  onCloseAddlink(){
    this.setState({additionalLink:'', showLinkButton:false,isadditionalLinkError:false,
      additionalLinkPlaceholder:'Add links to any session related information you would like to share here...'});
  }
  onConfirmPress(){
    const {
      sessionStartDate,
      sessionEndDate,
      location,
      sessionData
    } =this.state;
    myLog('===================session=====update==========',sessionStartDate,sessionEndDate);
    let currentDateTime = moment().format('DD-MMM-YYYY h:mm:ss A');
    let isError = false;
    if(sessionData.sessionProgress === 1 && moment(sessionStartDate, 'DD-MMM-YYYY h:mm A') < moment(currentDateTime, 'DD-MMM-YYYY h:mm:ss A')){
      this.setState({isStartDateError:true,startDateError: stringsConvertor('validationMessage.startDateCurrentDateRequired') });
      isError = true;
      myLog('start date time should greater  than current');
    }
    if(sessionEndDate === ''){
      this.setState({isEndDateError:true,endDateError: stringsConvertor('validationMessage.endDateIsRequired') });
      isError = true;
    }
    if(moment(sessionStartDate, 'DD-MMM-YYYY h:mm A') > moment(sessionEndDate, 'DD-MMM-YYYY h:mm A')){
      this.setState({isEndDateError:true,endDateError: stringsConvertor('validationMessage.endDateGreaterThanStartDate')});
      isError = true;
      myLog('end date time greater should than start');
    }
    if(location === ''){
      this.setState({locationError: stringsConvertor('validationMessage.locationRequired'),isLocationError:true});
      isError = true;
    }
    if (isError === true) {
      return;
    }
    let date = new Date();
    const data = {
      ...sessionData,
      address: location,
      sessionEndDate:convertDateToUTC(moment(sessionEndDate.toString(), 'DD-MMM-YYYY hh:mm A')),
      sessionStartDate: convertDateToUTC(moment(sessionStartDate.toString(), 'DD-MMM-YYYY hh:mm A')),
      sessionTimeZone: date.toTimeString().substring(9)
    };
    let isHaveTrainer = false;
    let requests = sessionData.members.reduce((promiseChain, item) => {
      return promiseChain.then(() => new Promise(async (resolve) => {
        if (item.roles.trainer === true) {
          isHaveTrainer = true;
        }
        resolve();
      }));
    }, Promise.resolve());
    requests.then(() => {
      myLog('item memberTrainerRequired>>>>>>>>>>>>>>>, ', isHaveTrainer);
      if (!isHaveTrainer) {
        showErrorMessage(stringsConvertor('validationMessage.memberTrainerRequired'));
        return;
      }
      this.setState({isLoadingBasic: true},()=>{
        this.invokeSessionUpdateApi(data, (status, response)=>{
          if (status === true) {
            showSuccessMessage(stringsConvertor('alertMessage.sessionUpdatedSuccessfully'));
            Actions.pop();
          }else{
            showErrorMessage(response);
          }
          this.setState({isLoadingBasic: false});
        });
      });
    });
  }
  onAddMemberPress(){
    const {
      topicObject,
      sessionData
    } = this.state;
    this.setState({memberObject:{}});

    const members = _.has(sessionData, 'members') ? sessionData.members : [];
    navigateToScreen('QrCodeScannerScreen', {title: stringsConvertor('alert.scanning'), type:'member', members, topicId: topicObject.topic.id, onSuccess:(status, response)=>{
      myLog('ADD MEMBER RESPONSE', response);
      this.setState({
        memberObject : response,
        addMemberModalVisible: true,
        memberEditIndex: -1
      });
    }});
  }
  onEditMemberPress(item, index){
    myLog('::::::onEditMemberPress::', item, index);
    this.setState({
      memberObject : _.cloneDeep(item),
      addMemberModalVisible: true,
      memberEditIndex: index
    });
  }
  onDeleteMemberPress(index){
    myLog('::::onDeleteMemberPress', index);
    this.setState({
      alertTitle: stringsConvertor('alert.removeMember'),
      alertDescription: stringsConvertor('alertMessage.removeMember'),
      alertVisible: true,
      alertType: 2,
      deleteMemberIndex: index
    });
  }
  invokeSessionUpdateApi(data, onCallback){
    const {
      sessionUpdate
    } = this.props;
    sessionUpdate(data, onCallback);
  }
  onAddMemberSavePress(item, onCallback){
    const {
      sessionData,
      memberEditIndex
    } = this.state;
    let memberApi;
    const members = _.has(sessionData, 'members') ? sessionData.members : [];
    let dataSession =_.cloneDeep(sessionData);
    dataSession.members = _.cloneDeep(members);
    if (memberEditIndex === -1) {
      memberApi = this.props.addMember;
      dataSession.members.push(item);
    }else {
      memberApi = this.props.updateMember;
      dataSession.members[memberEditIndex] = item;
    }
    const data = {
      ...item,
      'sessionId': sessionData.sessionId,
      topicId: sessionData.topicInfo.topic.id
    };
    memberApi(data, (status, response)=>{
      if (status === true) {
        this.setState({
          addMemberModalVisible: false,
          sessionData : dataSession,
          memberEditIndex: -1
        },()=>{
          onCallback();
        });
      }else{
        this.setState({addMemberModalVisible: false});
        showErrorMessage(response);
      }
    });
  }
  onAddTopicSavePress(){

    const {
      sessionData
    } = this.state;
    const topicObject  = _.has(this.state,'topicObject') ? this.state.topicObject : {};

    const data = {
      ...sessionData,
      sessionName: topicObject.topic.name,
      sessionDescription: topicObject.topic.description,
      topicId: topicObject.topic.id
    };
    this.invokeSessionUpdateApi(data, (status, response) => {
      myLog(':::::: onAddTopicSavePress', this.state);
      if (status === true) {
        this.invokeSessionInfoApi();
        this.setState({addTopicModalVisible: false});
      }else{
        this.setState({addTopicModalVisible: false});
        showErrorMessage(response);
      }
    });
  }
  onAddTopicPress(){
    navigateToScreen('QrCodeScannerScreen', {title: stringsConvertor('alert.scanning'), type:'topic', onSuccess:(status, response)=>{
      this.setState({
        topicObject : response,
        addTopicModalVisible: true
      });
    }});
  }
  invokeSessionInfoApi(){
    const {
      sessionInfoDetails,
      cardObject
    } = this.props;
    this.setState({isLoading: true},()=>{
      sessionInfoDetails(cardObject.sessionId,()=>{
        this.setState({isLoading: false});
      });
    });
  }
  onLeftQrPress(){
    this.setState({currentQrCodeStart: true});
  }
  onRightQrPress(){
    this.setState({currentQrCodeStart: false});
  }
  onDownloadPress(url){
    const {isNetworkConnected} = this.props;
    if (!isNetworkConnected) {
      showNoInternetErrorMessage();
      return;
    }
    if (url === '' || url === null) {
      showErrorMessage(stringsConvertor('alertMessage.downloadError'));
      return;
    }
    let fileName = `PDA Session Qr-${url.split('/').pop().split('#')[0].split('?')[0]}`;
    fileName =fileName.includes('.pdf') ? fileName : `${fileName}.pdf`;
    const folder = FOLDER.SESSION ;
    showLoadingMessage(stringsConvertor('alertMessage.downloading'));
    this.setState({isDownloading: true, status:stringsConvertor('alertMessage.downloading')},()=>{
      downloadFileFromUrl(fileName,url, folder, true,(status)=>{
        if (status === true) {
          this.setState({isDownloading: true});
          showSuccessMessage(stringsConvertor('alertMessage.downloadSuccess'));
        }else{
          this.setState({isDownloading: false});
          showErrorMessage(stringsConvertor('alertMessage.downloadError'));
        }
      });
    });
  }
  onShare = (url) => {
    const {isNetworkConnected} = this.props;
    if (!isNetworkConnected) {
      showNoInternetErrorMessage();
      return;
    }
    if (url === ''|| url === null) {
      showErrorMessage(stringsConvertor('alertMessage.shareError'));
      return;
    }
    let fileName =`${url.split('/').pop().split('#')[0].split('?')[0]}`;
    fileName =fileName.includes('.pdf') ? fileName :`${fileName}.pdf`;
    const folder = FOLDER.SESSION ;
    this.setState({isDownloading: true, status:stringsConvertor('alertMessage.downloading')},()=>{
      downloadFileFromUrl(fileName,url, folder, false,async (status, path ='')=>{
        myLog('==========status===========', status, path);
        if (status === true) {
          //this.setState({isDownloading: true});
          const shareOptions = {
            message :'',
            url : path,
            failOnCancel: false
          };
          await Share.open(shareOptions).catch(()=>{});
        }else{
          //this.setState({isDownloading: false});
        }
      });
    });
  };
  onDeleteSessionPress(){
    myLog('::::onDeleteSessionPress');
    this.setState({
      alertTitle: stringsConvertor('alert.deleteSession'),
      alertDescription: stringsConvertor('alertMessage.deleteSessionConfirm'),
      alertVisible: true,
      alertType: 3
    });
  }
  onReadPress(){
    myLog('================Read pressed==================',this.state.isReadMore);
    this.setState((prevState) =>{
      return{
        isReadMore:!prevState.isReadMore
      };
    });
  }
  renderFileItem(item, index){
    const{sessionData} = this.state;
    const {isNetworkConnected} = this.props;
    return (
      <FileItem item={item} index={index} sessionData={sessionData}
        isNetwork= {isNetworkConnected}
      />);
  }
  renderCreator(item){
    return(
      <MemberInfoItem item={item} index={0} />
    );
  }
  renderMemberItem(item, index){
    const {
      sessionData
    } = this.state;
    return(
      <MemberInfoItem item={item} index={index}
        type={sessionData.sessionProgress === 1 ? 'sessionCreate' : ''}
        onEditPress={()=>this.onEditMemberPress(item, index)}
        onDeletePress={()=>{this.onDeleteMemberPress(index);}}
      />
    );
  }
  renderAdditionalLinkItem(item,index){
    const {
      sessionData
    } = this.state;
    const {isNetworkConnected} = this.props;
    return(
      <AdditionalLinkItem item={item} index={index} sessionData={sessionData}
        isNetwork= {isNetworkConnected}
        onDeletePress = {this.onDeleteLink}
      />
    );
  }
  renderIcon(type){
    myLog(':::renderIcon::', type);
    let path = '';
    switch (type) {
      case 'Video':
        if (isVideoIcon === false) {
          path = require('../../../assets/Images/video.png');
          isVideoIcon = true;
        }
        break;
      case 'Image':
        if (isImageIcon === false) {
          path = require('../../../assets/Images/imageView.png');
          isImageIcon = true;
        }
        break;
      case 'Document':
        if (isPdfIcon === false) {
          path = require('../../../assets/Images/pdf.png');
          isPdfIcon = true;
        }
        break;
    }
    return( path === '' ? null :
      <View style={{padding:5}}>
        <Image
          source={path}
          resizeMode="cover"
        />
      </View>
    );
  }
  renderTopicView(topicInfo, sessionInfo){
    const {
      showFile,
      isReadMore
    } = this.state;
    const name = _.has(topicInfo.topic,'name') ? topicInfo.topic.name : '';
    const description = _.has(topicInfo.topic,'description') ? topicInfo.topic.description : '';
    const content = _.has(topicInfo,'content') ? topicInfo.content : [];
    const isSessionCreator = _.has(sessionInfo,'isSessionCreator') ? sessionInfo.isSessionCreator : false;
    isVideoIcon = false;
    isImageIcon = false;
    isPdfIcon = false;
    const descLength = getNumberOfLines(description, 1/2);
    myLog('content', content);
    return(
      <View style={styles.topicContainer}>
        <View style={{padding: 10, paddingHorizontal: 15}}>
          <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
            <Text style={[TEXT_TYPE.H2,{fontFamily: FONT_FAMILY.BOLD, paddingBottom: 10, color:COLORS.black,fontWeight:'800'}]}>{stringsConvertor('session.topicHead')}</Text>
            {isSessionCreator  && sessionInfo.sessionProgress === 1?
              <ButtonWithIcon
                onPress={this.onAddTopicPress}
                name={stringsConvertor('session.editSmall')}
                textStyle={[TEXT_TYPE.H1,{color:COLORS.sessionButton}]}
              /> :null}
          </View>
          <Text style={[TEXT_TYPE.H2,{color:COLORS.black,textAlign:'justify'}]}>{name}</Text>
        </View>
        <View style={{backgroundColor:COLORS.grayDark, height:1, marginHorizontal: 10}}/>
        <View style={{paddingHorizontal: 15, paddingVertical:5}}>
          {isReadMore ?
            <View>
              <Text style={[TEXT_TYPE.H1,{color:COLORS.titleColor}]}>{description}</Text>
              <View style={{flexDirection:'row' ,alignSelf:'flex-end'}}>
                <ButtonWithIcon
                  onPress={this.onReadPress}
                  name={stringsConvertor('session.readLess')}
                  textStyle={[TEXT_TYPE.H1,{color:COLORS.sessionButton}]}
                />
              </View>
            </View>
            :
            <View>
              <Text style={[TEXT_TYPE.H1,{color:COLORS.titleColor}]} numberOfLines={4} >{description}</Text>
              { descLength > 4 ?
                <View style={{flexDirection:'row' ,alignSelf:'flex-end'}}>
                  <ButtonWithIcon
                    onPress={this.onReadPress}
                    name={stringsConvertor('session.readMore')}
                    textStyle={[TEXT_TYPE.H1,{color:COLORS.sessionButton}]}
                  />
                </View> : null
              }
            </View>
          }
        </View>
        <View style={{ backgroundColor: COLORS.showLineBackground, height: 1, marginTop: 5 }} />
        <View style={{ flexDirection: 'row', paddingHorizontal: 20 , alignItems:'center', justifyContent:'space-between'}}>
          <View style={{ flexDirection: 'row',paddingVertical: 10, alignItems:'center' }}>
            {_.map(content,(item)=>{
              return this.renderIcon(item.contentType);
            })}
          </View>
          <View>
            <ButtonWithIcon
              iconSize={verticalScale(15)}
              iconName={!showFile ? 'arrow-down-icon' :'arrow-up'}
              iconColor={COLORS.sessionButton}
              onPress={()=>this.setState({showFile: !showFile})}
              name={content.length + stringsConvertor('session.filesUploaded')}
              textStyle={[TEXT_TYPE.H0,{color:COLORS.sessionButton}]}
              iconPosition={'right'}
              imageContainerStyle={{}}
            />
          </View>
        </View>
        {
          showFile ?
            <View>
              <View style={{ backgroundColor: COLORS.showLineBackground, height: 1}} />
              <View style={{backgroundColor:COLORS.topicContainerBackground}}>
                { _.map(content,this.renderFileItem)}
              </View>
            </View>
            :null
        }
      </View>
    );
  }
  renderEntityView(topicInfo){
    const entityName = _.has(topicInfo.program,'entityName') ? topicInfo.program.entityName : '';
    return(
      <View style={styles.topicContainer}>
        <View style={{padding: 10, paddingHorizontal: 15}}>
          <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
            <Text style={[TEXT_TYPE.H2,{fontFamily: FONT_FAMILY.BOLD, paddingBottom: 10, color: COLORS.black,fontWeight:'800'}]}>{stringsConvertor('session.entity')}</Text>
          </View>
          <Text style={[TEXT_TYPE.H2,{color:COLORS.black}]}>{entityName}</Text>
        </View>
      </View>
    );
  }
  renderProgramView(topicInfo){
    const name = _.has(topicInfo.program,'name') ? topicInfo.program.name : '';
    return(
      <View style={styles.topicContainer}>
        <View style={{padding: 10, paddingHorizontal: 15}}>
          <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
            <Text style={[TEXT_TYPE.H2,{fontFamily: FONT_FAMILY.BOLD, paddingBottom: 10, color: COLORS.black,fontWeight:'800'}]}>{stringsConvertor('session.program')}</Text>
          </View>
          <Text style={[TEXT_TYPE.H2,{color:COLORS.black}]}>{name}</Text>
        </View>
      </View>
    );
  }
  renderCreatorView(){
    const {sessionData} = this.state;
    const item = {
      photo: sessionData.sessionCreatorProfile.photo,
      roleDescription: '',
      roles:{
        admin: false,
        other: true,
        otherRoleNames: 'Session Creator',
        trainer: false
      },
      name: sessionData.sessionCreatorProfile.name,
      userId: sessionData.sessionCreatorProfile.userId
    };
    return this.renderCreator(item);
  }
  renderMemberView(members){
    return _.map(members,(item, index)=>this.renderMemberItem(item, index));
  }
  renderSessionLinkView(sessionLinks){
    return _.map(sessionLinks,(item,index)=>this.renderAdditionalLinkItem(item,index));

  }
  renderQrCodeView(sessionInfo){
    const {
      currentQrCodeStart,
      imageResultType
    } = this.state;
    let name = _.has(sessionInfo,'sessionName') ? sessionInfo.sessionName : '';
    if (name.length >= 50) {
      var trimmedSessionName= name.substring(0,50);
    }
    const start = aesUtil.encrypt(JSON.stringify({type:'startQR',id: sessionInfo.sessionId,startDate: sessionInfo.sessionStartDate,sessionName:trimmedSessionName,endDate:sessionInfo.sessionEndDateUtcTime}));
    const end = aesUtil.encrypt(JSON.stringify({type:'endstartQR',id: sessionInfo.sessionId,endDate:sessionInfo.sessionEndDateUtcTime,sessionName:trimmedSessionName,startDate: sessionInfo.sessionStartDate}));
    myLog('checkEndDate', sessionInfo,sessionInfo.sessionEndDateUtcTime);
    //const startDate = _.has(sessionInfo,'sessionStartDate') ? convertDateToLocal(sessionInfo.sessionStartDate, DATE_FORMAT.DDMMMYYYY) : '';
    //const endDate = _.has(sessionInfo,'sessionEndDate') ?  convertDateToLocal(sessionInfo.sessionEndDate, DATE_FORMAT.DDMMMYYYY) : '';
    myLog('========================session info start-end',start,end);
    return(
      <View style={[styles.topicContainer, {backgroundColor:COLORS.white, paddingVertical: verticalScale(10), paddingHorizontal: horizontalScale(12)}]}>
        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
          <Text style={[TEXT_TYPE.H2,{fontFamily: FONT_FAMILY.BOLD, color:COLORS.black}]} numberOfLines={1}>
            {stringsConvertor('session.sessionQrCode')}{currentQrCodeStart === true ? stringsConvertor('session.start'): stringsConvertor('session.end')}</Text>
          <View style={{flexDirection:'row'}}>
            <ButtonWithIcon
              iconSize={verticalScale(15)}
              iconColor={COLORS.sessionButton}
              iconName="share-icon"
              onPress={()=>this.onShare(currentQrCodeStart === true ? sessionInfo.startQrcode : sessionInfo.endQrcode)}
              textStyle={[{color:COLORS.sessionButton}]}
              containerStyle={{alignItems:'center'}}
            />
            <ButtonWithIcon
              iconSize={verticalScale(15)}
              iconName="download-profile-icon"
              iconColor={COLORS.sessionButton}
              // onPress={()=>this.onDownloadPress(`${currentQrCodeStart ? 'START' : 'END'}_${sessionInfo.sessionName}`)}
              onPress={()=>this.onDownloadPress(currentQrCodeStart === true ? sessionInfo.startQrcode : sessionInfo.endQrcode)}
              // name={stringsConvertor('session.download')}
              textStyle={[{color:COLORS.sessionButton}]}
              containerStyle={{alignItems:'center'}}
            />
          </View>
        </View>
        <View style={{flexDirection:'row', paddingVertical:verticalScale(20)}}>
          {currentQrCodeStart === false ?
            <View style={{justifyContent:'center', marginLeft:0, paddingLeft:0}}>
              <ButtonWithIcon
                iconSize={verticalScale(32)}
                iconName="previousQr-icon"
                iconColor={COLORS.sessionButton}
                onPress={this.onLeftQrPress}
                containerStyle={{paddingLeft:0, paddingRight: 0}}
              />
            </View> :null}
          <View style={{flex:1, alignItems:'center', justifyContent:'center', padding:0}}>
            <View style={{paddingVertical:verticalScale(15), alignItems:'center', paddingHorizontal:0, marginHorizontal:0}}>
              <QRCode
                value={currentQrCodeStart === true ? start: end}
                size={verticalScale(235)}
              />
            </View>
          </View>
          {currentQrCodeStart === true?
            <View style={{justifyContent:'center', marginRight:0}}>
              <ButtonWithIcon
                iconSize={verticalScale(32)}
                iconName="nextQr-icon"
                iconColor={COLORS.sessionButton}
                onPress={this.onRightQrPress}
                textStyle={[{color:COLORS.sessionButton}]}
                containerStyle ={{paddingRight: 0, marginRight:0, paddingLeft: 0}}
              />
            </View>:null}
        </View>
      </View>
    );
  }
  renderItem({title, value}){
    return(
      <View style={{padding:5}}>
        <Text style={[TEXT_TYPE.H2,{color:COLORS.sessionLocationTextColor, fontFamily:FONT_FAMILY.LIGHT}]}>{title}</Text>
        <Text style={[TEXT_TYPE.H2,{color:COLORS.black, fontFamily:FONT_FAMILY.SEMI_BOLD, paddingTop:2}]}>{value}</Text>
      </View>
    );
  }
  renderSessionDetailsView(sessionInfo, isEditData, isLoadingBasic){
    const startDateData = _.has(sessionInfo,'sessionStartDate') ? convertDateToLocal(sessionInfo.sessionStartDate, DATE_FORMAT.DDMMMYYYYhhmmA) : '';
    const endDateData = _.has(sessionInfo,'sessionEndDate') ?  convertDateToLocal(sessionInfo.sessionEndDate, DATE_FORMAT.DDMMMYYYYhhmmA) : '';
    const address = _.has(sessionInfo,'address') ? sessionInfo.address : '';
    const startDate = {
      title: stringsConvertor('session.created.startDateAndTime'),
      value: startDateData
    };
    const endDate = {
      title: stringsConvertor('session.created.endDateAndTime'),
      value: endDateData
    };
    const location = {
      title: stringsConvertor('session.created.location'),
      value: address
    };
    const { isBottomIcons } = this.state;
    const isSessionCreator = _.has(sessionInfo,'isSessionCreator') ? sessionInfo.isSessionCreator : false;
    return(
      <View>
        <View style={{paddingBottom: isBottomIcons  ? sessionInfo.sessionProgress === 1 ? isSessionCreator ? verticalScale(15) :verticalScale(100) : verticalScale(100) :verticalScale(0)}}>
          <View style={{backgroundColor:COLORS.white, borderTopColor:COLORS.grayDark, borderTopWidth:0.5, padding: 10, flexDirection:'row'}}>
            <View style={{position:'absolute', right: 20, marginHorizontal:20, zIndex: 10}}>
              <ButtonWithIcon
                onPress={()=>{
                  this.setState({isEditData: true,isBottomIcons: false});
                }}
                name={stringsConvertor('session.editSmall')}
                textStyle={[TEXT_TYPE.H1,{color:COLORS.sessionButton}]}
              />
            </View>
            <View style={{ padding:10}}>
              <CustomIcon
                size={verticalScale(25)}
                color={COLORS.sessionButton}
                name="session-calender-icon"
              />
            </View>
            <View style={{paddingHorizontal:5, flex: 1}}>
              {(isEditData && sessionInfo.sessionProgress === 1 )? this.renderStartDate() : this.renderItem(startDate)}
              {isEditData ? this.renderEndDate(): this.renderItem(endDate)}
              {(isEditData && sessionInfo.sessionProgress === 1) ? this.renderAddress():this.renderItem(location) }
            </View>

          </View>
        </View>
        {isEditData ? this.renderBottomButton(isLoadingBasic): null}
      </View>
    );
  }

  renderFormItem({title, value, type, id,placeholder,isError,error, minDate, disable}, callback){
    let renderInput = null;
    renderInput = (
      <DatePicker
        id = {id}
        style={[styles.dateStyle]}
        date={value}
        mode={type}
        androidMode= "spinner"
        iconComponent={
          <Ripple >
            <CustomIcon
              size={verticalScale(18)}
              color={COLORS.password}
              name="clock-icon"
              light={false}
            /></Ripple>}
        placeholder={placeholder}
        format={DATE_FORMAT.DDMMMYYYYhhmmA}
        minDate={minDate}
        confirmBtnText={stringsConvertor('alert.confirm')}
        cancelBtnText={stringsConvertor('alert.cancel')}
        onDateChange={callback}
        customStyles={{
          dateInput:{
            borderWidth:0,
            alignItems:'flex-start'
          },
          dateText:{
            ...TEXT_TYPE.H3, color:COLORS.textColor
          },
          placeholderText:{
            ...TEXT_TYPE.H3
          }
        }}
      />
    );
    return (
      <View style = {{paddingVertical: verticalScale(12)}} pointerEvents={disable ? 'none': null}>
        <Text style = {[TEXT_TYPE.H3,{color:COLORS.sessionLocationTextColor}]}>
          {title}
        </Text>
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
          {renderInput}
        </View>
        {
          isError ?
            <Text style={{color:COLORS.red,fontSize:11}}>{error}</Text>
            : null
        }
      </View>
    );
  }
  renderStartDate(){
    const{
      sessionStartDate,
      isStartDateError,
      startDateError,
      sessionData
    }=this.state;
    const startDateObject = {
      title :stringsConvertor('session.created.startDateAndTime'),
      value : sessionStartDate,
      type: 'datetime',
      id : 'startDateDropdown',
      ref: (refs)=>{this.sessionStartDate=refs;},
      minDate: new Date(),
      isError:isStartDateError,
      error: startDateError,
      disable: sessionData.sessionProgress === 2 ? true : false
    };
    return this.renderFormItem(startDateObject, this.onChangeStartDateObject);
  }
  renderEndDate(){
    const{
      sessionEndDate,
      isEndDateError,
      endDateError
    }=this.state;
    const endDateObject = {
      title :stringsConvertor('session.created.endDateAndTime'),
      placeholder:stringsConvertor('session.SelectEndDate'),
      value : sessionEndDate,
      type: 'datetime',
      id : 'endDateDropdown',
      ref: (refs)=>{this.sessionEndDate=refs;},
      minDate: new Date(),
      isError:isEndDateError,
      error:endDateError,
      disable: false
    };
    return this.renderFormItem(endDateObject, this.onChangeEndDateObject);
  }
  renderAddress(){
    const {location,isLocationError,locationError, sessionData} = this.state;
    return(
      <View style = {{paddingHorizontal: verticalScale(5), width: (deviceWidth/100)*80}}>
        <Text style = {[TEXT_TYPE.H3,{color:COLORS.sessionLocationTextColor}]}>
          {stringsConvertor('session.created.location')}
        </Text>
        <TextInput
          ref={(input) => this.name = input}
          placeholder={stringsConvertor('session.created.enterTheLocation')}
          style={[TEXT_TYPE.H2,styles.addressStyle]}
          textColor ={COLORS.shadowColor}
          value={location}
          editable = {sessionData.sessionProgress === 1 ? true : false}
          onChangeText={this.onChangeTextLocation}
          onSubmitEditing={()=>{}}
        />
        {
          isLocationError ?
            <Text style={{color:'red',fontSize:11}}>{locationError}</Text>
            : null
        }
      </View>
    );
  }
  renderAdditionalLink(){
    const{
      additionalLink,
      showLinkButton,
      isadditionalLinkError,
      sessionData,
      additionalLinkPlaceholder
    }=this.state;
    const sessionLinks = _.has(sessionData, 'sessionLinks') ? sessionData.sessionLinks: [];
    return(
      <View style={{
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor:COLORS.showLineBackground,
        marginHorizontal:15,
        marginVertical:10}}
      >
        <Text  style={{fontFamily: FONT_FAMILY.BOLD, color:COLORS.black, marginLeft: 15, marginTop:15, fontWeight: '800'}}>Additional Links</Text>
        <View style={{paddingLeft:verticalScale(10)}}>
          {this.renderSessionLinkView(sessionLinks)}
        </View>
        <View style={{marginHorizontal:12,marginBottom:10,paddingTop:5}}>
          <TextInput
            style={[styles.addressStyle,{borderBottomColor: isadditionalLinkError? COLORS.red: COLORS.gray}]}
            textColor ={COLORS.shadowColor}
            value={additionalLink}
            multiline={true}
            onChangeText={this.onChangeAdditionalLink}
            lineHeight={21}
            placeholder={additionalLinkPlaceholder}
            onSubmitEditing ={this.onAddAdditionalLink}
            onFocus={() => this.setState({
              additionalLinkPlaceholder:' ',
              showLinkButton:true
            })}
          />
          {
            isadditionalLinkError?
              <Text style={{color: COLORS.red,fontSize: 12}}>{stringsConvertor('session.invalidUrl')}</Text>
              : null
          }
        </View>{
          showLinkButton?
            <View style={{justifyContent:'flex-end',display:'flex',flexDirection:'row'}}>
              <ButtonWithIcon
                iconName={'error'}
                iconColor={'red'}
                onPress= {this.onCloseAddlink}
              />
              <ButtonWithIcon
                iconName={'tick-icon'}
                iconColor={'green'}
                onPress={this.onAddAdditionalLink}
              />
            </View>
            :null
        }

      </View>
    );
  }
  renderBottomButton(isLoading){
    return(
      <View style={[styles.bottomStyle,{justifyContent:'center'}]}>
        <View style={{marginHorizontal: 15}}>
          <Button
            name = {stringsConvertor('alert.cancelCaps')}
            containerStyle = {{borderColor:COLORS.cancelButtonText,paddingVertical:verticalScale(13),paddingHorizontal:verticalScale(12), marginHorizontal: 10, width: (deviceWidth/100)*36}}
            textStyle= {[styles.bottomButtonText,TEXT_TYPE.H2,{color:COLORS.cancelButtonText}]}
            isGradient={false}
            onPress={this.onCancelPress}
          />
        </View>
        <View style={{marginHorizontal: 15}}>
          <Button
            name = {stringsConvertor('alert.confirmCaps')}
            containerStyle = {{paddingVertical:verticalScale(13),paddingHorizontal:verticalScale(12), marginHorizontal: 10, width: (deviceWidth/100)*36}}
            textStyle= {[styles.bottomButtonText,TEXT_TYPE.H2]}
            onPress={this.onConfirmPress}
            isLoading={isLoading}
          />
        </View>
      </View>
    );
  }
  renderView(sessionInfo){
    myLog('sessionInfo', sessionInfo);
    const isSessionCreator = _.has(sessionInfo,'isSessionCreator') ? sessionInfo.isSessionCreator : false;
    const members = _.has(sessionInfo,'members') ? sessionInfo.members : [];
    const topicInfo = _.has(sessionInfo,'topicInfo') ? sessionInfo.topicInfo : {};
    const isMember = _.has(sessionInfo, 'member') ? sessionInfo.member : false;
    const {
      isEditData,
      isLoadingBasic,
      isBottomIcons
    } = this.state;
    return(
      <View style={{flex:1}}>
        <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} >
          {isMember || isSessionCreator ? this.renderCreatorView() : null}
          {this.renderEntityView(topicInfo)}
          {this.renderProgramView(topicInfo)}
          {this.renderTopicView(topicInfo, sessionInfo)}
          {this.renderQrCodeView(sessionInfo)}
          {this.renderMemberView(members)}
          {isSessionCreator ?
            <View style={{alignItems:'center', marginVertical: verticalScale(10)}}>
              <ButtonWithIcon
                containerStyle ={[styles.addButton,{backgroundColor: COLORS.sessionButton, marginHorizontal:verticalScale(8), width: (deviceWidth/100)*50, justifyContent:'center'}]}
                textStyle={styles.addButtonText}
                iconSize={15}
                iconColor={'white'}
                iconName={'plus'}
                name={stringsConvertor('alert.addMember')}
                onPress={this.onAddMemberPress}
              />
            </View>
            :null}
          {this.renderAdditionalLink()}
          {this.renderSessionDetailsView(sessionInfo, isEditData, isLoadingBasic)}
          { isSessionCreator && sessionInfo.sessionProgress === 1 ?
            <View style={{marginBottom: isBottomIcons ? verticalScale(105):verticalScale(20),alignItems:'center'}}>
              <ButtonWithIcon
                containerStyle ={[styles.deleteSessionButton,{borderColor:COLORS.cancelButtonText,paddingVertical:verticalScale(10), width: (deviceWidth/100)*90, justifyContent:'center'}]}
                textStyle={[styles.bottomButtonText,TEXT_TYPE.H2,{color:COLORS.cancelButtonText}]}
                iconSize={15}
                name={stringsConvertor('session.deleteSessionButton')}
                onPress={this.onDeleteSessionPress}
              />
            </View>
            : null
          }
        </ScrollView>
      </View>);
  }
  renderLoadingView(){
    return(
      <View style={{alignItems:'center', justifyContent:'center', flex: 1}}>
        <Spinner
          color={COLORS.password}
          type="ChasingDots"
          size={40}
        />
      </View>
    );
  }

  renderAddMemberModel(){
    const {addMemberModalVisible, memberObject} = this.state;
    return(
      <AddMemberModel
        data ={memberObject}
        visible={addMemberModalVisible}
        onSavePress={this.onAddMemberSavePress}
        onCancelPress={()=>{
          this.setState({addMemberModalVisible: false});
        }}
      />
    );
  }
  renderAddTopicModel(){
    const {
      addTopicModalVisible,
      topicObject
    } = this.state;
    return(
      <AddTopicModel
        data={topicObject}
        visible={addTopicModalVisible}
        onCancelPress={() => {
          myLog('Add Topic MOdal cancel');
          this.setState({ addTopicModalVisible: false });
        }}
        onSavePress={this.onAddTopicSavePress}
      />
    );
  }
  renderAlertModal(){
    const {
      alertTitle,
      alertDescription,
      alertVisible,
      alertType
    } = this.state;
    myLog('----------', this.state);
    return(
      <AlertModal
        isIcon={false}
        title = {alertTitle}
        description = {alertDescription}
        visible = {alertVisible}
        confirmName={stringsConvertor(alertType === 1 ? 'alert.ok' : alertType === 2 ? 'alert.remove' :'alert.delete')}
        onSuccessPress={this.onAlertSuccessPress}
        onCancelPress={()=>{
          myLog('----onClose Called---');
          this.setState({alertVisible: false});
        }}
        onClosePress={()=>{
          myLog('----onClose Called---');
          this.setState({alertVisible: false});
        }}
      />
    );
  }
  render(){
    const {
      isLoading,
      sessionData,
      isBottomIcons
    } = this.state;
    const {
      name
    } = this.props;
    return (
      <View style={[styles.container]}>
        <Toolbar title={stringsConvertor('screenTitle.ViewSession')}
          isBack={true}
          rightRender={
            <NotificationBell color={COLORS.white} />
          }
        />
        <View style={{flex: 1}}>
          {
            isLoading ?
              this.renderLoadingView() :
              this.renderView(sessionData)
          }
          {
            isBottomIcons ?
              <BottomMenu screen={name}/>
              : null
          }
        </View>
        {this.renderAddTopicModel()}
        {this.renderAddMemberModel()}
        {this.renderAlertModal()}
      </View>
    );
  }

}
export default SessionInfo;