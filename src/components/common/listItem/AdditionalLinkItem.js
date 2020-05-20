import React, { Component } from 'react';
import { Platform,StyleSheet,Text, View, Alert,Linking} from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { COLORS } from '../../../constants/Color';
import ButtonWithIcon from '../ButtonWithIcon';
import { myLog } from '../../../utils/StaticFunctions';
import { stringsConvertor } from '../../../utils/I18n';


export default class AdditionalLinkItem extends Component {

  static propTypes = {
    onDeletePress:PropTypes.func,
    showDeleteButton:PropTypes.bool
  }
static defaultProps = {
  onDeletePress:()=>{},
  showDeleteButton: true
}
constructor(props){
  super(props);

}
onDeletePress(id){
  const{ onDeletePress}= this.props;
  onDeletePress(id);
}

isInvokeDeleteUrl(id){
  Alert.alert(
    stringsConvertor('alert.remove'),
    stringsConvertor('alertMessage.urlDeleteConfirmation'),
    [
      {
        text: stringsConvertor('alert.no'),
        style: 'cancel'
      },
      {text: stringsConvertor('alert.yes'), onPress : ()=>{this.onDeletePress(id);}
      }
    ],
    {cancelable: true},
  );
}
loadInBrowser(){

}

renderAdditionalLinkView(item){
  const{
    showDeleteButton
  } = this.props;
  let url = item.sessionUrl;
  const uri = url === '' || url === null ? '' : url.includes('https://') || url.includes('http://')  ? url : `https://${url}`;

  return(
    <View style={{display: 'flex', flexDirection:'row', justifyContent:'space-between',alignItems:'center'}}>
      <View style={{flex:.84}}>
        <Text style={{color: COLORS.darkBlue,textDecorationLine:'underline', paddingBottom: 5,paddingLeft: 4}} numberOfLines={1} ellipsizeMode="tail"
          onPress={() =>Linking.openURL(`${uri}`)}
        >{item.sessionUrl}</Text>
      </View>
      <View style={{flex:.16}}>
        { showDeleteButton ?
          <ButtonWithIcon
            iconName = {'error'}
            iconSize={15}
            onPress={()=>{this.isInvokeDeleteUrl(item.id);}}
          /> : null }
      </View>
    </View>
  );
}


render() {
  const {
    item,
    index
  } = this.props;
  myLog('check ============', this.props);
  return (
    <View>
      {this.renderAdditionalLinkView(item, index)}
    </View>


  );
}
}
