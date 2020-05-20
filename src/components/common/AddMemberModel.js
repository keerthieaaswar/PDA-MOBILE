/**
 * pda
 * AddMemberModel.js
 * @author Socion Advisors LLP
 * @description Created on 11/06/2019
 * Copyright © 2019 pda. All rights reserved.
 */
import React, { PureComponent } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Modal,
  TextInput,
  Platform
} from 'react-native';
import ButtonWithIcon from './ButtonWithIcon';
import { verticalScale, deviceHeight, TEXT_TYPE, FONT_FAMILY } from '../../theme/pdaStyleSheet';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { myLog, validateText } from '../../utils/StaticFunctions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { stringsConvertor } from '../../utils/I18n';
import { COLORS } from '../../constants/Color';
let timeStamp = new Date();
const styles = StyleSheet.create({
  modelBottomButton:{
    borderRadius:verticalScale(25),
    height:verticalScale(40),
    width:verticalScale(40)
  },
  ModelBottomView:{
    flexDirection:'row',
    justifyContent:'flex-end',
    marginBottom:verticalScale (25)
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
  modelProfileView:{
    flexDirection:'row',
    marginVertical:verticalScale(20),
    borderRadius:verticalScale(8),
    overflow:'hidden',
    backgroundColor:COLORS.white
  },
  profileImage :{
    width:verticalScale(80),
    height:verticalScale(80)
  },
  checkButtonText:{
    color:COLORS.shadowColor,paddingHorizontal:verticalScale(10),fontFamily:FONT_FAMILY.SEMI_BOLD
  },
  otherRoleDescriptionStyle:{
    fontFamily:FONT_FAMILY.SEMI_BOLD,
    borderBottomWidth: verticalScale(.5),
    color:COLORS.cancelText
  }
});
const initialState = {
  otherRoleDescription:'',
  isCheckedTrainer : false,
  isCheckedAdmin : false,
  isCheckedOther: false
};
export default class AddMemberModel extends PureComponent{
    static propTypes = {
      onCancelPress : PropTypes.func,
      onSavePress:PropTypes.func,
      visible: PropTypes.bool,
      data: PropTypes.object
    }
      static defaultProps = {
        onCancelPress : ()=>{},
        onSavePress:()=>{},
        visible: false,
        data:{}
      }
      constructor(props){
        super(props);

        myLog('Photo U roleDescription', props.data);
        const admin = _.has(props.data.roles, 'admin') ? props.data.roles.admin : false;
        const trainer = _.has(props.data.roles, 'trainer') ? props.data.roles.trainer : false;
        const other = _.has(props.data.roles, 'other') ? props.data.roles.other : false;
        const otherRoleNames = _.has(props.data.roles, 'otherRoleNames') ? props.data.roles.otherRoleNames :'';
        this.state= {
          otherRoleDescription: otherRoleNames,
          isCheckedTrainer : trainer,
          isCheckedAdmin : admin,
          isCheckedOther: other,
          isOtherError:false
        };
        this.onPressTrainer = this.onPressTrainer.bind(this);
        this.onPressAdmin = this.onPressAdmin.bind(this);
        this.onPressOther = this.onPressOther.bind(this);
        this.onChangeTextOtherRoleDescription=this.onChangeTextOtherRoleDescription.bind(this);
        this.onSavePress = this.onSavePress.bind(this);
        this.onCancelPress = this.onCancelPress.bind(this);
      }
      componentWillReceiveProps(props){
        myLog('AddMemberModel ::: componentWillReceiveProps', props.data);
        const admin = _.has(props.data.roles, 'admin') ? props.data.roles.admin : false;
        const trainer = _.has(props.data.roles, 'trainer') ? props.data.roles.trainer : false;
        const other = _.has(props.data.roles, 'other') ? props.data.roles.other : false;
        const otherRoleNames = _.has(props.data.roles, 'otherRoleNames') ? props.data.roles.otherRoleNames :'';
        this.setState({
          otherRoleDescription: otherRoleNames,
          isCheckedTrainer : trainer,
          isCheckedAdmin : admin,
          isCheckedOther: other
        });
      }
      onCancelPress(){
        const {
          onCancelPress
        } = this.props;
        onCancelPress();
        this.setState({...initialState,isOtherError:false});
      }
      onSavePress(){
        const {
          data,
          onSavePress
        } = this.props;
        const {
          otherRoleDescription,
          isCheckedTrainer,
          isCheckedAdmin,
          isCheckedOther
        } = this.state;
        const dataObject = {
          userId: data.userId,
          name: data.name,
          photo: data.photo,
          eligibleAsTrainer: data.eligibleAsTrainer,
          roles: {
            admin: isCheckedAdmin,
            other: isCheckedOther,
            trainer: isCheckedTrainer,
            otherRoleNames: isCheckedOther ? otherRoleDescription : ''
          }
        };
        if (!isCheckedAdmin && !isCheckedOther && !isCheckedTrainer) {
          this.setState({
            isOtherError: true,
            otherError: stringsConvertor('validationMessage.roleIsRequired')
          });
          return;
        }

        if (isCheckedOther && otherRoleDescription.length === 0 || (isCheckedOther && !validateText(otherRoleDescription)) ) {
          this.setState({
            isOtherError: true,
            otherRoleDescription:'',
            otherError: stringsConvertor('validationMessage.otherRoleDescription')
          });
          return;
        }
        onSavePress(dataObject, ()=>{
          this.setState({...initialState});
        });
      }
      onPressTrainer() {
        this.setState((prevState) => {
          return {
            isCheckedTrainer: !prevState.isCheckedTrainer, isOtherError: false
          };
        });
      }
      onPressAdmin() {
        this.setState((prevState) => {
          return {
            isCheckedAdmin: !prevState.isCheckedAdmin, isOtherError: false
          };
        });
      }
      onPressOther() {
        this.setState({otherRoleDescription:'', isOtherError: false});
        this.setState((prevState) => {
          return {
            isCheckedOther: !prevState.isCheckedOther
          };
        });
      }
      onChangeTextOtherRoleDescription(text){
        this.setState({otherRoleDescription:text, isOtherError: false});
      }
      renderCheckBox(name, isChecked, onPress){
        return(
          <ButtonWithIcon
            iconSize={22}
            name={name}
            iconColor={isChecked? COLORS.checkIconColor:COLORS.cancelText}
            iconName={isChecked ? 'check-box-selected':'check-box-empty'}
            onPress={onPress}
            isLight={isChecked ? false: true}
            isSolid={isChecked ? true: false}
            textStyle={[TEXT_TYPE.H4,styles.checkButtonText]}
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
            source={require('../../assets/Images/profile.png')}
            style={styles.profileImage}
          />
        );
      }
      renderAddMemberModel(){
        const{
          data
        } = this.props;
        const {
          otherRoleDescription,
          isCheckedTrainer,
          isCheckedAdmin,
          isCheckedOther,
          isOtherError,
          otherError
        } = this.state;

        const name = _.has(data, 'name') ? data.name : '';
        const photoUrl = _.has(data, 'photo') ? data.photo : '';
        myLog('Photo U roleDescription', data);
        return(
          <View style={{paddingTop:Platform.OS === 'ios'? verticalScale(40): verticalScale(20),paddingHorizontal:verticalScale(20),backgroundColor:COLORS.white}}>
            <Text style={[TEXT_TYPE.H7,{fontFamily:FONT_FAMILY.BOLD,color:COLORS.textColor}]}>{stringsConvertor('session.addMember')}</Text>
            <View style={[styles.shadow1,styles.modelProfileView]}>
              {this.renderProfile(photoUrl)}
              <View style={{flex:1,paddingHorizontal:verticalScale(15),marginTop:verticalScale(10)}}>
                <Text numberOfLines={3} style={[TEXT_TYPE.H4,{color:COLORS.shadowColor,fontFamily:FONT_FAMILY.NORMAL,fontSize:verticalScale(18)}]}>{name}</Text>
              </View>
            </View>
            <Text style={[TEXT_TYPE.H10,{marginTop:verticalScale(10),color:COLORS.cancelText,fontSize:verticalScale(14)}]}>{stringsConvertor('session.selectRole')}</Text>
            <View style={{flexDirection:'row',marginTop:verticalScale(15)}}>
              {this.renderCheckBox(stringsConvertor('session.trainer'), isCheckedTrainer, this.onPressTrainer)}
              {this.renderCheckBox(stringsConvertor('session.admin'), isCheckedAdmin, this.onPressAdmin)}
              {this.renderCheckBox(stringsConvertor('session.other'), isCheckedOther, this.onPressOther)}
            </View>
            {isCheckedOther ?
              <TextInput
                style={[TEXT_TYPE.H2,styles.otherRoleDescriptionStyle]}
                textColor ={COLORS.shadowColor}
                value={otherRoleDescription}
                multiline={true}
                onChangeText={this.onChangeTextOtherRoleDescription}
              /> : null
            }
            {
              isOtherError ?
                <Text style={{color:COLORS.red,fontSize:11, textAlign:'center', marginVertical: verticalScale(10)}}>{otherError}</Text>
                : null
            }
            <View style={[styles.ModelBottomView,{ marginTop:verticalScale(10)}]}>
              <View style={{marginHorizontal: verticalScale(20)}}>
                <ButtonWithIcon
                  //containerStyle ={[styles.modelBottomButton,{backgroundColor:COLORS.cancelButtonText, alignItem:'center', justifyContent:'center'}]}
                  iconSize={verticalScale(30)}
                  iconColor={COLORS.red}
                  iconName='error'
                  onPress={this.onCancelPress}
                  isLight={true}
                />
              </View>
              <ButtonWithIcon
                //containerStyle ={[styles.modelBottomButton,{backgroundColor:COLORS.checkButton, alignItem:'center', justifyContent:'center'}]}
                iconSize={verticalScale(30)}
                iconColor={COLORS.greenTick}
                iconName='tick-icon'
                onPress={this.onSavePress}
                isLight={true}
              />
            </View>
          </View>
        );
      }
      render(){
        const {
          visible
        } = this.props;
        return(
          <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
          >
            <View style={{height: deviceHeight, backgroundColor:COLORS.modalBackground}}>
              <KeyboardAwareScrollView enableOnAndroid={true} style={{height:'100%'}}
                enableAutoAutomaticScroll={(Platform.OS === 'ios')} extraHeight={30} extraScrollHeight={40}
              >
                {this.renderAddMemberModel()}
              </KeyboardAwareScrollView>
            </View>
          </Modal>
        );
      }
}