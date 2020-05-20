import React, { PureComponent } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image
} from 'react-native';
import { TEXT_TYPE, verticalScale } from '../../../theme/pdaStyleSheet';
import ButtonWithIcon from '../ButtonWithIcon';
import { myLog, showSuccessMessage, showErrorMessage, downloadFileFromUrl,navigateToScreen, showLoadingMessage } from '../../../utils/StaticFunctions';
import { stringsConvertor } from '../../../utils/I18n';
import { FOLDER } from '../../../constants/String';
import { sendActionAnalytics, sendActionAnalyticsToDB } from '../../../utils/AnalyticsHelper';
import PropTypes from 'prop-types';
import { COLORS } from '../../../constants/Color';
import _ from 'lodash';
import Ripple from '../rippleEffect';

const styles = StyleSheet.create({
  container:{
    padding:10,
    flexDirection:'row'
  }
});

class FileItem extends PureComponent {
  static propTypes ={
    sessionData:PropTypes.object,
    item: PropTypes.object,
    index: PropTypes.number,
    cardObject: PropTypes.object,
    navigate: PropTypes.string,
    isNetwork: PropTypes.bool
  }
  static defaultProps ={
    sessionData:{},
    item: {},
    cardObject: {},
    navigate: '',
    isNetwork:false
  }
  constructor(props){
    super(props);
    this.state = {
      isDownloading : false
    };
    myLog('==========================++++++++++++++++++++++++++++++++++',props);
  }
  onDownloadPress(item){
    const url = item.url;
    if (url === '' || url === null) {
      showErrorMessage(stringsConvertor('alertMessage.downloadError'));
      return;
    }
    const fileName = url.split('/').pop().split('#')[0].split('?')[0];
    const folder = FOLDER.DOWNLOAD ;
    const {sessionData,cardObject} =this.props;
    const programId = sessionData.topicInfo.topic.programId;
    const programName = sessionData.topicInfo.program.name;
    const sessionId = sessionData.sessionId;
    const sessionName = sessionData.sessionName;
    const topicId = sessionData.topicInfo.topic.id;
    const topicName = sessionData.topicInfo.topic.name;
    const role = _.has(sessionData, 'role')? sessionData.role:'';
    myLog('checkData123',role);
    showLoadingMessage(stringsConvertor('alertMessage.downloading'));
    this.setState({isDownloading: true, status:stringsConvertor('alertMessage.downloading')},()=>{
      downloadFileFromUrl(fileName, url, folder, true, (status) => {
        myLog('downloadFileFromUrl+++++++++++',url, status,sessionData);
        if (status === true) {
          const contentFileName = item.name;
          const sessionStartDate = sessionData.sessionStartDate;
          const sessionEndDate = sessionData.sessionEndDate;
          const userId = _.has(sessionData.user,'userId') ? sessionData.user.userId :'';
          const user = {
            userId : _.has(sessionData.user,'userId') ? sessionData.user.userId :''
          };
          sendActionAnalytics('Download Content', user, {userId, programId, programName, sessionId, sessionName,contentFileName, topicId, topicName,role });
          sendActionAnalyticsToDB('Download Content',{userId,sessionStartDate,sessionEndDate,contentFileName,programId, programName, sessionId, sessionName, topicId, topicName,role});
          this.setState({isDownloading: true});
          showSuccessMessage(stringsConvertor('alertMessage.downloadSuccess'));
        }else{
          this.setState({isDownloading: false});
          showErrorMessage(stringsConvertor('alertMessage.downloadError'));
        }
      });
    });
  }
  onPlayPress(item){
    const {sessionData} =this.props;
    myLog('===================on play press=====',item);

    if((item.vimeoId === '' || item.vimeoId === null) && (item.url === '' || item.url === null)){
      showErrorMessage(stringsConvertor('validationMessage.404'));
    } else{
      navigateToScreen('VideoPlayScreen',{item,sessionData});
    }
  }
  onViewPress(item){
    const {sessionData} =this.props;
    myLog('check=>',sessionData);
    if(item.url === '' || item.url === null){
      showErrorMessage(stringsConvertor('validationMessage.404'));
    } else{
      navigateToScreen('PdfFileViewScreen',{item,sessionData});
    }
  }
  onImageViewPress(item){
    const {sessionData} =this.props;
    myLog('check=>',sessionData);
    if(item.url === '' || item.url === null){
      showErrorMessage(stringsConvertor('validationMessage.404'));
    } else{
      navigateToScreen('ImageFileViewScreen',{item,sessionData});
    }
  }
  render(){
    const {
      item,
      index,
      isNetwork,
      cardObject,
      sessionData
    } = this.props;
    const {
      isDownloading
    } = this.state;
    myLog('checkData123',cardObject,sessionData);
    let source = require('../../../assets/Images/pdf.png');
    myLog('FILE ITEM', item);
    switch (item.contentType) {
      case 'Video':
        source = require('../../../assets/Images/video.png');
        break;
      case 'Document':
        source = require('../../../assets/Images/pdf.png');
        break;
      case 'Image':
        source = require('../../../assets/Images/imageView.png');
        break;
      default:
        break;
    }
    return(
      <View style={[styles.container, {borderTopColor:COLORS.showLineBackground, borderTopWidth: index !== 0 ? 0.5 :0}]}>
        <View style={{paddingHorizontal: 5, justifyContent:'center'}}>
          <Image
            testID="logo"
            source={source}
            style={{ height: 25, width: 25 }}
            resizeMode="contain"
          />
        </View>
        <Ripple style={{ flex: 1 , paddingHorizontal: 5,paddingTop:verticalScale(10), justifyContent:'center'}}
          onPress ={()=>{
            item.contentType === 'Video' ? this.onPlayPress(item) : item.contentType === 'Document' ? this.onViewPress(item) :
              item.contentType === 'Image' ? this.onImageViewPress(item) : '';
          }}
        >
          <Text style={[TEXT_TYPE.H1, {color:COLORS.black}]}>{item.name}</Text>
          <Text style={[TEXT_TYPE.H0, {}]}>{item.size}</Text>
        </Ripple>
        <View style={{flexDirection:'row'}} pointerEvents={isDownloading ? 'none':null}>
          <View style={{marginTop:verticalScale(8)}}>
            <ButtonWithIcon
              iconSize={verticalScale(12)}
              iconName="download-profile-icon"
              iconColor={isNetwork ? COLORS.shareTextColor : COLORS.sessionEditFedColor}
              disabledRipple = {!isNetwork}
              onPress={()=> isNetwork ? this.onDownloadPress(item):''}
              textStyle={[TEXT_TYPE.H0, {color:COLORS.sessionEditColor}]}
              containerStyle={{alignItems:'center'}}
            />
          </View>
        </View>
      </View>
    );
  }
}

export default FileItem;