/**
 * pda
 * SessionCreate.js
 * @author Socion Advisors LLP
 * @description Created on 10/06/2019
 * Copyright © 2019 pda. All rights reserved.
 */
import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  ScrollView,
  TextInput,
  Platform
} from 'react-native';
import PropTypes from 'prop-types';
import ButtonWithIcon from '../../common/ButtonWithIcon';
import Toolbar from '../../common/Toolbar';
import { verticalScale, TEXT_TYPE, FONT_FAMILY, horizontalScale } from '../../../theme/pdaStyleSheet';
import DatePicker from 'react-native-datepicker';
import Ripple from '../../common/rippleEffect';
import Button from '../../common/Button';
import NotificationBell from '../../../container/common/NotificationBell';
import AddTopicModel from '../../common/AddTopicModel';
import AddMemberModel from '../../common/AddMemberModel';
import moment from 'moment';
import { myLog, navigateToScreen, showErrorMessage, showSuccessMessage, convertDateToUTC, getNumberOfLines } from '../../../utils/StaticFunctions';
import _ from 'lodash';
import FileItem from '../../common/listItem/FileItem';
import MemberInfoItem from '../../common/listItem/MemberInfoItem';
import { URL } from '../../../utils/httpClient/Url';
import { Actions } from 'react-native-router-flux';
import { stringsConvertor } from '../../../utils/I18n';
import AlertModal from '../../common/AlertModal';
import { COLORS } from '../../../constants/Color';
import { DATE_FORMAT } from '../../../constants/String';
import CustomIcon from '../../common/CustomIcon';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
let timeStamp = new Date();
const styles = StyleSheet.create({
  profileImage :{
    width:verticalScale(80),
    height:verticalScale(80)
  },
  addButton:{
    borderRadius:verticalScale(25)
  },
  bottomButtonText :{
    paddingHorizontal:verticalScale(30)
  },
  dateStyle:{
    borderBottomWidth: verticalScale(.5),
    alignItems:'center',
    justifyContent:'center',
    paddingTop: verticalScale(5),
    paddingHorizontal:verticalScale(1),
    borderColor: COLORS.sessionLocationTextColor,
    flex:1
  },
  addressStyle:{
    fontFamily:FONT_FAMILY.SEMI_BOLD,
    borderBottomWidth: verticalScale(.5),
    color:COLORS.sessionLocationTextColor
  },
  bottomStyle:{
    flexDirection:'row',
    justifyContent:'center',
    paddingTop:verticalScale(40),
    paddingBottom:verticalScale(25),
    paddingLeft:verticalScale(25),
    paddingRight:verticalScale(25)
  },
  profileView:{
    flexDirection:'row',
    margin:verticalScale(20),
    borderRadius:verticalScale(8),
    overflow:'hidden',
    backgroundColor:COLORS.white
  },
  addButtonView:{
    flex:1,flexDirection:'row',
    justifyContent:'center',
    paddingVertical:verticalScale(28),
    paddingLeft:verticalScale(28),
    paddingRight:verticalScale(28),
    backgroundColor: COLORS.addTopicViewBackground
  },
  addButtonText:{
    paddingVertical:verticalScale(9),
    paddingHorizontal:verticalScale(10),
    paddingLeft:verticalScale(10),
    paddingRight:verticalScale(5),
    color:'white',
    fontSize:verticalScale(14)
  },
  addButtonText1:{
    paddingVertical:verticalScale(9),
    paddingLeft:verticalScale(10),
    paddingRight:verticalScale(24),
    color:'white',
    fontSize:verticalScale(14)
  },
  shadow1:{
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,

    elevation: 2
  },
  shadow2:{
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
    elevation: 4
  },
  topicContainer:{
    margin:15,
    backgroundColor: COLORS.topicContainerBackground,
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
    elevation: 2,
    overflow:'hidden'
  }
});

let isVideoIcon = false;
let isImageIcon = false;
let isPdfIcon = false;

export default class SessionCreate extends Component {
  static propTypes = {
    sessionCreate: PropTypes.func,
    session: PropTypes.object,
    userData: PropTypes.object,
    isNetworkConnected: PropTypes.bool
  }

