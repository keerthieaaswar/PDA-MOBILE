import React, { Component } from 'react';
import { Platform,StyleSheet,Text, View, Image } from 'react-native';
import { verticalScale, TEXT_TYPE } from '../../../theme/pdaStyleSheet';
import { COLORS } from '../../../constants/Color';
import { convertToTitleCase, myLog } from '../../../utils/StaticFunctions';
import ProgressiveImage from '../ProgressiveImage';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Button from '../Button';
import ButtonWithIcon from '../ButtonWithIcon';
import { stringsConvertor } from '../../../utils/I18n';

let timeStamp = new Date();
const styles = StyleSheet.create({
  profileImage:{
    width: verticalScale(115),
    height:verticalScale(100)
  },
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderWidth: 0.5,
    borderColor: COLORS.memberContainer,
    borderRadius: 8,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
    overflow: 'hidden',
    marginVertical:10,
    marginHorizontal: 15
  },
  containerStyle : {
    paddingHorizontal: verticalScale(8),
    paddingVertical: verticalScale(5),
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:COLORS.white
  }
});
export default class MemberInfoItem extends Component {

  static propTypes = {
    item: PropTypes.object.isRequired,
    index: PropTypes.number,
    onEditPress:PropTypes.func,
    onDeletePress:PropTypes.func,
    type: PropTypes.string
  }
static defaultProps = {
  onEditPress: ()=>{},
  onDeletePress:()=>{},
  type: ''
}
constructor(props){
  super(props);
  this.state = {
    role:''
  };
  this.onDeletePress = this.onDeletePress.bind(this);
}
componentWillReceiveProps(){
  timeStamp = new Date();
}
onDeletePress(){

}
renderProfileView(image){
  if(image){
    const profileImage = Platform.OS === 'ios' ? {uri:image, CACHE: 'reload'}:{uri:`${image}?${new Date()}`};
    return (
      <Image
        testID = "profileImage"
        source={profileImage}
        style={styles.profileImage}
      />
    );
  }else{
    return (
      <ProgressiveImage
        source={require('../../../assets/Images/profile.png')}
        thumbnailSource={require('../../../assets/Images/profile.png')}
        style={styles.profileImage}
        resizeMode="cover"
      />
    );
  }
}

renderMembersDetailsView(item){
  const {onEditPress,type, onDeletePress} = this.props;
  let role = '';
  if (item.roles.admin === true) {
    role = 'Admin' ;
  }
  if (item.roles.trainer === true) {
    role = role.length !== 0 ? `${role  },${ ' Trainer'}`: 'Trainer';
  }
  if (item.roles.other === true) {
    role = role.length !== 0 ? `${role  }, ${item.roles.otherRoleNames}`: item.roles.otherRoleNames;
  }
  let photo = '';
  if (_.has(item, 'photo')) {
    photo = item.photo;
  }else if (_.has(item, 'photoUrl')) {
    photo = item.photoUrl;
  }
  const roleDescription = _.has(item.roleDescription, 'roleDescription') ? item.roleDescription : '';
  return(
    <View style={styles.container}>
      {this.renderProfileView(photo)}
      <View style={{flex:1,flexDirection:'column',marginTop:verticalScale(5),paddingHorizontal:15}}>
        <Text style={[TEXT_TYPE.H4,{color:COLORS.black}]} numberOfLines = {2}>{item.name}</Text>
        <Text style={[TEXT_TYPE.H1,{color:COLORS.borderColorEditProfile, paddingTop: roleDescription.length ===0 ? verticalScale(10):verticalScale(1)}]}>{convertToTitleCase(role)}</Text>
        {
          (roleDescription.length !== 0) ?
            <View>
              <View style={{marginTop:verticalScale(2),marginBottom:verticalScale(4)}}>
                <Text numberOfLines={2} style={[TEXT_TYPE.H1,{color:COLORS.borderColorEditProfile}]}>{roleDescription}</Text>
              </View>
            </View>
            :null
        }
      </View>
      {
        type === 'sessionCreate' ?
          <View style ={{flexDirection:'row', height:verticalScale(25),marginTop:verticalScale(5), alignItems:'center'}}>
            <Button
              containerStyle={styles.containerStyle}
              name = {stringsConvertor('listItem.edit')}
              textStyle= {[TEXT_TYPE.H1,{color:COLORS.sessionButton}]}
              onPress={onEditPress}
              isGradient={false}
              borderWidth= {0}
            />
            <ButtonWithIcon
              iconSize={verticalScale(8)}
              iconName="delete-notification-icon"
              iconColor={COLORS.sessionButton}
              onPress={onDeletePress}
              textStyle={[TEXT_TYPE.H0,{color:COLORS.sessionButton}]}
            />
          </View>
          : null
      }
    </View>
  );
}


render() {
  const {
    item,
    index
  } = this.props;
  return this.renderMembersDetailsView(item, index);
}
}
