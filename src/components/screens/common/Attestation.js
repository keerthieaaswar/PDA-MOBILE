/**
 * pda
 * Session.js
 * @author PDA
 * @description Created on 27/02/2019
 * Copyright © 2019 pda. All rights reserved.
 */
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  Animated,
  PanResponder,
  ScrollView} from 'react-native';
import Swipeable from 'react-native-swipeable-row';
import Share from 'react-native-share';
import QRCode from 'react-native-qrcode-svg';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Spinner from 'react-native-spinkit';
import { verticalScale, deviceHeight, TEXT_TYPE, FONT_FAMILY } from '../../../theme/pdaStyleSheet';
import { COLORS } from '../../../constants/Color';
import { navigateToScreen, showNoInternetErrorMessage, showErrorMessage, downloadFileFromUrl, myLog, showSuccessMessage, convertDateToLocal, showLoadingMessage } from '../../../utils/StaticFunctions';
import { stringsConvertor } from '../../../utils/I18n';
import { FOLDER, DATE_FORMAT } from '../../../constants/String';
import { sendActionAnalytics, sendActionAnalyticsToDB } from '../../../utils/AnalyticsHelper';
import AttestationItem from '../../common/listItem/AttestationItem';
import QrCodeModal from '../../common/QrCodeModal';
import Ripple from '../../common/rippleEffect';
import ButtonWithIcon from '../../common/ButtonWithIcon';
import Toolbar from '../../common/Toolbar';
import NotificationBell from '../../../container/common/NotificationBell';
import BottomMenu from '../../common/BottomMenu';


let isInfoButtonClicked = false;
const styles = StyleSheet.create({
  image:{
    height:verticalScale(300),
    width:verticalScale(300)
  },
  buttonStyle:{
    paddingHorizontal: verticalScale(2),
    paddingVertical: verticalScale(15),
    borderRadius:verticalScale(40)
  },
  buttonText:{
    color:COLORS.white,
    fontWeight: 'bold',
    paddingHorizontal:verticalScale(40)
  },
  container: {
    flex: 1,
    backgroundColor:COLORS.white
  },
  instructions: {
    textAlign: 'center',
    color: COLORS.textColor,
    marginBottom: verticalScale(5)
  },
  draggable: {
    position: 'absolute',
    right: 0,
    backgroundColor:COLORS.white,
    paddingBottom:  verticalScale(90),
    shadowOpacity: 0.0015 * 6 + 0.18,
    shadowRadius: 0.54 * 6,
    shadowOffset: {
      height: 0.6 * 6
    },
    shadowColor: COLORS.shadowColor,
    elevation: 6
  },
  dragHandle: {
    fontSize: 22,
    color: COLORS.dragHandlerColor,
    height: 50
  },
  trainerContainer:{
    backgroundColor: COLORS.trainerBackground,
    borderColor: COLORS.attestationTrainerBorder,
    borderWidth: 0.5
  },
  traineeContainer:{
    backgroundColor: COLORS.trainerBackground,
    borderColor: COLORS.attestationTraineeBorder,
    borderWidth:0.5
  },
  defaultContainerStyle :  {
    paddingVertical:  verticalScale(10),
    paddingRight: verticalScale(5),
    flexDirection : 'row',
    marginLeft : verticalScale(1)
  },
  icon:{
    padding: verticalScale(30),
    marginHorizontal: verticalScale(2)
  },
  backButton:{
    alignItems:'center',
    justifyContent:'center',
    paddingVertical: verticalScale(1),
    borderRadius: verticalScale(40),
    paddingHorizontal: verticalScale(10)
  },
  rightSwipeItem: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: verticalScale(20)
  },
  cardContainer:{
    height: (deviceHeight/100)*29,
    borderRadius: 10,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2
  }
});
let initialPosition;
class Attestation extends Component {

