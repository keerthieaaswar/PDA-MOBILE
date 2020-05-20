import React, { Component } from 'react';
import {
  View
} from 'react-native';
import Pdf from 'react-native-pdf';
import { myLog } from '../../../utils/StaticFunctions';
import { stringsConvertor } from '../../../utils/I18n';
import Toolbar from '../../common/Toolbar';
import PropTypes from 'prop-types';
import { sendActionAnalytics, sendActionAnalyticsToDB } from '../../../utils/AnalyticsHelper';
import _ from 'lodash';
export default class PdfFileView extends Component {

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
    myLog('+++++++',this.props);
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
      userId : _.has(sessionData.user,'userId') ? sessionData.user.userId :''
    };
    const contentFileName = item.name;
    const role = _.has(sessionData, 'role')? sessionData.role:'';
    sendActionAnalytics('View Content', user, {userId, programId, programName, sessionId, sessionName, topicId, topicName,contentFileName,role });
    sendActionAnalyticsToDB('View Content',{userId,programId, programName, sessionId, sessionName, topicId, topicName,contentFileName,role});
  }
  render() {
    const{
      item,
      sessionData
    } = this.props;
    const source = {uri:item.url};
    myLog('+++++++',this.props,sessionData);
    return (
      <View style={{ flex: 1 }}>
        <View>
          <Toolbar isBack={true} title={stringsConvertor('screenTitle.viewFile')} />
        </View>
        <Pdf
          style={{ flex: 1}}
          source={source}
          onLoadComplete={(numberOfPages,filePath)=>{
          }}
          onPageChanged={(page,numberOfPages)=>{
          }}
          onError={(error)=>{
          }}
          onPressLink={(uri)=>{
          }}
        />
      </View>
    );
  }
}
