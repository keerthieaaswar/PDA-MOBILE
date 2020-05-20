/**
 * pda
 * Session.js
 * @author Socion Advisors LLP
 * @description Created on 27/02/2019
 * Copyright © 2019 pda. All rights reserved.
 */
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Animated,
  PanResponder,
  ScrollView,
  Platform} from 'react-native';
import Swipeable from 'react-native-swipeable-row';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome5Pro';
import { verticalScale, deviceHeight,deviceWidth, TEXT_TYPE } from '../../../theme/pdaStyleSheet';
import { COLORS } from '../../../constants/Color';
import { navigateToScreen, showNoInternetErrorMessage, myLog, convertDateToLocal } from '../../../utils/StaticFunctions';
import SessionItem from '../../common/listItem/SessionItem';
import { stringsConvertor } from '../../../utils/I18n';
import { DATE_FORMAT } from '../../../constants/String';
import Toolbar from '../../common/Toolbar';
import NotificationBell from '../../../container/common/NotificationBell';
import Ripple from '../../common/rippleEffect';
import ButtonWithIcon from '../../common/ButtonWithIcon';
import BottomMenu from '../../common/BottomMenu';
import Spinner from 'react-native-spinkit';
import CustomIcon from '../../common/CustomIcon';




let isInfoButtonClicked = false;
const styles = StyleSheet.create({
  image:{
    height:verticalScale(350),
    width:verticalScale(350),
    borderRadius: verticalScale(180)
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.liveCardBackground
  },
  draggable: {
    position: 'absolute',
    right: 0,
    backgroundColor: COLORS.white,
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
  liveCardContainer:{
    backgroundColor: COLORS.white,
    borderColor: COLORS.liveCardBorder,
    borderWidth:verticalScale(1),
    marginBottom:verticalScale(-8),
    borderRadius: verticalScale(10),
    marginHorizontal: verticalScale(10)
  },
  upComingCardContainer:{
    backgroundColor: COLORS.white,
    borderColor: COLORS.upComingBorder,
    borderWidth:verticalScale(1),
    marginBottom:verticalScale(-8),
    borderRadius: verticalScale(10),
    marginHorizontal: verticalScale(10)
  },
  cardContainer:{
    borderRadius: 10,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
    backgroundColor:COLORS.white,
    marginHorizontal: verticalScale(10)
  }
});
let initialPosition;
class Session extends Component {
  static propTypes = {
    cardObject: PropTypes.object,
    sessionList: PropTypes.func,
    sessionCardSelect: PropTypes.func,
    isSessionListLoading: PropTypes.bool,
    sessions: PropTypes.array,
    title: PropTypes.string,
    visible: PropTypes.bool,
    sessionInfoDetails: PropTypes.func,
    userData: PropTypes.object,
    isNetworkConnected: PropTypes.bool,
    name: PropTypes.string
  }

static defaultProps = {
  cardObject: {}
}
constructor(props){
  super(props);
  const { height } = Dimensions.get('window');
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

      myLog(':::::::::::::::::::snapToTop', this.state.toTop, gestureState.dy);
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
    paddingFolating: 0
  };
  this.renderItem = this.renderItem.bind(this);
  this.onCreatePress = this.onCreatePress.bind(this);
  this.scrollOffset = 0;
  this.onCreateSessionPress = this.onCreateSessionPress.bind(this);
}
componentDidMount(){
  this.invokeSessionListing();
}
onCreateSessionPress(){
  navigateToScreen('SessionCreateScreen');
}
invokeSessionListing(){
  const {
    sessionList
  } = this.props;
  sessionList();
}

  snapToTop = () => {
    Animated.timing(this.state.position, {
      toValue: {x: 0, y: 0},
      duration: 300
    }).start(() => {});
    myLog(':::::::::::::::::::snapToBottom');
    this.setState({ toTop: true, isScrollEnabled: true, paddingFolating: 40});
  }

  snapToBottom = (initialPosition) => {
    Animated.timing(this.state.position, {
      toValue: initialPosition,
      duration: 300
    }).start(() => {});
    myLog(':::::::::::::::::::snapToBottom');
    this.setState({ toTop: false, isScrollEnabled: false ,paddingFolating: 0 });
  }
  onCreatePress(){
    if (!this.props.isNetworkConnected) {
      showNoInternetErrorMessage();
      return;
    }
    navigateToScreen('SessionCreateAndEditScreen',{type:'create'});
  }

  renderItem(item, index, array){
    myLog('item, index',item, index);
    return(
      <SessionItem key={index} item={item}
        index={index}
        lastIndex={array.length - 1}
        onPress={()=>{
          this.snapToBottom(initialPosition);
          this.props.sessionCardSelect(index);
        }}
      />
    );
  }

  renderTopCard(){
    const{
      cardObject
    } = this.props;
    let containerStyle = {};
    let rippleColor = COLORS.flashLoadingBackground;
    let status = stringsConvertor('session.saved');
    switch (cardObject.sessionProgress) {
      case 1:
        containerStyle = styles.liveCardContainer;
        rippleColor = COLORS.liveCardBorder;
        status = stringsConvertor('session.upcoming');
        break;
      case 2:
        containerStyle = styles.upComingCardContainer;
        rippleColor = COLORS.liveRipple;
        status = stringsConvertor('session.live');
        break;
      default:
        break;
    }
    const startDate =  convertDateToLocal(cardObject.sessionStartDate, DATE_FORMAT.DDMMMYYYYhhmmA);
    const endDate =  convertDateToLocal(cardObject.sessionEndDate, DATE_FORMAT.DDMMMYYYYhhmmA);
    return(
      <View style={{marginVertical:verticalScale(20),marginHorizontal:verticalScale(8), alignItems:'center',justifyContent:'center'}}>
        <View style={{flexDirection:'row',height:verticalScale(200), zIndex:-5, alignItems:'center',justifyContent:'center'}} >
          <View style={{flex:1}}>
            <Swipeable
              rightContent={(
                <View style={[styles.rightSwipeItem, {zIndex:-99, backgroundColor:'transparent'}]} />
              )}
              onRightActionDeactivate={()=>navigateToScreen('SessionInfoScreen',{cardObject})}
              style={{zIndex:10}}
            >
              <Ripple style={[styles.cardContainer, containerStyle, {height: (deviceHeight/100)*22}]} onPress={()=>navigateToScreen('SessionInfoScreen',{cardObject})}>
                <View style={{paddingVertical: verticalScale(10),paddingHorizontal:verticalScale(5), flexDirection:'row'}} >
                  <View style={{alignItems:'center', flexDirection:'row'}}>
                    <CustomIcon
                      name="circle"
                      size={15}
                      color={rippleColor}
                      solid={true}
                      style={{paddingHorizontal:verticalScale(5)}}
                    />
                    <Text style={[TEXT_TYPE.H1]}>{status}</Text>
                  </View>
                </View>
                <View style={{paddingVertical:verticalScale(5),paddingHorizontal:verticalScale(10)}}>
                  <Text style={[TEXT_TYPE.H2,{color:COLORS.black, paddingRight:verticalScale(10),textAlign:'justify'}]} numberOfLines={3}>{cardObject.sessionName}</Text>
                  <View style={{justifyContent:'space-between', paddingVertical:verticalScale(10)}}>
                    <Text style={{fontSize:Platform.OS === 'ios'?verticalScale(11): verticalScale(12)}}>{stringsConvertor('session.startDate')}{startDate}</Text>
                    <Text style={{fontSize:Platform.OS === 'ios'?verticalScale(11): verticalScale(12)}}>{stringsConvertor('session.endDate')}{endDate}</Text>
                  </View>
                </View>
              </Ripple>
            </Swipeable>
          </View>
        </View>
      </View>
    );
  }
  renderListView(sessions){
    const {height} = Dimensions.get('window');
    return (
      <View style={[styles.container]}>
        {this.renderTopCard()}
        <Animated.View style={[styles.draggable, { height:height-verticalScale(50) }, this.state.position.getLayout()]} {...this.parentResponder.panHandlers}>
          <View style={{paddingTop: verticalScale(20),marginHorizontal:8}}>
            <ScrollView
              scrollEnabled={this.state.isScrollEnabled}
              scrollEventThrottle={16}
              onScroll={(event) => {
                this.scrollOffset = event.nativeEvent.contentOffset.y;
              }}
            >
              {sessions.map(this.renderItem)}
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
        <Text style={[TEXT_TYPE.H2,{textAlign:'center',paddingBottom:verticalScale(100)}]}>{stringsConvertor('session.noSession')}</Text>
      </View>
    );
  }

  render(){
    const {
      sessions,
      isSessionListLoading,
      name
    } = this.props;

    const {
      isShowBottomButton
    } = this.state;
    return(
      <View style={styles.container}>
        <Toolbar title={stringsConvertor('screenTitle.sessions')}
          rightRender={
            <NotificationBell color={COLORS.white} />
          }
        />
        { isSessionListLoading ?
          <View style={{flex:1, alignItems:'center',justifyContent:'center'}}>
            <Spinner
              color={COLORS.sessionButton}
              type="ChasingDots"
              size={25}
            />
          </View> :
          sessions.length === 0 ?
            this.renderNoDataView()
            :this.renderListView(sessions, isSessionListLoading)
        }
        <View style={{position:'absolute', bottom: 10, right: 10, zIndex: 6}}>
          <Ripple style={[styles.buttonContainer,{marginBottom: isShowBottomButton  || sessions.length < 6 ? verticalScale(120) :0}]} onPress={this.onCreateSessionPress} rippleContainerBorderRadius={verticalScale(40)}>
            <Image
              source={require('../../../assets/Images/plus.png')}
              style={{width: verticalScale(56), height: verticalScale(56)}}
            />
          </Ripple>
        </View>
        {isShowBottomButton  || sessions.length < 6  ? <BottomMenu style={{}} screen={name}/> : null}
      </View>
    );
  }

}

export default Session;
