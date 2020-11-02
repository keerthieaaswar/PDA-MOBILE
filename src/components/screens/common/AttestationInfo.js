/**
 * pda
 * AttestationInfo.js
 * @author PDA
 * @description Created on 15/04/2019
 * Copyright © 2019 pda. All rights reserved.
 */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  FlatList,
  Platform
} from 'react-native';
import PropTypes from 'prop-types';
import Spinner from 'react-native-spinkit';
import _ from 'lodash';
import { COLORS } from '../../../constants/Color';
import { verticalScale, FONT_FAMILY, TEXT_TYPE } from '../../../theme/pdaStyleSheet';
import { convertDateToLocal, myLog, convertToTitleCase } from '../../../utils/StaticFunctions';
import { DATE_FORMAT } from '../../../constants/String';
import { stringsConvertor } from '../../../utils/I18n';
import MemberInfoItem from '../../common/listItem/MemberInfoItem';
import FileItem from '../../common/listItem/FileItem';
import ProgressiveImage from '../../common/ProgressiveImage';
import Toolbar from '../../common/Toolbar';
import NotificationBell from '../../../container/common/NotificationBell';
import SessionInfoItem from '../../common/listItem/SessionInfoItem';
import BottomMenu from '../../common/BottomMenu';
import { sendActionAnalytics, sendActionAnalyticsToDB } from '../../../utils/AnalyticsHelper';
import AdditionalLinkItem from '../../common/listItem/AdditionalLinkItem';

let timeStamp = new Date();
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  TextStyle:{
    color: COLORS.fontColor,
    marginVertical: verticalScale(8),
    marginHorizontal: verticalScale(16)
  },
  titleContainer:{
    flex:1,
    padding:verticalScale(15),
    flexDirection: 'row',
    alignItems: 'center'
  },
  titleText:{
    fontFamily:FONT_FAMILY.SEMI_BOLD,
    color:COLORS.fontColor
  },
  buttonContainer:{
    borderColor:COLORS.darkBlue,
    borderWidth: 1,
    margin: verticalScale(5),
    borderRadius: verticalScale(10),
    padding:verticalScale(50)
  },
  bottomIconContainer:{
    height: verticalScale(40),
    width: verticalScale(40),
    borderRadius: verticalScale(20),
    alignItems:'center',
    justifyContent:'center',
    marginHorizontal: verticalScale(10),
    borderWidth:2
  },
  memberContainer:{
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderWidth: 0.5,
    borderColor: COLORS.memberContainer,
    borderRadius: 8,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
    overflow: 'hidden',
    marginVertical:10,
    marginHorizontal: 15
  },
  profileImage:{
    width: verticalScale(115),
    height:verticalScale(110)
  }
});



