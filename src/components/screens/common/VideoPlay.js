import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import VideoPlayer from 'react-native-video-player';
import { verticalScale } from '../../../theme/pdaStyleSheet';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';
import _ from 'lodash';
import { sendActionAnalytics, sendActionAnalyticsToDB } from '../../../utils/AnalyticsHelper';


export default class VideoPlay extends Component {

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

    this.state = {
      video: { width: undefined, height: undefined, duration: '' },
      thumbnailUrl: '',
      videoUrl: '',
      optionalVideo:{ width: 100, height:100, duration: '' }
    };
  }

  componentDidMount() {
    const {
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
    const VIMEO_ID = _.has(item, 'vimeoId') ? item.vimeoId === null ? '0' : item.vimeoId : '0';
    sendActionAnalytics('View Content', user, {userId, programId, programName, sessionId, sessionName, topicId, topicName,contentFileName,role });
    sendActionAnalyticsToDB('View Content',{userId,programId, programName, sessionId, sessionName, topicId, topicName,contentFileName,role});
    global.fetch(`https://player.vimeo.com/video/${VIMEO_ID}/config`)
      .then((res) => res.json())
      .then((res) => this.setState({
        thumbnailUrl:VIMEO_ID === '0'? '': res.video.thumbs['640'],
        videoUrl:VIMEO_ID === '0'? item.url : res.request.files.hls.cdns[res.request.files.hls.default_cdn].url,
        video:VIMEO_ID === '0'? '' :  res.video
      }));
  }

  render() {
    const{
      item
    } = this.props;
    return (
      <View style={{flex:1,justifyContent:'center'}}>
        <Text style={{ fontSize: 22, marginBottom: 22,paddingHorizontal:verticalScale(15) }}>
          {item.name}</Text>
        <VideoPlayer
          endWithThumbnail
          thumbnail={{ uri: this.state.thumbnailUrl }}
          video={{ uri: this.state.videoUrl }}
          videoWidth={this.state.video.width}
          videoHeight={this.state.video.height}
          duration={this.state.video.duration}
          ref={(r) => this.player = r}
          autoplay={true}
        />
        <Button
          onPress={() => Actions.pop()}
          title="Cancel"
        />
      </View>
    );
  }
}