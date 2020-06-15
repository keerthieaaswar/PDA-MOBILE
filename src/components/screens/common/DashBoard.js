import React , { Component } from 'react';
import {
  View,
  Image,
  Text,
  Modal,
  Dimensions
} from 'react-native';
import BottomMenu from '../../common/BottomMenu';
import PropTypes from 'prop-types';
import { verticalScale, pdaStyleSheet, TEXT_TYPE, horizontalScale } from '../../../theme/pdaStyleSheet';
import NotificationBell from '../../../container/common/NotificationBell';
import RootView from '../../common/RootView';
import { stringsConvertor } from '../../../utils/I18n';
import { COLORS } from '../../../constants/Color';
import { isTrainerApp, myLog} from '../../../utils/StaticFunctions';
import AndroidBackHandler from '../../common/AndroidBackHandler';
import ButtonWithIcon from '../../common/ButtonWithIcon';
import _ from 'lodash';
import { sendActionAnalytics, sendActionAnalyticsToDB } from '../../../utils/AnalyticsHelper';
const width = Dimensions.get('screen').width;



class DashBoard extends Component {

  static propTypes = {
    getUnReadCount: PropTypes.func,
    name: PropTypes.string,
    offlineSyn: PropTypes.func,
    isNetworkConnected: PropTypes.bool,
    getUserProfile: PropTypes.func,
    getConsentInfo : PropTypes.func,
    postConsentInfo : PropTypes.func
  }

  static defaultProps = {
    getUnReadCount: ()=>{},
    name:'',
    isNetworkConnected: false
  }
  constructor(){
    super();
    this.state ={
      visible: true,
      userData: [],
      onTrigger: false,
      pos:0,
      consentList:[]
    };
  }

  async componentDidMount(){
    await this.getAccountDetails();
    //this.getConsentDetails();
    // setTimeout(()=>{
    //   this.getConsentDetails();
    // },2000);
    setTimeout(()=>{
      this.props.isNetworkConnected ? this.props.offlineSyn() : '';
    },3000);
    this.props.getUnReadCount();
  }

