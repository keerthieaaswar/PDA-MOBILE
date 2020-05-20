import React, { Component } from 'react';
import{
  View, Text
} from 'react-native';
import { COLORS } from '../../constants/Color';
import TextInput from './TextInput';
import { myLog } from '../../utils/StaticFunctions';
import { verticalScale, deviceWidth } from '../../theme/pdaStyleSheet';
import Button from './Button';

// const UNICODE = [
//   {min: parseInt('0000',16) , max :  parseInt('007F',16) , value:'L'},
//   {min:  parseInt('0900',16), max :  parseInt('097F',16) , value:'Hindi'},
//   {min:  parseInt('0100',16), max :   parseInt('017F',16), value:'N'}
// ];
let UNICODE = {
  'arabic' : /[\u0600-\u06FF]/,
  'persian' : /[\u0750-\u077F]/,
  'Hebrew' : /[\u0590-\u05FF]/,
  'Syriac' : /[\u0700-\u074F]/,
  'Bengali' : /[\u0980-\u09FF]/,
  'Ethiopic' : /[\u1200-\u137F]/,
  'Greek and Coptic' : /[\u0370-\u03FF]/,
  'Georgian' : /[\u10A0-\u10FF]/,
  'Thai' : /[\u0E00-\u0E7F]/,
  'Kannada' : /[\u0C80-\u0CFF]/,
  'Hindi': /[\u0900-\u097F]/,
  'English' : /^[a-zA-Z]+$/
  // add other languages here
};


class LanguageDetection extends Component {
  constructor(){
    super();
    this.state ={
      input:'',
      detectedValue :''
    };
    this.onChangeText = this.onChangeText.bind(this);
  }
  onChangeText(text){
    const{input} = this.state;
    this.setState({input: text});
    myLog('languageText',input);
    Object.entries(UNICODE).forEach(([key, value]) => {
      if (value.test(input) == true){
        myLog('lnaguageCheck',key);
        this.setState({detectedValue: key});
      }
    });
  }
  onDetectPress =() =>{
    const{ input} = this.state;
    myLog('MYText',input);
    // let name = input.charCodeAt(1);
    // myLog('convertedInput',name);
    // //let x =parseInt(name,8);
    // //let x =parseInt(name,8);
    // myLog('convertedInputAfterparsing',name, UNICODE);

    // let y= UNICODE.filter((value) => name> value.min && name< value.max );
    // this.setState({ detectedValue: y[0]});
    // myLog('check1', detectedValue.value);
    //let text = $('#userLocation').val().replace(/\s/g); // text from location input box
    //const keys = Object.entries(langdic); // read  keys and values from the dictionary
    Object.entries(UNICODE).forEach(([key, value]) => {
      if (value.test(input) == true){
        myLog('lnaguageCheck',key);
        this.setState({detectedValue: key});
      }
    });
  }


  render(){
    const {input,detectedValue} = this. state;
    myLog('LanguageText', input);
    return (
      <View style= {{flex:1, backgroundColor:'white', padding:20}}>
        <TextInput
          label= {'Enter Text'}
          baseColor={COLORS.gray}
          tintColor={COLORS.tintColor}
          textColor ={COLORS.phoneNumberTextColor}
          value={input}
          onChangeText={this.onChangeText}
        />
        <View style={{marginTop:verticalScale(25)}}>
          <Button
            containerStyle={{width: deviceWidth - 30}}
            name = {'Detect'}
            onPress={this.onDetectPress}
          />
        </View>
        <Text>{detectedValue}</Text>
      </View>
    );
  }

}
export default LanguageDetection;