  static defaultProps = {
    sessionCreate: ()=>{},
    isNetworkConnected: false
  }
  constructor(){
    super();
    this.state ={
      sessionStartDate: moment().format(DATE_FORMAT.DDMMMYYYYhhmmA),
      sessionEndDate: '',
      location:'',
      addTopicModalVisible:false,
      addMemberModalVisible:false,
      isLocationError: false,
      locationError:'',
      isStartDateError:false,
      startDateError:'',
      isEndDateError:false,
      endDateError:'',
      isStartTimeError:false,
      startTimeError:'',
      isEndTimeError:false,
      endTimeError:'',
      topicObject: {},
      memberObject: {},
      sessionData: {},
      showFile: false,
      memberEditIndex: -1,
      isLoading: false,
      alertTitle: stringsConvertor('alertMessage.cancel'),
      alertDescription: stringsConvertor('alertMessage.cancelDescription'),
      alertVisible: false,
      alertType:1,
      deleteMemberIndex: -1,
      isReadMore:false
    };
    this.onChangeStartDateObject=this.onChangeStartDateObject.bind(this);
    this.onChangeEndDateObject=this.onChangeEndDateObject.bind(this);
    this.onChangeStartTimeObject=this.onChangeStartTimeObject.bind(this);
    this.onChangeEndTimeObject=this.onChangeEndTimeObject.bind(this);
    this.onChangeTextLocation=this.onChangeTextLocation.bind(this);
    this.onAddTopicPress=this.onAddTopicPress.bind(this);
    this.onAddMemberPress=this.onAddMemberPress.bind(this);
    this.onConfirmPress = this.onConfirmPress.bind(this);

    this.renderFileItem = this.renderFileItem.bind(this);
    this.onAddTopicSavePress = this.onAddTopicSavePress.bind(this);
    this.onAddMemberSavePress = this.onAddMemberSavePress.bind(this);
    this.onDeleteMemberPress = this.onDeleteMemberPress.bind(this);

    this.onCancelPress = this.onCancelPress.bind(this);

    this.onAlertSuccessPress = this.onAlertSuccessPress.bind(this);
    this.onReadPress = this.onReadPress.bind(this);
  }
  componentWillReceiveProps(){
    timeStamp = new Date();
  }
  onAlertSuccessPress(){
    const {
      sessionData,
      alertType,
      deleteMemberIndex
    } = this.state;
    if (alertType === 2) {
      let arrayOld = sessionData.members;
      arrayOld.splice(deleteMemberIndex, 1);
      this.setState((preState)=>({
        sessionData :{...preState.sessionData, members: arrayOld}
      }));
    }else if (alertType === 1) {
      Actions.pop();
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
  onConfirmPress(){
    const {
      sessionStartDate,
      sessionEndDate,
      location,
      sessionData
    } =this.state;
    let currentDateTime = moment().format(DATE_FORMAT.DDMMMYYYYhmmssA);
    let isError = false;
    if (!_.has(sessionData, 'topic')) {
      showErrorMessage(stringsConvertor('validationMessage.topicRequired'));
      return;
    }
    if(moment(sessionStartDate, DATE_FORMAT.DDMMMYYYYhmmssA) < moment(currentDateTime, DATE_FORMAT.DDMMMYYYYhmmssA)){
      this.setState({ isStartDateError: true, startDateError: stringsConvertor('validationMessage.startDateCurrentDateRequired') });
      isError = true;
    }
    if(sessionEndDate === ''){
      this.setState({ isEndDateError: true, endDateError: stringsConvertor('validationMessage.endDateIsRequired') });
      isError = true;
    }
    if(moment(sessionStartDate, DATE_FORMAT.DDMMMYYYYhmmssA) > moment(sessionEndDate, DATE_FORMAT.DDMMMYYYYhmmssA)){
      this.setState({isEndDateError:true,endDateError: stringsConvertor('validationMessage.endDateGreaterThanStartDate')});
      isError = true;
    }
    if(location === ''){
      this.setState({locationError: stringsConvertor('validationMessage.locationRequired'),isLocationError:true});
      isError = true;
    }
    if (isError === true) {
      return;
    }
    const url = URL.SESSION_CREATE;
    let date = new Date();
    const data = {
      address: location,
      sessionEndDate:convertDateToUTC(moment(sessionEndDate.toString(), DATE_FORMAT.DDMMMYYYYhmmssA)),
      sessionStartDate: convertDateToUTC(moment(sessionStartDate.toString(), DATE_FORMAT.DDMMMYYYYhmmssA)),
      topicId: sessionData.topic.topic.id,
      members: sessionData.members,
      sessionName: sessionData.topic.topic.name,
      sessionDescription: sessionData.topic.topic.description,
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
      if (!isHaveTrainer) {
        showErrorMessage(stringsConvertor('validationMessage.memberTrainerRequired'));
        return;
      }
      this.setState({isLoading:true});
      this.invokeSessionCreateApi(url, data, (status, response)=>{
        myLog('invokeSessionCreateApi::::::', status, response);
        if (status === true) {
          showSuccessMessage(stringsConvertor('alertMessage.sessionCreated'));
          Actions.pop();
        }else{
          showErrorMessage(response);
        }
        this.setState({isLoading:false});
      });
    });
  }

  invokeSessionCreateApi(url, data, onCallback){
    const {
      sessionCreate
    } = this.props;
    const {
      sessionData
    } = this.state;
    sessionCreate(url, data,sessionData, onCallback);
  }
  onAddMemberSavePress(item, onCallback){
    const {
      sessionData,
      memberEditIndex
    } = this.state;
    const members = _.has(sessionData, 'members') ? sessionData.members : [];
    let data = sessionData;
    data.members = members;
    if (memberEditIndex === -1) {
      data.members.push(item);
    }else{
      data.members[memberEditIndex] = item;
    }
    myLog(':::::::ADD MEMBER', sessionData, item, data);
    this.setState(()=>({
      sessionData : data,
      addMemberModalVisible: false,
      memberEditIndex: -1
    }),()=>onCallback());
  }
  onAddTopicSavePress(){
    const topic  = _.has(this.state.sessionData,'topic') ? this.state.sessionData.topic : {};
    const topicObject  = _.has(this.state,'topicObject') ? this.state.topicObject : {};
    this.setState((preState)=>({
      sessionData :{...preState.sessionData, topic: preState.topicObject},
      addTopicModalVisible: false
    }),()=>{
      if (topic.length !== 0) {
        const oldProgramId = _.has(topic.program, 'id') ? topic.program.id : -1;
        const currentProgramId = _.has(topicObject.program, 'id') ? topicObject.program.id : 0;
        myLog(':::onAddTopicSavePress::::', oldProgramId, currentProgramId);
        if (oldProgramId !== currentProgramId) {
          this.setState((preState)=>({
            sessionData :{...preState.sessionData, members: []}
          }));
        }
      }
    });
  }
  onChangeStartDateObject(date){
    this.setState({sessionStartDate:date, isStartDateError:false,startDateError:''});
  }
  onChangeEndDateObject(date){
    this.setState({sessionEndDate:date, isEndDateError:false,endDateError:''});
  }
  onChangeStartTimeObject(Time){
    this.setState({sessionStartTime:Time, isStartTimeError:false,startTimeError:''});
  }
  onChangeEndTimeObject(Time){
    this.setState({sessionEndTime:Time, isEndTimeError:false, endTimeError:''});
  }
  onChangeTextLocation(text) {
    this.setState({location: text,locationError:'',isLocationError:false});
  }
  onAddTopicPress(){
    // this.setState({topicObject:{}});
    navigateToScreen('QrCodeScannerScreen', {title: stringsConvertor('alert.scanning'), type:'topic', onSuccess:(status, response)=>{
      this.setState({
        topicObject : response,
        addTopicModalVisible: true
      });
    }});
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
  onReadPress(){
    this.setState((prevState) =>{
      return{
        isReadMore:!prevState.isReadMore
      };
    });
  }
  renderFormItem({title, value, type, id,placeholder,isError,error, minDate}, callback){
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
            <CustomIcon name="calender-icon" size={18}/></Ripple>}
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
      <View style = {{paddingVertical: verticalScale(12),paddingHorizontal:verticalScale(25)}}>
        <Text style = {[TEXT_TYPE.H3,{color:COLORS.sessionLocationTextColor}]}>
          {title}
        </Text>
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
          {renderInput}
        </View>
        {
          isError ?
            <Text style={{color:COLORS.red,fontSize:verticalScale(11)}}>{error}</Text>
            : null
        }
      </View>
    );
  }