  static propTypes = {
    visible: PropTypes.bool,
    cardObject: PropTypes.object,
    title: PropTypes.string,
    attestationCardSelect: PropTypes.func,
    attestationList: PropTypes.func,
    attestation: PropTypes.array,
    userData: PropTypes.object,
    isNetworkConnected: PropTypes.bool,
    isAttestationListLoading: PropTypes.bool,
    name: PropTypes.string
  }

  static defaultProps = {
    attestationCardSelect: ()=>{},
    attestationList: ()=>{}
  }
  constructor(props){
    super(props);
    const {height} = Dimensions.get('window');
    initialPosition = {x: 0, y: height - verticalScale(450)};
    const position = new Animated.ValueXY(initialPosition);
    this.visibility = new Animated.Value(this.props.visible ? 1 : 0);


    const parentResponder = PanResponder.create({
      onMoveShouldSetPanResponderCapture: () => {
        return false;
      },
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (e, gestureState) =>  {
        if ((this.state.isScrollEnabled && this.scrollOffset <= 0 && gestureState.dy > 0) || !this.state.isScrollEnabled && gestureState.dy < 0) {
          return true;
        } else {
          return false;
        }
        // if (this.state.toTop) {
        //   return gestureState.dy > 6;
        // } else {
        //   return gestureState.dy < -6;
        // }
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (evt, gestureState) => {
        let newy = gestureState.dy;
        if (this.state.toTop && newy < 0 ) return;
        if (this.state.toTop) {
          position.setValue({x: 0, y: newy});
        } else {
          position.setValue({x: 0, y: initialPosition.y + newy});
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (this.state.toTop) {
          if (gestureState.dy > 50) {
            this.snapToBottom(initialPosition);
            this.setState({isShowBottomButton: false});
          } else {
            this.snapToTop();
            this.setState({isShowBottomButton: true});
          }
        } else {
          if (gestureState.dy < -90) {
            this.snapToTop();
            this.setState({isShowBottomButton: true});
          } else {
            this.snapToBottom(initialPosition);
            this.setState({isShowBottomButton: false});
          }
        }
      }
    });

    this.offset = 0;
    this.parentResponder = parentResponder;
    this.state = {
      isScrollEnabled: false,
      position,
      toTop: false,
      isShowBottomButton: false,
      qrModalVisible: false
    };
    this.renderItem = this.renderItem.bind(this);
    this.scrollOffset = 0;
    this.renderItem = this.renderItem.bind(this);
    this.onInfoPress = this.onInfoPress.bind(this);
    this.onDownloadPress = this.onDownloadPress.bind(this);
  }
  componentDidMount(){
    this.invokeGetAttestationList();
  }
  componentWillUnmount(){
  }
  invokeGetAttestationList(){
    this.props.attestationList();
  }

  snapToTop = () => {
    Animated.timing(this.state.position, {
      toValue: {x: 0, y: 0},
      duration: 300
    }).start(() => {});
    this.setState({ toTop: true, isScrollEnabled: true});
  }

  snapToBottom = (initialPosition) => {
    Animated.timing(this.state.position, {
      toValue: initialPosition,
      duration: 300
    }).start(() => {});
    this.setState({ toTop: false, isScrollEnabled: false });
  }
  // onInfoPress(){
  //   const {cardObject} =this.props;
  //   myLog('================================++++++++++++++++++++++++++++++++++++++++',cardObject);
  //   if(isInfoButtonClicked){
  //     navigateToScreen('AttestationInfoScreen',{cardObject});
  //     isInfoButtonClicked=true;
  //     setTimeout(() => {
  //       isInfoButtonClicked=false;
  //     }, 2000);
  //   }
  // }

  onShare= (url) => {
    if (url === null|| url === '') {
      showErrorMessage(stringsConvertor('validationMessage.noURLFound'));
      return;
    }
    const {userData,cardObject, isNetworkConnected} = this.props;
    const sessionId = cardObject.sessionId;
    let fileName = `${url.split('/').pop().split('#')[0].split('?')[0]}`;
    fileName = fileName.includes('.pdf') ? fileName : `${fileName}.pdf`;
    const folder = FOLDER.ATTESTATION ;
    if (!isNetworkConnected) {
      showNoInternetErrorMessage();
      return;
    }
    this.setState({isDownloading: true, status:stringsConvertor('alertMessage.downloading')},()=>{
      downloadFileFromUrl(fileName,url, folder, false,async (status, path ='')=>{
        myLog('==========status===========onShare==Attestation', status, path,userData,cardObject);
        if (status === true) {
          const attestationUrl= _.has(cardObject,'attestationUrl') ? cardObject.attestationUrl :'';
          const userId = _.has(userData,'userId') ? userData.userId :'';
          const sessionName = _.has(cardObject,'sessionName') ? cardObject.sessionName :'';
          const programName = _.has(cardObject,'programName') ? cardObject.programName :'';
          const role = _.has(cardObject,'role') ? cardObject.role :'';
          const sessionStartDate = _.has(cardObject,'sessionStartDate') ? cardObject.sessionStartDate :'';
          const sessionEndDate = _.has(cardObject,'sessionEndDate') ? cardObject.sessionEndDate :'';
          const noOfParticipants = _.has(cardObject,'numberOfParticipants') ? cardObject.numberOfParticipants :'';
          const topicId = _.has(cardObject,'topicId') ? cardObject.topicId :'';
          const topicName = _.has(cardObject.topicInfo.topic,'name') ? cardObject.topicInfo.topic.name :'';
          const programId = _.has(cardObject.topicInfo.topic, 'programId') ? cardObject.topicInfo.topic.programId :'';
          sendActionAnalytics('Share Attestation',userData,{userId,sessionId,sessionName,topicName,topicId,programId,programName});
          sendActionAnalyticsToDB('Share Attestation',{topicName,topicId,sessionStartDate,sessionEndDate,attestationUrl,
            programId,sessionId,userId,sessionName,programName,role,noOfParticipants});
          this.setState({isDownloading: true});
          const shareOptions = {
            message :'',
            url : path ,
            failOnCancel: false
          };
          await Share.open(shareOptions).catch(()=>{});
        }
      });
    });
  };
  onDownloadPress=(url)=>{
    if (url === null || url ==='') {
      showErrorMessage(stringsConvertor('validationMessage.noURLFound'));
      return;
    }
    myLog('onDownloadPress', url);
    const {userData,cardObject, isNetworkConnected} = this.props;
    const sessionId = cardObject.sessionId;
    let fileName = `PDA Attestation-${url.split('/').pop().split('#')[0].split('?')[0]}`;
    fileName = fileName.includes('.pdf') ? fileName : `${fileName}.pdf`;
    const folder = FOLDER.ATTESTATION ;
    if (!isNetworkConnected) {
      showNoInternetErrorMessage();
      return;
    }
    myLog('+++++++++++++++++++attestation>>>>>>>>>>>>>>>>',cardObject,this.props, fileName);
    showLoadingMessage(stringsConvertor('alertMessage.downloading'));
    this.setState({isDownloading: true, status:stringsConvertor('alertMessage.downloading')},()=>{
      downloadFileFromUrl(fileName,url, folder, true,(status)=>{
        if (status === true) {
          const attestationUrl= _.has(cardObject,'attestationUrl') ? cardObject.attestationUrl :'';
          const userId = _.has(userData,'userId') ? userData.userId :'';
          const sessionName = _.has(cardObject,'sessionName') ? cardObject.sessionName :'';
          const programName = _.has(cardObject,'programName') ? cardObject.programName :'';
          const role = _.has(cardObject,'role') ? cardObject.role :'';
          const sessionStartDate = _.has(cardObject,'sessionStartDate') ? cardObject.sessionStartDate :'';
          const sessionEndDate = _.has(cardObject,'sessionEndDate') ? cardObject.sessionEndDate :'';
          const noOfParticipants = _.has(cardObject,'numberOfParticipants') ? cardObject.numberOfParticipants :'';
          const topicId = _.has(cardObject,'topicId') ? cardObject.topicId :'';
          const topicName = _.has(cardObject.topicInfo.topic,'name') ? cardObject.topicInfo.topic.name :'';
          const programId = _.has(cardObject.topicInfo.topic, 'programId') ? cardObject.topicInfo.topic.programId :'';
          sendActionAnalytics('Download Attestation',userData,{userId,sessionId,sessionName,topicId,topicName,programId,programName});
          sendActionAnalyticsToDB('Download Attestation',{topicName,topicId,sessionStartDate,sessionEndDate,
            attestationUrl,programId,sessionId,userId,sessionName,programName,role,noOfParticipants});
          this.setState({isDownloading: true});
          showSuccessMessage(stringsConvertor('alertMessage.downloadSuccess'));
        }
      });
    });
  }
  onInfoPress(){
    const{
      cardObject
    }=this.props;
    navigateToScreen('AttestationInfoScreen',{cardObject});
  }
  renderItem(item, index, array){
    return(
      <AttestationItem key={index} item={item}
        index={index}
        lastIndex={array.length - 1}
        onPress={()=>{
          this.snapToBottom(initialPosition);
          this.props.attestationCardSelect(index);
        }}
      />
    );
  }
  renderQrView(){
    const {
      qrModalVisible
    } = this.state;
    const {
      cardObject
    } = this.props;
    const qrCodeValue = _.has(cardObject, 'qrCodeUrl') ? cardObject.qrCodeUrl :'';
    return(
      <View>
        <QrCodeModal
          value={qrCodeValue}
          visible={qrModalVisible}
          onClosePress={()=>{
            this.setState({qrModalVisible: false});
          }}
        />
      </View>
    );
  }
  renderTopCard(){
    const{
      cardObject
    } = this.props;
    let containerStyle = {};
    switch(cardObject.role ? cardObject.role.toUpperCase():''){
      case 'PARTICIPANT':
        containerStyle = styles.traineeContainer;
        break;
      default:
        containerStyle = styles.trainerContainer;
        break;
    }
    const endDate =  convertDateToLocal(cardObject.attestationDate, DATE_FORMAT.DDMMMYYYY);
    return(
      <View style={{marginVertical:verticalScale(20),marginHorizontal:verticalScale(10), alignItems:'center',justifyContent:'center'}}>
        <View style={{flexDirection:'row',height:verticalScale(200), zIndex:-5, alignItems:'center',justifyContent:'center'}}>
          <View style={{flex:1}}>
            <Swipeable
              rightContent={(
                <View style={[styles.rightSwipeItem, {zIndex:-99, backgroundColor:'transparent'}]} />
              )}
              onRightActionDeactivate={()=>navigateToScreen('AttestationInfoScreen',{cardObject})}
              style={{zIndex:10}}
            >
              <View style={[styles.cardContainer, containerStyle, {backgroundColor:cardObject.role === 'TRAINEE' ? COLORS.traineeBackground: COLORS.otherBackground}]}>
                <Ripple style={{flex:1, padding: verticalScale(10), flexDirection:'row'}} onPress={()=>navigateToScreen('AttestationInfoScreen',{cardObject})} >
                  <View style={{flex:1 , paddingHorizontal: verticalScale(10)}}>
                    <Text style={[TEXT_TYPE.H3,{color:COLORS.black,textAlign:'justify'} ]} numberOfLines={3}>{cardObject.sessionName}</Text>
                    <View style={{ paddingVertical: verticalScale(10), flex:1}}>
                      <Text style={[TEXT_TYPE.H2 ]} numberOfLines={2}>{endDate}</Text>
                    </View>
                  </View>
                </Ripple>
                <View style={{position:'absolute',alignSelf:'flex-end',paddingRight:verticalScale(10),marginTop:verticalScale(73)}}>
                  <Ripple
                    rippleContainerBorderRadius={verticalScale(10)}
                    style={{padding:verticalScale(5),backgroundColor:COLORS.white,borderColor:COLORS.attestationRipple, borderWidth:1, borderRadius: 10}}
                    onPress={()=>{this.setState({qrModalVisible: true});}}
                  >
                    <QRCode
                      value={cardObject.qrCodeUrl ? cardObject.qrCodeUrl :'No value'}
                      size={verticalScale(60)}
                    />
                  </Ripple>
                </View>
                <View style={{height:0.5, backgroundColor:COLORS.gray}}/>
                <View style={{flexDirection:'row' }}>
                  <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                    <ButtonWithIcon
                      iconSize={Platform.OS === 'ios'? verticalScale(13) : verticalScale(20)}
                      iconName="share-icon"
                      isLight={true}
                      name={stringsConvertor('attestation.share')}
                      textStyle={{color:COLORS.shareTextColor}}
                      iconColor={COLORS.shareTextColor}
                      onPress={()=>this.onShare(cardObject.attestationUrl)}
                    />
                  </View>
                  <View style={{width:0.5, backgroundColor:COLORS.gray}}/>
                  <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                    <ButtonWithIcon
                      iconSize={verticalScale(13)}
                      iconName="download-small-icon"
                      isLight={true}
                      name={stringsConvertor('attestation.download')}
                      textStyle={{color:COLORS.shareTextColor}}
                      iconColor={COLORS.shareTextColor}
                      onPress={()=>this.onDownloadPress(cardObject.attestationUrl)}
                    />
                  </View>
                </View>
              </View>
            </Swipeable>
          </View>
        </View>
      </View>
    );
  }

  renderListView(attestation){
    const {height} = Dimensions.get('window');
    const {
      isShowBottomButton
    } = this.state;
    return (
      <View style={[styles.container]}>
        {this.renderTopCard()}
        <Animated.View style={[styles.draggable, { height:height-verticalScale(50) }, this.state.position.getLayout()]} {...this.parentResponder.panHandlers}>
          <View style={{flexDirection:'row',
            justifyContent:'space-between',
            backgroundColor:COLORS.animationBackground, padding:verticalScale(10), alignItems:'center'}}
          >
            <Text style={[TEXT_TYPE.H5, {color: COLORS.black, fontFamily: FONT_FAMILY.SEMI_BOLD}]}>{stringsConvertor('attestation.allAttestation')}</Text>
          </View>
          <View style={{paddingTop: verticalScale(20),paddingBottom:isShowBottomButton ? verticalScale(40):verticalScale(0)}}>
            <ScrollView
              scrollEnabled={this.state.isScrollEnabled}
              scrollEventThrottle={16}
              onScroll={(event) => {
                this.scrollOffset = event.nativeEvent.contentOffset.y;
              }}
            >
              {attestation.map(this.renderItem)}
            </ScrollView>
          </View>
        </Animated.View>
      </View>
    );
  }

  renderNoDataView(){
    return(
      <View style={{flex:1, alignItems:'center', justifyContent: 'center', padding: verticalScale(30)}}>
        {/* <Image resizeMode ="contain" source = {require('../../../assets/Images/attestationInitial.png')} style={styles.image}/> */}
        <Text style={[TEXT_TYPE.H2,{textAlign:'center',paddingBottom:verticalScale(100)}]}>{stringsConvertor('session.textContentMessage1')}</Text>
      </View>
    );
  }

  render(){
    const {
      name,
      attestation,
      isAttestationListLoading
    } = this.props;
    const {
      isShowBottomButton
    } = this.state;
    return(
      <View style={styles.container}>
        <Toolbar title={stringsConvertor('screenTitle.Attestations')}
          rightRender={
            <NotificationBell color={COLORS.white} />
          }
        />
        { isAttestationListLoading ?
          <View style={{flex:1, alignItems:'center',justifyContent:'center'}}>
            <Spinner
              color={COLORS.shareTextColor}
              type="ChasingDots"
              size={25}
            />
          </View> :
          attestation.length === 0 ?
            this.renderNoDataView()
            :this.renderListView(attestation)
        }
        {this.renderQrView()}
        {isShowBottomButton  || attestation.length < 6  ? <BottomMenu style={{}} screen={name}/> : null}
      </View>
    );
  }

}

export default Attestation;
