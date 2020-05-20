import React, { PureComponent } from 'react';
import {  View, Text, Modal, SafeAreaView, TextInput, Platform, StyleSheet, ScrollView,Image} from 'react-native';
import { COLORS } from '../../constants/Color';
import { deviceHeight, verticalScale, horizontalScale, FONT_FAMILY} from '../../theme/pdaStyleSheet';
import ButtonWithIcon from './ButtonWithIcon';
import LinearGradient from 'react-native-linear-gradient';
import RoundedButtonWithIcon from './RoundedButtonWithIcon';
import CustomIcon from './CustomIcon';
import Ripple from './rippleEffect';
import { myLog, showSuccessMessage, showErrorMessage, convertDateToUTC, showNoInternetErrorMessage, validateText } from '../../utils/StaticFunctions';
import { stringsConvertor } from '../../utils/I18n';
import moment from 'moment';
import { DATE_FORMAT } from '../../constants/String';
import _ from 'lodash';
import Spinner from 'react-native-spinkit';
import PropTypes from 'prop-types';
import awsConfigStageDoc from '../../assets/awsConfigStageDoc.json';

function elevationShadowStyle(elevation) {
  return {
    elevation,
    shadowColor: 'black',
    shadowOffset: { width: 4, height: 0.4 * elevation },
    shadowOpacity: 0.2,
    shadowRadius: 0.45 * elevation
  };
}
function elevationShadowButtonStyle(elevation) {
  return {
    elevation,
    shadowColor: 'black',
    shadowOffset: { width: 2, height: 0.7 * elevation },
    shadowOpacity: 0.19 * elevation
  };
}
const styles = StyleSheet.create({
  box:{
    borderWidth: 0.5,
    borderColor: 'white',
    backgroundColor:'white',
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
  buttonStyle:{
    width: 66,
    height:66,
    borderRadius:66/2,
    backgroundColor:'#fdc004'
  },
  verifierButtonStyle: {
    borderColor:'#c8c8c9',
    borderWidth:0.5,
    borderRadius: 8,
    justifyContent:'space-between',
    ...elevationShadowStyle(5),
    backgroundColor: 'white'
  },
  verifiertextStyle:{
    fontSize: 13,
    color: '#a7a9ac',
    paddingVertical:9
  },
  ProfileCardShadowElevation: {
    ...elevationShadowStyle(5),
    backgroundColor: 'white'
  },
  NavButtonShadow:{
    ...elevationShadowButtonStyle(5)
  },
  bottomButtomStyle:{
    paddingVertical: verticalScale(7),
    borderRadius:verticalScale(23),
    backgroundColor:'#00b14e',
    paddingHorizontal: horizontalScale(17)
  },
  bottonDocumentStyle:{
    paddingVertical: verticalScale(5),
    borderRadius:verticalScale(23),
    backgroundColor:'#00b14e',
    paddingHorizontal: horizontalScale(5)
  },
  verifierButtonStyleOnShow:{
    justifyContent:'space-between',
    borderColor:'#c8c8c9',
    borderBottomWidth:0.5
  }

});
let timeStamp = new Date();
export default class AddQualificationsAndRole extends PureComponent {
  static propTypes = {
    isNetworkConnected : PropTypes.bool,
    userData: PropTypes.object,
    imageUploadToAWS: PropTypes.func,
    onUploadPhoto: PropTypes.func
  }

  static defaultProps = {
    userData: {},
    isNetworkConnected : false
  }

  constructor(props) {
    super(props);
    this.state = {
      addQualificationsModalVisible: false,
      addRoleModalVisible:false,
      qualificationTextValue:'',
      roleTextValue:'',
      linkedPrograms:[],
      selectedDocuments:[],
      showVerifiers:false,
      selectedPrograms:[],
      selectedItemindex:[],
      isPressedTick:false,
      showDocuments: false,
      validationError:false,
      userQualification:[],
      qualificationEditMode:false,
      qualificationProgramsAdded:[],
      unlinkedPrograms:[],
      qualificationIdToEdit:'',
      isLoading:false,
      addRoleHint:'Add your roles, designations and have them verified by the program you are associated with'
    };
    this.onAddQualificationsPress = this.onAddQualificationsPress.bind(this);
    this.onAddQualificationsCancelPress = this.onAddQualificationsCancelPress.bind(this);
    this.onAddRolePress = this.onAddRolePress.bind(this);
    this.onAddRoleCancelPress = this.onAddRoleCancelPress.bind(this);
    this.onChangeQualificationsText = this.onChangeQualificationsText.bind(this);
    this.onChangeRoleText = this.onChangeRoleText.bind(this);
    this.onUploadDocumentPress = this.onUploadDocumentPress.bind(this);
    this.onUploadPhotoPress =this.onUploadPhotoPress.bind(this);
    this.onVerifiersPress = this.onVerifiersPress.bind(this);
    this.renderCheckBox = this.renderCheckBox.bind(this);
    this.onSelectItem = this.onSelectItem.bind(this);
    this.onAddQualificationsSavePress = this.onAddQualificationsSavePress.bind(this);
    this.renderDocumentView = this.renderDocumentView.bind(this);
    this.rednerQualificationView = this.rednerQualificationView.bind(this);
    this.onEditQualificationsPress =this.onEditQualificationsPress.bind(this);
    this.onUpdateQualificationsSavePress = this.onUpdateQualificationsSavePress.bind(this);
    this.onDeleteQualificationsPress = this.onDeleteQualificationsPress.bind(this);
  }
  componentWillMount(){
    this.invokeToGetUserQualification();
  }
  componentDidMount(){
    const {userData} = this.props.props;
    const qualification = _.has(userData,'qualification') ? userData.qualification : [];
    qualification.map((item)=>{
      userQualification.push(item);
    });
  }
  invokeToGetUserQualification(){
    const{getUserQualification,isNetworkConnected} = this.props.props;
    const{userQualification} =this.state;
    if (!isNetworkConnected) {
      const {userData} = this.props.props;
      const qualification = _.has(userData,'qualification') ? userData.qualification : [];
      qualification.map((item)=>{
        userQualification.push(item);
      });
      return;
    } else{
      this.setState({userQualificationLoading:true},()=>{
        getUserQualification((status,response)=>{
          myLog('===========get user qualification==',status,response);
          response.map((item)=>{
            userQualification.push(item);
          });
          this.setState({userQualificationLoading:false});
        }).catch((err)=>{});
      });
    }
  }
  onAddQualificationsPress(){
    const {getlinkedPrograms,isNetworkConnected} = this.props.props;
    const{linkedPrograms} = this.state;
    if (!isNetworkConnected) {
      showNoInternetErrorMessage();
      return;
    } else{
      getlinkedPrograms((status,response)=>{
        if(status){
          response.map((item)=>{
            linkedPrograms.push(item);
          });
          this.setState({
            addQualificationsModalVisible: true
          });
        }else{
          showErrorMessage('something went wrong or no linked program');
        }
      });
    }
  }
  onAddQualificationsCancelPress(){
    this.setState({
      addQualificationsModalVisible:false,
      qualificationTextValue:'',
      selectedDocuments:[],
      selectedItemindex:[],
      linkedPrograms:[],
      showDocuments:false,
      showVerifiers:false,
      validationError:false,
      qualificationEditMode:false,
      unlinkedPrograms: [],
      qualificationIdToEdit:'',
      qualificationProgramsAdded:[],
      selectedPrograms:[]
    });
  }
  onAddQualificationsSavePress(){
    const dateTime=convertDateToUTC(moment(),DATE_FORMAT.UTC);
    myLog('==========save press===',);
    const {selectedItemindex,selectedPrograms,linkedPrograms,qualificationTextValue,selectedDocuments} = this.state;
    const {addQualification} = this.props.props;
    if(qualificationTextValue ===''|| selectedItemindex.length === 0 || selectedDocuments.length === 0 || !validateText(qualificationTextValue)){
      this.setState({validationError:true,validationErrorMessage:'Please provide all details',qualificationTextValue:''});
    }else {
      selectedItemindex.map((item)=>{
        myLog('===============to check index store item=====',linkedPrograms[item]);
        let programData={ 'verifierId':linkedPrograms[item].programId,'verifierName':linkedPrograms[item].programName,'requestedDate':dateTime };
        selectedPrograms.push(programData);
        myLog('===============to check index store item=2====',selectedPrograms);
      });
      const data = {
        qualificationPrograms:selectedPrograms,
        qualificationTitle:qualificationTextValue,
        documents:selectedDocuments
      };
      addQualification(data,(status,response)=>{
        if(status){
          myLog('============after callback=======',status,response);
          this.setState({
            addQualificationsModalVisible:false,
            selectedDocuments:[],
            qualificationTextValue:'',
            selectedItemindex:[],
            linkedPrograms:[],
            showDocuments:false,
            showVerifiers:false,
            unlinkedPrograms:[],
            userQualification:[],
            selectedPrograms:[],
            validationError:false
          });
          this.invokeToGetUserQualification();
          showSuccessMessage('Qualification added successfully');
        }
      });
    }
  }
  onUpdateQualificationsSavePress(){
    const dateTime=convertDateToUTC(moment(),DATE_FORMAT.UTC);
    myLog('==========save press===',);
    const {selectedItemindex,selectedPrograms,qualificationIdToEdit,unlinkedPrograms} = this.state;
    const {userQualificationUpdate} = this.props.props;
    selectedItemindex.map((item)=>{
      let programData={ 'verifierId':unlinkedPrograms[item].programId,'verifierName':unlinkedPrograms[item].programName,'requestedDate':dateTime };
      selectedPrograms.push(programData);
      myLog('===============to check index store item=2====',selectedPrograms);
    });
    if(selectedPrograms.length === 0){
      this.setState({validationError:true,validationErrorMessage:'Please select at least one verifier'});
    }else{
      const updateData = {
        qualificationPrograms:selectedPrograms,
        id:qualificationIdToEdit
      };
      userQualificationUpdate(updateData,(status,response)=>{
        myLog('============after callback on update=======',status,response);
        if(status){
          this.setState({addQualificationsModalVisible:false,
            selectedDocuments:[],
            qualificationTextValue:'',
            selectedItemindex:[],
            linkedPrograms:[],
            showDocuments:false,
            showVerifiers:false,
            unlinkedPrograms:[],
            qualificationProgramsAdded:[],
            userQualification:[],
            selectedPrograms:[],
            qualificationEditMode:false,
            validationError:false
          });
          this.invokeToGetUserQualification();
          showSuccessMessage('Qualification added successfully');
        }
      });
    }
  }
  onDeleteQualificationsPress(){
    const{qualificationIdToEdit,qualificationTextValue} = this.state;
    const{deleteUserQualification}=this.props.props;
    deleteUserQualification(qualificationIdToEdit,qualificationTextValue,(status)=>{
      if(status){
        this.setState({addQualificationsModalVisible:false,
          selectedDocuments:[],
          qualificationTextValue:'',
          selectedItemindex:[],
          linkedPrograms:[],
          showDocuments:false,
          showVerifiers:false,
          unlinkedPrograms:[],
          qualificationProgramsAdded:[],
          userQualification:[],
          qualificationEditMode:false,
          selectedPrograms:[],
          validationError:false
        });
        this.invokeToGetUserQualification();
        showSuccessMessage('Qualification deleted successfully');
      } else{
        this.setState({addQualificationsModalVisible:false,
          selectedDocuments:[],
          qualificationTextValue:'',
          selectedItemindex:[],
          linkedPrograms:[],
          showDocuments:false,
          showVerifiers:false,
          unlinkedPrograms:[],
          qualificationProgramsAdded:[],
          selectedPrograms:[],
          validationError:false
        });
        showSuccessMessage('Something went wrong');
      }
    });
  }
  onAddRolePress(){
    this.setState({
      // addRoleModalVisible: true
      addRoleHint:'Add your roles, designations feature will be available very soon...'
    });
    setTimeout(()=>{
      this.setState({addRoleHint:'Add your roles, designations and have them verified by the program you are associated with'})
    },4000);
  }
  onAddRoleCancelPress(){
    this.setState({addRoleModalVisible:false,roleTextValue:''});
  }
  onChangeQualificationsText(text){
    if(text !== ' '){
      this.setState({qualificationTextValue:text,validationError:false});
    }
  }
  onChangeRoleText(text){
    this.setState({roleTextValue:text});
  }
  invokeUpload(option){
    const {onUploadPhoto,userData,documentUploadToAWS} = this.props.props;
    const{selectedDocuments} =this.state;
    myLog('===================try to upload document',this.props);
    onUploadPhoto(option, (status, response)=>{
      myLog('---------', status, response);
      if (status) {
        timeStamp = new Date();
        this.setState({
          photoPath: response.path,
          photoObject: response
        });
        const fileExtension  = response.path.split('.')[1];
        const uniqPath = response.path.split('/')[7].split('.')[0];
        myLog('=======================split===============',uniqPath,uniqPath.split('.')[0]);
        const file = {
          type: response.mime,
          name: `--._.--${uniqPath}.${fileExtension}`,
          uri: response.path
        };

        this.setState({isLoading: true,showDocuments:false,validationError:false},()=>{
          documentUploadToAWS(file, (status, response)=>{
            myLog('documentUploadToAWS ', status, response);
            if(status) {
              showSuccessMessage('Document uploaded successfully');
              const s3urlPrefix = response.location.split('--._.--')[1];
              const doc = `${awsConfigStageDoc.UrlAwsPrefix}${awsConfigStageDoc.keyPrefix}--._.--${s3urlPrefix}`;
              selectedDocuments.push(doc);
              this.setState({showDocuments:true,isLoading:false});
              myLog('==============see document============',doc,selectedDocuments,response.location,response.location.split('--._.--'));
            }else{
              showErrorMessage('Failed to upload document');
              this.setState({isLoading: false,showDocuments:true});
            }
          });
        });
      }else {
        showErrorMessage(response);
      }
    });
  }
  onUploadDocumentPress(){
    this.invokeUpload(1);
  }
  onUploadPhotoPress(){
    this.invokeUpload(0);
  }
  onVerifiersPress(){
    this.setState((preState)=>{
      return {
        showVerifiers : !preState.showVerifiers,
        validationError:false
      };
    });
  }
  onSelectItem(item){
    myLog('============on select=======',item);
  }
  onEditQualificationsPress(item){
    const{qualificationTitle,documents,qualificationPrograms,qualificationId} = item;
    const {getlinkedPrograms} = this.props.props;
    myLog('============onEdit=============see',item);
    const{selectedDocuments,qualificationProgramsAdded,linkedPrograms,unlinkedPrograms} =this.state;
    documents.map((doc)=>{
      selectedDocuments.push(doc);
    });
    qualificationPrograms.map((verifier)=>{
      qualificationProgramsAdded.push(verifier);
    });
    getlinkedPrograms((status,response)=>{
      if(status){
        response.map((item)=>{
          linkedPrograms.push(item);
        });
        this.setState({
          qualificationTextValue:qualificationTitle,
          addQualificationsModalVisible: true,
          qualificationEditMode:true,
          qualificationIdToEdit:qualificationId
        });
        myLog('=============on edit========linked program and program added======',linkedPrograms,qualificationProgramsAdded);
        setTimeout(()=>{
          linkedPrograms.map((item)=>{
            let flag =true;
            qualificationProgramsAdded.map((programAdded)=>{
              if(item.programId === programAdded.verifierId){
                flag = false;
              }
            });
            if(flag === true){
              unlinkedPrograms.push(item);
            }
          });
        },1000);
      }else{
        showErrorMessage('something went wrong or no linked program');
      }
    });
  }
  renderVerifierSelectorView(){
    const{showVerifiers,linkedPrograms,unlinkedPrograms,qualificationEditMode} =this.state;
    let VerifierList = [];
    if(qualificationEditMode === true){
      VerifierList = unlinkedPrograms;
    } else{
      VerifierList = linkedPrograms;
    }
    myLog('===========to see linked and unlinked program======',linkedPrograms,unlinkedPrograms);
    return(
      <View style={{marginLeft: 7, marginTop: 10}}>
        <Text style={{fontWeight: '700',color:COLORS.modalText, fontSize:12,letterSpacing:0.09}}>VERIFIER</Text>
        <Text style={{color :COLORS.saveButtonColor, fontSize:10, fontWeight:'500', paddingTop:14}}>Select who will verify your qualification here</Text>
        <View style={showVerifiers ? [styles.verifierButtonStyle] : ''}>
          <ButtonWithIcon
            name ={'+ Verifier'}
            iconName ={showVerifiers ? 'arrow-down-head':'arrow-down-head'}
            iconPosition ={'right'}
            iconSize = {11}
            containerStyle ={showVerifiers ? [styles.verifierButtonStyleOnShow] :[styles.verifierButtonStyle]}
            textStyle ={showVerifiers ? '': [styles.verifiertextStyle]}
            onPress={this.onVerifiersPress}
          />
          {showVerifiers ?
            <ScrollView contentContainerStyle={{flexGrow:1}}
              style ={{height:VerifierList.length >= 4 ? verticalScale(120):VerifierList.length >=3?verticalScale(100):
                VerifierList.length >=2 ? verticalScale(75) :verticalScale(50)}}
              nestedScrollEnabled
            >
              <View style={{marginLeft:verticalScale(10),marginVertical:verticalScale(5)}}>
                {VerifierList.map(this.renderCheckBox)}
                {showVerifiers && VerifierList.length === 0 ? <Text>No program available to add</Text>:null}
              </View>
            </ScrollView>
            :
            null
          }
        </View>
      </View>
    );
  }
  renderBottomButtons(){
    const{validationError,qualificationEditMode,validationErrorMessage} = this.state;
    return(
      <View>
        {validationError ?
          <Text style ={{color:'red',marginTop:verticalScale(10),fontSize:14}}>{validationErrorMessage}</Text> :null
        }
        <View style={{display:'flex', justifyContent:'flex-end', flexDirection:'row',marginTop: validationError ? verticalScale(5) :verticalScale(30)}}>
          <View style={{marginRight:22}}>
            <ButtonWithIcon
              iconName="close"
              iconSize ={15}
              iconColor={COLORS.white}
              containerStyle={[styles.bottomButtomStyle,{backgroundColor:'red'}]}
              onPress={this.onAddQualificationsCancelPress}
            />
          </View>
          <View>
            <ButtonWithIcon
              iconName="check-mark"
              iconSize ={16}
              iconColor={COLORS.white}
              containerStyle={styles.bottomButtomStyle}
              onPress={qualificationEditMode ? this.onUpdateQualificationsSavePress : this.onAddQualificationsSavePress}
            />
          </View>
        </View>
      </View>

    );
  }
  renderCheckBox(item,index){
    const {selectedPrograms,selectedItemindex,isPressedTick} =this.state;
    myLog('===========item==in checkbox=====',item,index,selectedPrograms,selectedItemindex);
    return(
      <View style={{flexDirection:'row'}}>
        <View style={{flex:verticalScale(.98), justifyContent:'center'}}>
          <Text style={{}}numberOfLines={1}>{item.programName}</Text>
        </View>
        <View style={{marginLeft:verticalScale(10)}}>
          <ButtonWithIcon
            iconSize={18}
            containerStyle={{paddingVertical:0,paddingHorizontal:0, backgroundColor:'#ffedec',marginRight: 10}}
            iconColor={'#f9756b'}
            iconName={selectedItemindex.includes(index) ? 'check-box-selected' : 'check-box-empty'}
            onPress={()=>{
              myLog('================sssssssssssssjhjk============',item);
              selectedItemindex.includes(index) ? selectedItemindex.splice(selectedItemindex.indexOf(index),1) : selectedItemindex.push(index);
              myLog('================sssssssssssssjhjk============',selectedItemindex);
              this.setState((preState)=>{
                return {
                  isPressedTick : !preState.isPressedTick,
                  validationError:false
                };
              });
            }}
            isLight={true}
          />
        </View>
      </View>
    );
  }
  renderDocumentView(item,index){
    myLog('===========render document view=========',item,index,item.indexOf('!-!-'));
    const {selectedDocuments,qualificationEditMode} = this.state;
    return(
      <View style = {{flexDirection:'row'}}>
        <View style={{flex:.85,flexDirection:'row', alignItems:'center'}}>
          <CustomIcon
            name= {'pdf-icon'}
            color ={'red'}
            size={verticalScale(28)}
          />
          <Text style={{marginLeft:verticalScale(10),fontSize:verticalScale(16),color:'#666666'}}
            numberOfLines={1}
          >{item.split('--._.--')[1]}</Text>
        </View>
        {qualificationEditMode ? null:
          <View style={{flex:.3, alignItems:'flex-end',paddingRight:verticalScale(5)}}>
            <ButtonWithIcon
              iconName="close"
              iconSize ={10}
              iconColor={COLORS.white}
              containerStyle={[styles.bottonDocumentStyle,{backgroundColor:'red'}]}
              onPress={()=>{this.setState({showDocuments:false},()=>{
                selectedDocuments.splice(index,1);
              }); this.setState({showDocuments:true});}}
            />
          </View>
        }
      </View>
    );
  }
  rednerAddQualificationView(){
    const{userData} =this.props.props;
    const baseLocation = _.has(userData, 'baseLocation') ? userData.baseLocation : false;
    return(
      <View style={{ paddingLeft:19}}>
        <View style={{flexDirection:'row',marginBottom:verticalScale(15)}}>
          <View style={{flex: 0.25}}>
            <ButtonWithIcon
              iconName="plus"
              iconSize ={10}
              name={'Add'}
              iconColor={COLORS.white}
              containerStyle={styles.AddButtonStyle}
              textStyle ={styles.AddButtonTextStyle}
              disabledRipple = {!baseLocation}
              onPress = {baseLocation ?this.onAddQualificationsPress:''}
            />
          </View>
          <View style={{flex: 0.75,alignItems:'center',justifyContent:'center',color:'#1a1a1a'}}>
            <Text style={{ fontSize:10,lineHeight:14}}>Add your qualifications, certifications and accreditations and have them verified by any program you are associated with  </Text>
          </View>
        </View>
      </View>
    );
  }
  renderVerifiedView(item,index){
    myLog('============verified by====',item,index,this.state);
    const{verifierName,status} = item;
    let source = require('../../assets/Images/approved.png');
    switch(status){
      case 'APPROVED':
        source = require('../../assets/Images/approved.png');
        break;
      case 'PENDING':
        source = require('../../assets/Images/pending.png');
        break;
      case 'REJECTED':
        source = require('../../assets/Images/rejected.png');
        break;
      default:
        break;
    }
    return(
      <View style={{borderBottomWidth:0.9,borderBottomColor:'#fee9e7'}}>
        <View style={{display:'flex', flexDirection:'row', paddingVertical: 10}}>
          <Text style={{paddingLeft:19, flex: 0.30,color :'#808080',fontSize:14}}>Verified by:</Text>
          <Text style={{fontSize:15, flex: 0.65,color:'#1a1a1a',fontFamily:FONT_FAMILY.NORMAL}} numberOfLines={1}>{verifierName}</Text>
          <Image
            source = {source}
            style={{height:verticalScale(25),width:verticalScale(25)}}
          />
        </View>
      </View>
    );
  }
  renderVerifiedEditView(item,index){
    myLog('============verified by====',item,index,this.state);
    const{verifierName,status,reason} = item;
    let source = require('../../assets/Images/approved.png');
    switch(status){
      case 'APPROVED':
        source = require('../../assets/Images/approved.png');
        break;
      case 'PENDING':
        source = require('../../assets/Images/pending.png');
        break;
      case 'REJECTED':
        source = require('../../assets/Images/rejected.png');
        break;
      default:
        break;
    }
    return(
      <View style={{borderBottomWidth:status === 'REJECTED' ? 0 :0.5,borderBottomColor:'#94908f'}}>
        <View style={{display:'flex', flexDirection:'row', paddingVertical:verticalScale(5),marginRight:verticalScale(10)}}>
          <Text style={{fontSize:15, flex:1,color:'#1a1a1a',fontFamily:FONT_FAMILY.NORMAL}} numberOfLines={1}>{verifierName}</Text>
          <View style={{flex:.2,flexDirection:'row', justifyContent:'flex-end'}}>
            <Image
              source = {source}
              style={{height:verticalScale(25),width:verticalScale(25)}}
            />
          </View>
        </View>
        {status === 'REJECTED' ? <Text style={{marginTop:verticalScale(-12),color:'#ff0000',marginRight:verticalScale(35)}} numberOfLines={1} >{reason}</Text> : null}
      </View>
    );
  }
  rednerQualificationView(item,index){
    const{qualificationTitle,qualificationPrograms} = item;
    const {isNetworkConnected} = this.props.props;
    myLog('===========render q view',item,index,this.state);
    return(
      <View>
        <View style={{borderBottomWidth:0.9,borderBottomColor:'#fee9e7'}}>
          <View style={{display:'flex', flexDirection:'row', paddingVertical: 10, paddingTop:15}}>
            <Text style={{paddingLeft:19, flex: 0.30, color :'#808080',fontSize:16}}>Title:</Text>
            <Text style={{fontSize:15, flex: 0.65,color:'#1a1a1a',fontFamily:FONT_FAMILY.NORMAL}}numberOfLines={1}>{qualificationTitle}</Text>
            <Ripple onPress={()=>this.onEditQualificationsPress(item)} disabled={!isNetworkConnected}>
              <Text style={{color: COLORS.saveButtonColor , fontSize: 11, fontWeight:'500'}}>EDIT</Text>
            </Ripple>

          </View>
        </View>
        {qualificationPrograms.map(this.renderVerifiedView)}
      </View>
    );
  }
  renderQualificationAndRoleView(){
    myLog('==============render qualification========',this.state);
    myLog('=============to see props========',this.props);
    const{userData} =this.props.props;
    const baseLocation = _.has(userData, 'baseLocation') ? userData.baseLocation : false;
    const{userQualification,addRoleHint} = this.state;
    return(
      <LinearGradient colors={[COLORS.password, COLORS.gradient]} start={{ x: 0, y: 2 }} end={{ x: 1, y: 0 }}
        locations={[0,1]}
      >
        <Text style={{fontSize:11, paddingTop:22, marginLeft:20,paddingBottom:4, color:'white',letterSpacing:-0.28}}>Any information included on Qualifications and Roles will be public</Text>
        <View style={[styles.box,styles.ProfileCardShadowElevation,{paddingTop:17}]}>
          <Text style={{fontSize:13, fontWeight:'700',lineHeight:16,color:'#4d4d4d',paddingBottom: 3, paddingLeft:19}}>QUALIFICATIONS</Text>
          {userQualification.map(this.rednerQualificationView)}
          {
            userQualification.length === 0 ?
              <View>{this.rednerAddQualificationView()}</View>:
              <View style={{marginLeft:19, marginVertical: 16, width: 85}}>
                <ButtonWithIcon
                  iconName="plus"
                  iconSize ={10}
                  name={'Add'}
                  iconColor={COLORS.white}
                  containerStyle={styles.AddButtonStyle}
                  textStyle ={styles.AddButtonTextStyle}
                  disabledRipple = {!baseLocation}
                  onPress = {baseLocation ? this.onAddQualificationsPress :''}
                />
              </View>
          }
        </View>
        <View style={[styles.box,styles.ProfileCardShadowElevation,{padding:19,paddingTop:17}]}>
          <Text style={{fontSize:13, fontWeight:'700',lineHeight:16,color:'#4d4d4d', paddingBottom: 3}}>ROLE</Text>
          <View style={{flexDirection:'row'}}>
            <View style={{flex: 0.25}}>
              <ButtonWithIcon
                iconName="plus"
                iconSize ={10}
                name={'Add'}
                iconColor={COLORS.white}
                containerStyle={styles.AddButtonStyle}
                textStyle ={styles.AddButtonTextStyle}
                onPress = {this.onAddRolePress}
              />
            </View>
            <View style={{flex: 0.75,alignItems:'center',justifyContent:'center',color:'#1a1a1a'}}>
              <Text style={{ fontSize:10,lineHeight:14}}>{addRoleHint}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    );

  }
  renderAddQualificationModal(){
    const {
      addQualificationsModalVisible,
      qualificationTextValue,
      selectedDocuments,
      qualificationEditMode,
      qualificationProgramsAdded,
      isLoading
    } = this.state;
    return(
      <Modal
        animationType="slide"
        transparent={true}
        visible={addQualificationsModalVisible}
        style={{paddingHorizontal:10}}
      >
        <SafeAreaView style={{height: deviceHeight, backgroundColor:COLORS.modalBackground}}>
          <View style={{backgroundColor:COLORS.white, padding: 10,paddingTop: Platform.OS === 'ios'? 35 : 40}}>
            <View style={{position:'absolute', right: 5, top: 5, zIndex:10}}>
              <ButtonWithIcon
                iconSize={verticalScale(20)}
                iconName="close"
                isLight={true}
                iconColor={COLORS.timesIconColor}
                onPress={this.onAddQualificationsCancelPress}
              />
            </View>
            <ScrollView style={{height:verticalScale(440)}}contentContainerStyle={{flexGrow:1}}>
              <View style={{backgroundColor: '#f0f0f0', borderRadius:8,paddingVertical:9, paddingHorizontal:7,marginTop:5}}>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                  <Text style={{fontWeight: '700',color:COLORS.modalText, fontSize:12,letterSpacing:0.09}}>QUALIFICATIONS</Text>
                  {qualificationEditMode ? <Ripple onPress={()=>this.onDeleteQualificationsPress()}>
                    <Text style={{color: COLORS.saveButtonColor , fontSize: 11, fontWeight:'500',marginRight:verticalScale(5)}}>DELETE</Text>
                  </Ripple>:null}
                </View>
                <View style={{paddingTop: 8}} >
                  <TextInput
                    placeholder ={'Add your professional qualification here '}
                    fontSize ={qualificationEditMode ? verticalScale(15):verticalScale(12)}
                    value ={qualificationTextValue}
                    onChangeText = {this.onChangeQualificationsText}
                    style={{marginLeft:verticalScale(-2)}}
                    editable={!qualificationEditMode}
                  />
                  {selectedDocuments.map(this.renderDocumentView)}
                  {isLoading ?
                    <View style={{alignSelf:'center'}}>
                      <Spinner
                        color={COLORS.primaryColor}
                        type="Wave"
                        size={25}
                      />
                    </View>:null}
                  {qualificationEditMode ? <Text style={{color :'#b9524a',fontSize:14,marginTop:verticalScale(10)}}>Verified by</Text> :null}
                  {
                    qualificationEditMode ? <View style={{marginTop:verticalScale(8)}}>{qualificationProgramsAdded.map(this.renderVerifiedEditView)}</View> :
                      <View>
                        <View style={{borderBottomWidth:0.5, borderBottomColor:'#d4d4d4', paddingTop:5}}/>
                        <View style={{paddingVertical: 17}}>
                          <Text style={{color :COLORS.saveButtonColor, fontSize:10, fontWeight:'500'}}>Upload Qualification document here</Text>
                        </View>
                        <View style={{display:'flex', flexDirection:'row', justifyContent:'space-around', marginHorizontal:81, marginBottom:23}}>
                          <View>
                            <RoundedButtonWithIcon
                              iconName= {'paper-clip'}
                              iconColor ={'white'}
                              iconSize ={33}
                              containerStyle = {[styles.buttonStyle]}
                              onPress = {this.onUploadDocumentPress}
                            />
                          </View>
                          <View>
                            <RoundedButtonWithIcon
                              iconName= {'scanner'}
                              iconColor ={'white'}
                              iconSize ={33}
                              containerStyle = {[styles.buttonStyle,{backgroundColor:'#94c953'}]}
                              onPress = {this.onUploadPhotoPress}
                            />
                          </View>
                        </View>
                      </View>
                  }
                </View>

              </View>
              {this.renderVerifierSelectorView()}
            </ScrollView>

            {this.renderBottomButtons()}
          </View>
        </SafeAreaView>
      </Modal>
    );
  }

  renderAddRoleModal(){
    const {
      addRoleModalVisible,
      roleTextValue
    } = this.state;
    return(
      <Modal
        animationType="slide"
        transparent={true}
        visible={addRoleModalVisible}
        style={{paddingHorizontal:10}}
      >
        <SafeAreaView style={{height: deviceHeight, backgroundColor:COLORS.modalBackground}}>
          <View style={{backgroundColor:COLORS.white, padding: 10,paddingTop: Platform.OS === 'ios'? 35 : 40}}>
            <View style={{position:'absolute', right: 5, top: 5, zIndex:10}}>
              <ButtonWithIcon
                iconSize={verticalScale(20)}
                iconName="close"
                isLight={true}
                iconColor={COLORS.timesIconColor}
                onPress={this.onAddRoleCancelPress}
              />
            </View>
            <View style={{backgroundColor: '#f0f0f0', borderRadius:8,paddingVertical:9, paddingHorizontal:7,marginTop:5}}>
              <Text style={{fontWeight: '700',color:COLORS.modalText, fontSize:12,letterSpacing:0.09}}>ROLE</Text>
              <View style={{paddingTop: 8}} >
                <TextInput
                  placeholder ={'Add your professional role here '}
                  fontSize ={12}
                  value ={roleTextValue}
                  onChangeText = {this.onChangeRoleText}
                />
                <View style={{borderBottomWidth:0.5, borderBottomColor:'#d4d4d4', paddingTop:-5}}/>
                <View style={{paddingVertical: 17}}>
                  <Text style={{color :COLORS.saveButtonColor, fontSize:10, fontWeight:'500'}}>Upload role document here</Text>
                </View>
                <View style={{display:'flex', flexDirection:'row', justifyContent:'space-around', marginHorizontal:81, marginBottom:23}}>
                  <View>
                    <RoundedButtonWithIcon
                      iconName= {'paper-clip'}
                      iconColor ={'white'}
                      iconSize ={33}
                      containerStyle = {[styles.buttonStyle]}
                    />
                  </View>
                  <View>
                    <RoundedButtonWithIcon
                      iconName= {'scanner'}
                      iconColor ={'white'}
                      iconSize ={30}
                      containerStyle = {[styles.buttonStyle,{backgroundColor:'#94c953'}]}
                    />
                  </View>
                </View>
              </View>

            </View>
            <View style={{marginLeft: 7, marginTop: 10}}>
              <Text style={{fontWeight: '700',color:COLORS.modalText, fontSize:12,letterSpacing:0.09}}>VERIFIER</Text>
              <Text style={{color :COLORS.saveButtonColor, fontSize:10, fontWeight:'500', paddingTop:14}}>Select who will verify your role here</Text>
              <View>
                <ButtonWithIcon
                  name ={'+ Verifier'}
                  iconName ={'arrow-down-head'}
                  iconPosition ={'right'}
                  iconSize = {11}
                  containerStyle ={[styles.verifierButtonStyle]}
                  textStyle ={[styles.verifiertextStyle]}
                />
              </View>
            </View>
            <View style={{display:'flex', justifyContent:'flex-end', flexDirection:'row',marginTop:35}}>
              <View style={{marginRight:22}}>
                <ButtonWithIcon
                  iconName="close"
                  iconSize ={15}
                  iconColor={COLORS.white}
                  containerStyle={[styles.bottomButtomStyle,{backgroundColor:'red'}]}
                  onPress={this.onAddRoleCancelPress}
                />
              </View>
              <View>
                <ButtonWithIcon
                  iconName="check-mark"
                  iconSize ={16}
                  iconColor={COLORS.white}
                  containerStyle={styles.bottomButtomStyle}
                  onPress={this.onAddRoleCancelPress}
                />
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }


  render() {
    return (
      <View>
        {this.renderQualificationAndRoleView()}
        {this.renderAddQualificationModal()}
        {this.renderAddRoleModal()}
      </View>
    );
  }
}