export default class AttestationInfo extends Component {
  static propTypes ={
    userData:PropTypes.object,
    attestationInfoDataClear: PropTypes.func,
    attestationInfo: PropTypes.array,
    cardObject:PropTypes.object,
    isAttestationInfoLoading: PropTypes.bool,
    name: PropTypes.string,
    isNetworkConnected: PropTypes.bool
  }
  static defaultProps ={
    userData:{},
    attestationInfoDataClear: ()=>{},
    attestationInfo: [],
    cardObject:{},
    name: '',
    isNetworkConnected: false
  }
  constructor(props){
    super(props);
    this.state = {
      isPageLoading: true
    };
    this.renderItem = this.renderItem.bind(this);
    this.renderFileView = this.renderFileView.bind(this);

    const startDate = convertDateToLocal(props.cardObject.sessionStartDate, DATE_FORMAT.DDMMMYYYYhhmmA);
    const endDate = convertDateToLocal(props.cardObject.sessionEndDate, DATE_FORMAT.DDMMMYYYYhhmmA);
    const role = _.has(props.cardObject, 'role') ? props.cardObject.role :'';
    const numberOfParticipants = _.has(props.cardObject,'numberOfParticipants')? props.cardObject.numberOfParticipants:'0';
    let MemberObject = { title: stringsConvertor('attestation.numberOfParticipants'), value: numberOfParticipants};
    const entity = _.has(props.cardObject.topicInfo.program, 'entityName') ? props.cardObject.topicInfo.program.entityName : '';
    this.SessionInfoArray = [
      {title:stringsConvertor('attestation.entity'),value:entity},
      { title: stringsConvertor('attestation.program'), value: props.cardObject.topicInfo.program.name},
      { title: stringsConvertor('attestation.sessionName'), value: props.cardObject.sessionName },
      { title: stringsConvertor('attestation.sessionDescription'), value: props.cardObject.sessionDescription },
      { title: stringsConvertor('attestation.startDateTime'), value: startDate },
      { title: stringsConvertor('attestation.endDateTime'), value: endDate },
      (role ==='TRAINEE' ? null: MemberObject)
    ];
  }
  componentDidMount(){
    myLog('Session info ', this.props);
    const {
      cardObject,
      userData,
      isNetworkConnected
    } = this.props;
    const userId = _.has(userData,'userId') ? userData.userId : '';
    const sessionId = _.has(cardObject, 'sessionId') ?cardObject.sessionId : '';
    const sessionName = _.has(cardObject, 'sessionName') ?cardObject.sessionName : '';
    const role = _.has(cardObject, 'role') ? cardObject.role :'';
    const topicId = _.has(cardObject.topicInfo.topic, 'id') ? cardObject.topicInfo.topic.id :'';
    const topicName = _.has(cardObject.topicInfo.topic, 'name') ? cardObject.topicInfo.topic.name :'';
    const programId = _.has(cardObject.topicInfo.topic, 'programId') ? cardObject.topicInfo.topic.programId :'';
    const programName = _.has(cardObject.topicInfo.program, 'name') ? cardObject.topicInfo.program.name :'';
    const offlineToOnlineSync = !isNetworkConnected;
    sendActionAnalytics('View Attestation',userData,{userId,sessionId,sessionName,role,topicId,topicName,programId,programName,offlineToOnlineSync});
    sendActionAnalyticsToDB('View Attestation',{userId,sessionId,sessionName,role,topicId,topicName,programId,programName,offlineToOnlineSync});
  }
  componentWillReceiveProps(props){
    const {
      cardObject
    } = props;
    const sessionName = _.has(cardObject, 'sessionName') ?cardObject.sessionName : '';
    const sessionDescription = _.has(cardObject, 'sessionDescription') ? cardObject.sessionDescription : '';
    const program = _.has(cardObject.topicInfo.program, 'name') ? cardObject.topicInfo.program.name : '';
    const startDate = convertDateToLocal(props.cardObject.sessionStartDate, DATE_FORMAT.DDMMMYYYYhhmmA);
    const endDate = convertDateToLocal(props.cardObject.sessionEndDate, DATE_FORMAT.DDMMMYYYYhhmmA);
    const numberOfParticipants = _.has(cardObject,'numberOfParticipants')? cardObject.numberOfParticipants:'0';
    const role = _.has(cardObject, 'role') ? cardObject.role :'';
    let MemberObject = { title: stringsConvertor('attestation.numberOfParticipants'), value: numberOfParticipants};
    const entity = _.has(cardObject.topicInfo.program, 'entityName') ? cardObject.topicInfo.program.entityName : '';
    this.SessionInfoArray = [
      {title:stringsConvertor('attestation.entity'),value:entity},
      { title: stringsConvertor('attestation.program'), value: program},
      { title: stringsConvertor('attestation.sessionName'), value: sessionName },
      { title: stringsConvertor('attestation.sessionDescription'), value: sessionDescription },
      { title: stringsConvertor('attestation.startDateTime'), value: startDate },
      { title: stringsConvertor('attestation.endDateTime'), value: endDate },
      (role ==='TRAINEE' ? null: MemberObject)
    ];
    timeStamp = new Date();
  }
  componentWillUnmount(){
    const {
      attestationInfoDataClear
    } = this.props;
    attestationInfoDataClear();
  }
  renderItem({item, index}){
    return(
      <MemberInfoItem item={item} index={index}/>
    );
  }


  renderFileView(item, index,fileArray){
    //myLog('file', item, index,fileArray);
    const {
      cardObject,
      isNetworkConnected
    } = this.props;
    myLog('==================to see item============',item,index);
    return (
      <FileItem item={item} index={index} sessionData={cardObject}
        isNetwork= {isNetworkConnected}
      />);
  }
  renderAdditionalLinkItem(item,index){
    const {
      sessionData
    } = this.state;
    const {isNetworkConnected} = this.props;
    myLog('hello++++++++++++++++++++++++', sessionData);
    return(
      <AdditionalLinkItem item={item} index={index} sessionData={sessionData}
        isNetwork= {isNetworkConnected}
        showDeleteButton = {false}
      />
    );
  }
  renderSessionLinkView(sessionLinks){
    return _.map(sessionLinks,(item,index)=>this.renderAdditionalLinkItem(item,index));

  }

