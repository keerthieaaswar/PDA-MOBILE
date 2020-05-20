import {PureComponent} from 'react';
import {Platform, BackHandler, ToastAndroid} from 'react-native';
import {Actions} from 'react-native-router-flux';
import { myLog } from '../../utils/StaticFunctions';
import PropTypes from 'prop-types';
import { stringsConvertor } from '../../utils/I18n';

let backButtonPressed = false;

/**
 * Handle the hardware back button on ANDROID.
 */
export default class AndroidBackHandler extends PureComponent {
  static propTypes = {
    screen: PropTypes.string
  }
  componentDidMount() {
    setTimeout(() => {
      if (Platform.OS === 'android') {
        myLog('AndroidBackHandler::::componentDidMount,props,action', this.props.screen,Actions.currentScene);
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
      }
    }, 300);
  }

  componentWillUnmount() {
    const {
      screen
    } = this.props;
    myLog('===========================AndroidBackHandler=================+++++++++++++++++++++++++++++++++++++++',screen,Actions.currentScene);
    if (Platform.OS === 'android' && Actions.currentScene === screen) {
      myLog('AndroidBackHandler::::componentWillUnmount', screen);
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }
  }


  handleBackPress() {
    const currentScreen = (Actions.currentScene).replace(/_+/g, '');
    myLog('Actions.currentScene',currentScreen);
    if (currentScreen === 'LoginScreen' ||
  currentScreen === 'SplashScreen' ||
  currentScreen === 'DashboardScreen' ||
  currentScreen === 'IntroScreen') {
      if (!backButtonPressed) {
        backButtonPressed = true;
        setTimeout(() => {
          backButtonPressed = false;
        }, 3000);
        ToastAndroid.show(stringsConvertor('alertMessage.backButtonPres'), ToastAndroid.SHORT);
        return true;
      } else {
        BackHandler.exitApp();
        return true;
      }
    }else if (currentScreen === 'SessionCreateScreen') {
      return true;
    }
  }

  render() {
    return null;
  }
}