  async getAccountDetails(){
    const {
      isNetworkConnected,
      getUserProfile
    } = this.props;
    if(isNetworkConnected){
      await getUserProfile((status,response )=>{
        if (status) {
          this.setState({userData: response});
        }
        myLog('stateInside', this.state.userData);
      });
    }
  }
  getConsentDetails(){
    myLog('=====================get consent============');
    const {
      getConsentInfo
    } = this.props;
    const{
      userData,
      consentList
    } = this.state;
    const userId = _.has(userData, 'userId') ? userData.userId : '';
    myLog('state', this.userId);
    myLog('props12',this.props);
    this.setState( ()=>{
      getConsentInfo(userId,(status,response )=>{
        response.map((item)=>{
          consentList.push(item);
        });
        this.setState({visible: true});

        myLog('ckekckec',response, consentList);
      });
    });
  }
  onAcceptConsent =((item)=>{
    const {
      postConsentInfo
    } = this.props;
    const{
      userData,
      pos
    }= this.state;
    const userId = _.has(userData, 'userId') ? userData.userId : '';
    myLog('afterAccepting',this.props,userData);
    myLog('item123',item);
    const consentId = item.consentId;
    const action = true;
    const appType = isTrainerApp() ? 'trainer' : 'participant';
    const data ={
      consentId,
      action,
      appType,
      userId
    };
    myLog('daataa',data);
    this.setState(()=>{
      postConsentInfo(data,(status,response )=>{
        this.setState({ pos: pos+1});
        myLog('ckekckec12',response);
        if(item.title === 'PII Consent'){
          sendActionAnalytics('Consent PII', userData,{userId});
          sendActionAnalyticsToDB('Consent PII',{userId});
        }
      });
    });
  });
  onDeclineConsent =((item)=>{
    const {
      postConsentInfo
    } = this.props;
    const{
      userData,
      pos
    }= this.state;
    const userId = _.has(userData, 'userId') ? userData.userId : '';
    myLog('afterAccepting',this.props,userData);
    myLog('item123',item);
    const consentId = item.consentId;
    const action = false;
    const appType = isTrainerApp() ? 'trainer' : 'participant';
    const data ={
      consentId,
      action,
      appType,
      userId
    };
    myLog('daataa',data);
    this.setState(()=>{
      postConsentInfo(data,(status,response )=>{
        this.setState({ pos: pos+1});
        myLog('ckekckec12',response);
      });
    });
  });
  renderModalView(item){
    myLog('item',item);
    const {pos,userData} = this.state;
    myLog('data2323',userData);
    return(
      <View style={{margin: verticalScale(30), backgroundColor:COLORS.white,
        borderRadius: verticalScale(5), overflow:'hidden', width:(width/100)*90}}
      >
        <View style={{padding: 5}}>
          <Text style={[TEXT_TYPE.H3,{color:COLORS.red, padding:10}]}>{item.title}</Text>
          <View style={{paddingHorizontal:horizontalScale(15),paddingVertical: verticalScale(5)}}>
            <Text style={[TEXT_TYPE.H3,{color:COLORS.black, paddingTop:10}]}>{item.description}</Text>
          </View>
        </View>

        <View style={{
          flexDirection:'row',
          justifyContent:'flex-end',
          alignItems:'center',
          paddingHorizontal: verticalScale(20),
          paddingBottom: verticalScale(15)
        }}
        >
          <ButtonWithIcon
            textStyle={[TEXT_TYPE.H3,{color:COLORS.titleColor}]}
            name="Decline"
            onPress={() => {this.onDeclineConsent(item);}}
          />
          <ButtonWithIcon
            textStyle={[TEXT_TYPE.H3,{color:COLORS.red}]}
            name= "Accept"
            onPress={() => {this.onAcceptConsent(item);}}
          />
        </View>
      </View>
    );
  }
  renderConsentAlertModal(item){
    const {
      visible
    } = this.state;
    const modalProps = {
      visible
    };
    myLog('itemitem',item);
    return(
      <Modal
        animationType="fade"
        supportedOrientations={['portrait']}
        onRequestClose={null}
        transparent={true}
        {...modalProps}
      >
        <View
          style={{flex:1, alignItems:'center', justifyContent:'center',backgroundColor:COLORS.placeholderTextColor}}
        >

          { this.renderModalView(item)}
        </View>
      </Modal>
    );
  }

  render(){
    const {
      name
    } = this.props;
    myLog('propsCheck1', this.props);
    const {consentList, pos,visible} = this.state;
    myLog('InRenderConsent List',consentList);
    //myLog('item1', ListA);
    return(
      <RootView style={{flex:1, backgroundColor:COLORS.white, paddingTop : pdaStyleSheet.toolbarPaddingTop}} >
        <View style={{position:'absolute', right: 10, top: 10, marginTop : pdaStyleSheet.toolbarPaddingTop, zIndex:2}} >
          <NotificationBell/>
        </View>
        <View style={{marginVertical: 10, marginHorizontal: verticalScale(5)}}>
          <Image
            testID = "logo"
            source={require('../../../assets/Images/logo.png')}
            style={{marginTop:verticalScale(38),marginHorizontal:verticalScale(16),marginBottom:verticalScale(25)}}
          />
        </View>
        <View style={{paddingHorizontal: verticalScale(20)}}>
          <Text style={[TEXT_TYPE.H5,{marginBottom: 5}]}>{stringsConvertor('dashboard.welcomeTo')}</Text>
          <Text style={[TEXT_TYPE.H11, {color: COLORS.black,fontWeight: 'bold'}]}>{isTrainerApp() ? stringsConvertor('alert.trainerApp') : stringsConvertor('alert.participantApp') }</Text>
        </View>
        <BottomMenu screen={name}/>

        {/* { pos< consentList.length && visible ? this.renderConsentAlertModal(consentList[pos]) : null} */}


        <AndroidBackHandler screen={name}/>
      </RootView>
    );
  }
}

export default DashBoard;