  renderAdditionalLinkView(){
    const{
      sessionData,
      cardObject
    }=this.props;
    const sessionLinks = _.has(cardObject, 'sessionLinks') ? cardObject.sessionLinks: [];
    return(
      <View>
        <Text style={[styles.TextStyle,TEXT_TYPE.H5,{fontWeight: 'bold',color:COLORS.textColor}]}>Additional Links</Text>
        <View style={{
          borderRadius: 5,
          borderWidth: 0.5,
          borderColor:COLORS.showLineBackground,
          marginHorizontal:15,
          marginVertical:10,
          padding: 10}}
        >
          <View style={{}}>
            {sessionLinks.length === 0 ?<Text style={{}}>No link available</Text> : this.renderSessionLinkView(sessionLinks)}
          </View>
          {sessionLinks.length === 0 ?null:
            <Text style={{ fontSize : 12, color : COLORS.gray, paddingBottom:5, paddingLeft:4,textAlign:'justify'}}>
              <Text style={{ fontSize : 13.5, color : COLORS.gray}}>Note: </Text>
        Content associated with the above links are not part of the session curriculum.
            </Text>
          }
        </View>
      </View>

    );
  }
  renderProfileView(image){
    if(image){
      const profileImage = Platform.OS === 'ios' ? {uri:image, CACHE: 'reload'}:{uri:`${image}?${timeStamp}`};
      return (
        <Image
          testID = "profileImage"
          source={profileImage}
          style={styles.profileImage}
        />
      );
    }else{
      return (
        <ProgressiveImage
          source={require('../../../assets/Images/profile.png')}
          thumbnailSource={require('../../../assets/Images/profile.png')}
          style={styles.profileImage}
          resizeMode="cover"
        />
      );
    }
  }
  renderHeaderView() {
    const {userData,cardObject } = this.props;
    const role = _.has(cardObject, 'role') ? cardObject.role :'';
    return(
      <View style={styles.memberContainer}>
        {this.renderProfileView(userData.photo)}
        <View style={{flex:1,flexDirection:'column',paddingHorizontal:15,paddingTop:5}}>
          <Text numberOfLines={3} style={[TEXT_TYPE.H5,{color:COLORS.black}]}>{userData.name}</Text>
          <Text style={[TEXT_TYPE.H1,{}]}>{convertToTitleCase(role)}</Text>
        </View>
      </View>
    );
  }

  render() {
    const{
      isAttestationInfoLoading,
      cardObject,
      name
    }=this.props;
    const content = _.has(cardObject.topicInfo,'content') ? cardObject.topicInfo.content : [];
    return (
      <View style={styles.container}>
        <Toolbar isBack={true} title= {stringsConvertor('screenTitle.attestationDetails')}
          rightRender={
            <NotificationBell color={COLORS.white} />
          }
        />
        {
          isAttestationInfoLoading?
            <View style={{flex:1, alignItems:'center',justifyContent:'center'}}>
              <Spinner
                color={COLORS.sessionButton}
                type="ChasingDots"
                size={25}
              />
            </View>:
            <ScrollView contentContainerStyle={{backgroundColor:COLORS.white, paddingBottom: verticalScale(100)}}>
              <View>
                {this.renderHeaderView()}
              </View>
              {
                this.SessionInfoArray.map((item,index)=>{
                  return(
                    item && <SessionInfoItem item={item} index={index}/>
                  );
                })
              }
              <View>
                <Text style={[TEXT_TYPE.H5,{paddingHorizontal:verticalScale(15),
                  paddingVertical:verticalScale(10),fontWeight: 'bold',color:COLORS.textColor}]}
                >{stringsConvertor('attestation.content')}</Text>
                <View style={{
                  backgroundColor:COLORS.white,
                  shadowColor: COLORS.black,
                  shadowOffset: {
                    width: 0,
                    height: 1
                  },
                  shadowOpacity: 0.20,
                  shadowRadius: 1.41,
                  elevation: 2,
                  margin:15,
                  marginTop:5,
                  borderColor: COLORS.memberContainer,
                  borderWidth:0.5,
                  borderRadius:8 }}
                >

                  { content.length === 0 ? <Text style ={{marginHorizontal:verticalScale(10),paddingVertical:verticalScale(5)}}>No content available</Text> :
                    _.map(content,this.renderFileView)
                  }
                </View>
              </View>
              {this.renderAdditionalLinkView()}
              {
                <View>
                  <Text style={[styles.TextStyle,TEXT_TYPE.H5,{fontWeight: 'bold',color:COLORS.textColor}]}>{stringsConvertor('attestation.members')}</Text>
                  <FlatList
                    data={this.props.cardObject.members}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index}
                  />
                </View>
              }
            </ScrollView>
        }
        <BottomMenu screen={name}/>
      </View>
    );
  }
}
