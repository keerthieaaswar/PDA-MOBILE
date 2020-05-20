import React, { Component } from 'react';
import {
  View,
  Image
} from 'react-native';
import { stringsConvertor } from '../../../utils/I18n';
import Toolbar from '../../common/Toolbar';
import PropTypes from 'prop-types';
import { sendActionAnalytics, sendActionAnalyticsToDB } from '../../../utils/AnalyticsHelper';
import _ from 'lodash';
import { COLORS } from '../../../constants/Color';
import Spinner from 'react-native-spinkit';


export default class ImageFileView extends Component {

  static propTypes = {
    item: PropTypes.object,
    sessionData: PropTypes.object
  };

  static defaultProps = {
    item: {},
    sessionData: {}
  };
  constructor(props) {
    super(props);
    this.state={
      isImageLoading:true
    };
  }
  componentDidMount(){
    const{
      item,
      sessionData
    } = this.props;
    const sessionId = sessionData.sessionId;
    const sessionName = sessionData.sessionName;
    const topicId = sessionData.topicInfo.topic.id;
    const topicName = sessionData.topicInfo.topic.name;
    const userId = _.has(sessionData.user,'userId') ? sessionData.user.userId :'';
    const programId = sessionData.topicInfo.topic.programId;
    const programName = sessionData.topicInfo.program.name;
    const user = {
      userId: _.has(sessionData.user,'userId') ? sessionData.user.userId :''
    };
    const contentFileName = item.name;
    const role = _.has(sessionData, 'role')? sessionData.role:'';
    sendActionAnalytics('View Content', user, {userId, programId, programName, sessionId, sessionName, topicId, topicName,contentFileName,role });
    sendActionAnalyticsToDB('View Content',{userId,programId, programName, sessionId, sessionName, topicId, topicName,contentFileName,role});
  }
  render() {
    const{
      item
    } = this.props;
    const {
      isImageLoading
    } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <View>
          <Toolbar isBack={true} title={stringsConvertor('screenTitle.viewFile')} />
        </View>
        {isImageLoading ?
          <View style={{flex: 1, alignItems:'center',justifyContent:'flex-end',backgroundColor:COLORS.white}}>
            <Spinner
              color={COLORS.sessionButton}
              type="ChasingDots"
              size={50}
            />
          </View> : null
        }
        <View style={{flex:1,justifyContent:'center',alignItems:'center',opacity:isImageLoading ? 0 :1}}>
          <Image
            style={{flex:1,alignSelf:'stretch'}}
            source={{uri: item.url}}
            resizeMode="contain"
            onLoad= {()=>{
              this.setState({isImageLoading:false});
            }}
          />
        </View>
      </View>
    );
  }
}