  renderStartDate(){
    const{
      sessionStartDate,
      isStartDateError,
      startDateError
    }=this.state;
    const startDateObject = {
      title : stringsConvertor('session.created.startDateAndTime'),
      value : sessionStartDate,
      type: 'datetime',
      id : 'startDateDropdown',
      ref: (refs)=>{this.sessionStartDate=refs;},
      minDate: new Date(),
      isError:isStartDateError,
      error:startDateError
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
      title : stringsConvertor('session.created.endDateAndTime'),
      placeholder: stringsConvertor('session.created.endDateAndTime'),
      value : sessionEndDate,
      type: 'datetime',
      id : 'endDateDropdown',
      ref: (refs)=>{this.sessionEndDate=refs;},
      minDate: new Date(),
      isError:isEndDateError,
      error:endDateError
    };
    return this.renderFormItem(endDateObject, this.onChangeEndDateObject);
  }
  renderAddress(){
    const {location,isLocationError,locationError} = this.state;
    return(
      <View style = {{paddingHorizontal: verticalScale(25)}}>
        <Text style = {[TEXT_TYPE.H3,{color:COLORS.sessionLocationTextColor, marginBottom: Platform.OS=== 'ios'? verticalScale(12): 0}]}>
          {stringsConvertor('session.created.location')}
        </Text>
        <TextInput
          placeholder= {stringsConvertor('session.created.enterTheLocation')}
          style={[TEXT_TYPE.H3]}
          textColor ={COLORS.shadowColor}
          placeholderTextColor={COLORS.gray}
          value={location}
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
  renderBottomButton(isLoading){
    return(
      <View style={styles.bottomStyle}>
        <View style={{marginRight: verticalScale(15)}}>
          <Button
            name = {stringsConvertor('alert.cancelCaps')}
            containerStyle = {{borderColor:COLORS.cancelButtonText,paddingVertical:verticalScale(14),paddingHorizontal:horizontalScale(20)}}
            textStyle= {[styles.bottomButtonText,TEXT_TYPE.H2,{color: COLORS.cancelButtonText}]}
            isGradient={false}
            onPress={this.onCancelPress}
          />
        </View>
        <Button
          name = {stringsConvertor('alert.confirmCaps')}
          containerStyle = {{paddingVertical:verticalScale(14), paddingHorizontal: isLoading ? verticalScale(63):horizontalScale(20)}}
          textStyle= {[styles.bottomButtonText,TEXT_TYPE.H2]}
          onPress={this.onConfirmPress}
          isLoading={isLoading}
        />
      </View>
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
          this.setState({ addTopicModalVisible: false });
        }}
        onSavePress={this.onAddTopicSavePress}
      />
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
          style={styles.profileImage}
        />
      );
    }
    return (
      <Image
        source={require('../../../assets/Images/profile.png')}
        style={styles.profileImage}
      />
    );
  }

  renderAddTopicView(isTopicAdded){
    return(
      <View style={[styles.addButtonView, {backgroundColor: isTopicAdded ? COLORS.white:COLORS.addTopicViewBackground}]}>
        {
          isTopicAdded ? null :
            <ButtonWithIcon
              containerStyle ={[styles.addButton,styles.shadow1,{backgroundColor:COLORS.addTopicButton, marginHorizontal:verticalScale(15)}]}
              textStyle={styles.addButtonText1}
              iconSize={15}
              iconColor={'white'}
              iconName="plus"
              name={stringsConvertor('alert.addTopic')}
              onPress={this.onAddTopicPress}
            />
        }
        <View pointerEvents = {!isTopicAdded ? 'none':null}>
          <ButtonWithIcon
            containerStyle ={[styles.addButton,styles.shadow1,{backgroundColor: isTopicAdded ? '#b9524a': '#89b6d7', marginHorizontal:verticalScale(8)}]}
            textStyle={styles.addButtonText}
            iconSize={15}
            iconColor={'white'}
            iconName="plus"
            name={stringsConvertor('alert.addMember')}
            onPress={this.onAddMemberPress}
          />
        </View>
      </View>
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
      default:
        path = '';
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

  renderFileItem(item, index){
    const {
      sessionData
    }= this.state;
    const {
      isNetworkConnected
    } = this.props;
    return (
      <FileItem item={item} index={index} sessionData={{...sessionData, topicInfo:sessionData.topic}}
        isNetwork= {isNetworkConnected}
      />);
  }
  renderEntityView(data){
    const entityName = _.has(data.program, 'entityName') ? data.program.entityName : '';
    return(
      <View style={styles.topicContainer}>
        <View style={{padding: 10, paddingHorizontal: 15}}>
          <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
            <Text style={[TEXT_TYPE.H2,{fontWeight: '800', paddingBottom: 10, color:COLORS.black}]}>{stringsConvertor('session.entity')}</Text>
          </View>
          <Text style={[TEXT_TYPE.H2,{color:COLORS.black}]}>{entityName}</Text>
        </View>
      </View>
    );
  }
  renderProgramView(data){
    const name = _.has(data.program, 'name') ? data.program.name : '';
    return(
      <View style={styles.topicContainer}>
        <View style={{padding: 10, paddingHorizontal: 15}}>
          <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
            <Text style={[TEXT_TYPE.H2,{fontWeight: '800', paddingBottom: 10, color:COLORS.black}]}>{stringsConvertor('session.program')}</Text>
          </View>
          <Text style={[TEXT_TYPE.H2,{color:COLORS.black}]}>{name}</Text>
        </View>
      </View>
    );
  }
  renderTopicCardView(data){
    myLog('::::topic:::;', data);
    const name = _.has(data.topic, 'name') ? data.topic.name : '';
    const description = _.has(data.topic, 'description') ? data.topic.description : '';
    const content = _.has(data, 'content') ? data.content : [];
    const {
      showFile,
      isReadMore
    } = this.state;

    isVideoIcon = false;
    isImageIcon = false;
    isPdfIcon = false;
    const descLength = getNumberOfLines(description,1/2);
    return(
      <View style={styles.topicContainer}>
        <View style={{padding: 10, paddingHorizontal: 15}}>
          <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
            <Text style={[TEXT_TYPE.H2,{fontWeight: '800', paddingBottom: 10, color:COLORS.black}]}>{stringsConvertor('session.topicHead')}</Text>
            <ButtonWithIcon
              onPress={this.onAddTopicPress}
              name={stringsConvertor('session.editSmall')}
              textStyle={[TEXT_TYPE.H1,{color:COLORS.sessionButton}]}
            />
          </View>
          <Text style={[TEXT_TYPE.H2,{color:COLORS.black}]}>{name}</Text>
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
          <View style={{ flexDirection: 'row',paddingVertical: 5, alignItems:'center' }}>
            { _.map(content,(item)=>{
              return this.renderIcon(item.contentType);
            })}
          </View>
          <View>
            <ButtonWithIcon
              iconSize={verticalScale(15)}
              iconName={showFile ? 'arrow-down-icon' :'arrow-up'}
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
                {_.map(content,this.renderFileItem)}
              </View>
            </View>
            :null
        }
      </View>
    );
  }

  renderMemberItem(item, index){
    return(
      <MemberInfoItem
        item={item}
        index={index}
        type="sessionCreate"
        onEditPress={()=>this.onEditMemberPress(item, index)}
        onDeletePress={()=>{this.onDeleteMemberPress(index);}}
      />
    );
  }
  renderMemberView(members){
    return _.map(members,(item, index)=>this.renderMemberItem(item, index));
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
        confirmName={stringsConvertor(alertType === 1 ? 'alert.ok' : alertType === 2 ? 'alert.remove' : 'alert.delete')}
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
  render() {
    const {
      userData
    } = this.props;
    const {
      sessionData,
      isLoading
    } = this.state;
    const isTopicAdded = _.has(sessionData, 'topic') ? true : false;
    const topic = _.has(sessionData, 'topic') ? sessionData.topic : {};
    const members = _.has(sessionData, 'members') ? sessionData.members : [];
    return (
      <View style={{flex:1, backgroundColor:COLORS.sessionBackground}} pointerEvents = {isLoading ? 'none': null}>
        <Toolbar isBack={true} title= {stringsConvertor('screenTitle.session')}
          rightRender={
            <NotificationBell color={COLORS.white} />
          }
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[styles.shadow1,styles.profileView]}>
            {this.renderProfile(userData.photo)}
            <View style={{flex:1,paddingHorizontal:verticalScale(15),justifyContent:'center'}}>
              <Text style={[TEXT_TYPE.H3,{color:COLORS.shadowColor}]} numberOfLines={2}>{userData.name}</Text>
              <Text style={[TEXT_TYPE.H1,{color:COLORS.sessionLocationTextColor, paddingVertical:verticalScale(3)}]}>{stringsConvertor('session.sessionCreator')}</Text>
            </View>
          </View>
          {(isTopicAdded  && topic.length !== 0) ? this.renderEntityView(topic) : null}
          {(isTopicAdded  && topic.length !== 0) ? this.renderProgramView(topic) : null}
          {(isTopicAdded  && topic.length !== 0) ? this.renderTopicCardView(topic) : null}
          <View>
            {members.length !== 0 ? this.renderMemberView(members) :  null}
            {this.renderAddTopicView(isTopicAdded)}
          </View>
          <KeyboardAwareScrollView>
            <View style ={{paddingTop:verticalScale(15),backgroundColor:COLORS.white}}>
              {this.renderStartDate()}
              {this.renderEndDate()}
              {this.renderAddress()}
              {this.renderBottomButton(isLoading)}
            </View>
          </KeyboardAwareScrollView>
        </ScrollView>
        {this.renderAddTopicModel()}
        {this.renderAddMemberModel()}
        {this.renderAlertModal()}
      </View>
    );
  }
}
