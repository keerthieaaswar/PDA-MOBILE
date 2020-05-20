import React, { Component } from 'react';
import { View, StyleSheet, Image, Text,ScrollView} from 'react-native';
import PropTypes from 'prop-types';
import { verticalScale, TEXT_TYPE, FONT_FAMILY } from '../../../theme/pdaStyleSheet';
import { COLORS } from '../../../constants/Color';
import { Actions } from 'react-native-router-flux';
import Button from '../../common/Button';
import { navigateToScreen, showErrorMessage, showSuccessMessage } from '../../../utils/StaticFunctions';
import TextInput from '../../common/TextInput';
import ButtonWithIcon from '../../common/ButtonWithIcon';
import RootView from '../../common/RootView';
import { stringsConvertor } from '../../../utils/I18n';
import AesUtil from '../../../utils/AesUtil';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  logo:{
    width: 85,
    height: 85,
    borderRadius: 85/2,
    backgroundColor: COLORS.password,
    marginTop:verticalScale(35)
  },
  buttonStyle:{
    width : verticalScale(350),
    paddingVertical: verticalScale(15),
    borderRadius:verticalScale(6)
  },
  buttonText:{
    color:COLORS.white,
    fontFamily: FONT_FAMILY.BOLD,
    paddingHorizontal:verticalScale(40)
  }
});


let aesUtil = new AesUtil();
export default class App extends Component {


  static propTypes = {
    isNetworkConnected : PropTypes.bool,
    userForgotPassword: PropTypes.func,
    phoneNumber: PropTypes.string
  }

  static defaultProps = {
    isNetworkConnected: false,
    userForgotPassword: ()=>{},
    phoneNumber:''
  }
  constructor(props){
    super(props);

    this.state = {
      isLoading: false,
      password:'',
      reTypePassword:'',
      passwordError:'',
      rePasswordError:'',
      reTypePasswordStatus:'',
      countryCode:''
    };
    this.onPressBack = this.onPressBack.bind(this);
    this.onSubmitPress = this.onSubmitPress.bind(this);
    this.onChangeTextPassword = this.onChangeTextPassword.bind(this);
    this.onChangeTextRePassword = this.onChangeTextRePassword.bind(this);
  }

  onChangeTextPassword(text){
    this.setState({ password: text, passwordError:'' });
  }
  onChangeTextRePassword(text){
    const {
      password
    } = this.state;
    this.setState({ reTypePassword: text, rePasswordError:'',reTypePasswordStatus: text === password ? 'success':''  });
  }

  onPressBack(){
    Actions.pop();
  }
  onSubmitPress(){
    const {
      password,
      reTypePassword
    } = this.state;
    const {
      userForgotPassword,
      phoneNumber,
      isNetworkConnected,
      countryCode
    } = this.props;
    if (password.length === 0) {
      this.setState({passwordError: stringsConvertor('validationMessage.passwordIsRequired')
      });
      this.password.focus();
      return;
    }
    if (reTypePassword.length === 0) {
      this.setState({rePasswordError: stringsConvertor('validationMessage.retypePasswordIsRequired')
      });
      this.reTypePassword.focus();
      return;
    }

    if (password !== reTypePassword) {
      this.setState({rePasswordError: stringsConvertor('validationMessage.passwordMatching')
      });
      this.reTypePassword.focus();
      return;
    }
    if (isNetworkConnected) {
      const data = {
        password : aesUtil.encrypt(password),
        userName: phoneNumber,
        countryCode
      };
      this.setState({isLoading: true}, ()=>{
        userForgotPassword(data, (status, response)=>{
          if (status === true) {
            showSuccessMessage(stringsConvertor('resetPassword.passwordSetSuccess'));
            navigateToScreen('DashboardScreen');
          }else{
            showErrorMessage(response);
          }
          this.setState({isLoading: false});
        });
      });
    }
  }
  render(){
    const{
      password,
      reTypePassword,
      passwordError,
      rePasswordError,
      reTypePasswordStatus,
      isLoading
    } = this.state;
    return (
      <RootView pointerEvents = {isLoading ? 'none':null} style={{flex:1}}>
        <ScrollView>
          <View style={{position:'absolute', right: 10, top: 10}}>
            <ButtonWithIcon
              iconSize={verticalScale(20)}
              iconName="left-arrow"
              isLight={true}
              iconColor={COLORS.grayLight}
              onPress={this.onPressBack}
            />
          </View>
          <View style={{marginHorizontal:verticalScale(23)}}>
            <View style={{flexDirection:'row',justifyContent : 'space-between'}}>
              <View style={{marginVertical: 10}}>
                <Image
                  testID = "logo"
                  source={require('../../../assets/Images/logo.png')}
                  style={{marginTop:verticalScale(56),marginBottom:verticalScale(30)}}
                />
              </View>
            </View>
            <View>
              <Text style={[TEXT_TYPE.H10,{marginVertical:verticalScale(29),color:COLORS.appNameColor}]}>{stringsConvertor('forgetPassword.forgetText')}</Text>
            </View>
            <View>
              <TextInput
                ref={(input) => this.password = input}
                label={stringsConvertor('resetPassword.enterNewPassword')}
                baseColor={COLORS.gray}
                tintColor={COLORS.tintColor}
                textColor ={COLORS.textColor}
                value={password}
                secureTextEntry = {true}
                onChangeText={this.onChangeTextPassword}
                error={passwordError}
                onSubmitEditing={() => this.reTypePassword.focus()}
                rightViewType={'password'}
              />
              <TextInput
                ref={(input) => this.reTypePassword = input}
                label={stringsConvertor('resetPassword.reenterPassword')}
                baseColor={COLORS.gray}
                tintColor={COLORS.tintColor}
                textColor ={COLORS.textColor}
                value={reTypePassword}
                secureTextEntry = {true}
                onChangeText={this.onChangeTextRePassword}
                error={rePasswordError}
                onSubmitEditing={this.onSubmitPress}
                rightViewType={reTypePasswordStatus}
              />
            </View>

            <View style={{alignItems:'center',marginTop:verticalScale(135)}}>
              <Button
                name = {stringsConvertor('resetPassword.submit')}
                containerStyle = {styles.buttonStyle}
                onPress={this.onSubmitPress}
                isLoading={isLoading}
              />
            </View>
          </View>
        </ScrollView>
      </RootView>
    );
  }
}
