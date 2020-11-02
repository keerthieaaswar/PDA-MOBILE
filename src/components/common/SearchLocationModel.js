/**
 * pda
 * AddTopicModel.js
 * @author PDA
 * @description Created on 11/06/2019
 * Copyright © 2019 pda. All rights reserved.
 */
import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Modal,
  SafeAreaView,
  Platform,
  TextInput,
  ScrollView
} from 'react-native';
import { verticalScale, deviceHeight, horizontalScale } from '../../theme/pdaStyleSheet';
import PropTypes from 'prop-types';
import { myLog, validateText } from '../../utils/StaticFunctions';
import { stringsConvertor } from '../../utils/I18n';
import { COLORS } from '../../constants/Color';
import ButtonWithIcon from './ButtonWithIcon';
import Spinner from 'react-native-spinkit';
import Ripple from './rippleEffect';
//import UNICODE from '../../assets/locales/unicode';

function elevationShadowStyle(elevation) {
  return {
    elevation,
    shadowColor: 'black',
    shadowOffset: { width: 3.5, height: 0.55 * elevation },
    shadowOpacity: 0.2,
    shadowRadius: 0.50 * elevation
  };
}
let UNICODE = {
  'ar' : /[\u0600-\u06FF]/,
  'iw' : /[\u0590-\u05FF]/,
  'bn' : /[\u0980-\u09FF]/,
  'de' : /[\u0370-\u03FF]/,
  'ka' : /[\u10A0-\u10FF]/,
  'th' : /[\u0E00-\u0E7F]/,
  'kn' : /[\u0C80-\u0CFF]/,
  'hi': /[\u0900-\u097F]/,
  'en' : /^[a-zA-Z]+$/,
  'el' : /[\u0900-\u097F]/,
  'ta' : /[\u0B80-\u0BFF]/,
  'ml' : /[\u0D00-\u0DFF]/,
  'te' : /[\u0C00-\u0C7F]/,
  'lo' : /[\u0E80-\u0EFF]/,
  'hy' : /[\u0530-\u058F]/,
  'mr' : /[\u0900-\u097F]/
  // add other languages here
};
const styles = StyleSheet.create({
  bottomButtomStyle:{
    paddingVertical: verticalScale(7),
    borderRadius:verticalScale(23),
    backgroundColor:'#00b14e',
    paddingHorizontal: horizontalScale(17)
  },
  box:{
    borderWidth: 0.5,
    borderColor: COLORS.gray,
    margin:verticalScale(5),
    borderRadius:verticalScale(15),
    marginTop: 0,
    padding:verticalScale(10)
  },
  searchBoxShadow:{
    ...elevationShadowStyle(5),
    backgroundColor:COLORS.white
  }
});
let locationArray = [];

export default class SearchLocationModel extends Component{
    static propTypes = {
      onCancelPress : PropTypes.func,
      onSavePress:PropTypes.func,
      visible: PropTypes.bool
    }
      static defaultProps = {
        onCancelPress : ()=>{},
        onSavePress:()=>{},
        visible: false
      }
      constructor(props){
        super(props);
        this.state={
          validationError:false,
          validationErrorMessage:'Search and select one location',
          searchText:'',
          isLoading:false,
          placeId:'',
          city:'',
          district:'',
          state:'',
          country:'',
          lat:'',
          long:'',
          noResult:false,
          noResultMessage:'',
          typeStart:false,
          firstTime:true,
          itemSelected:false,
          detectedLanguageCode:'en'
        };
        this.onCancelPress = this.onCancelPress.bind(this);
        this.onSearchPress= this.onSearchPress.bind(this);
        this.renderLocationSugetion=this.renderLocationSugetion.bind(this);
        this.onSaveLocationPress = this.onSaveLocationPress.bind(this);
        this.onChangeSearchText = this.onChangeSearchText.bind(this);
      }
      onCancelPress(){
        const{onCancelPress} = this.props;
        onCancelPress();
        locationArray = [];
        this.setState({searchText:'',placeId:'',city:'',district:'',state:'',country:'',lat:'',long:'',validationError:false,
          noResult:false,noResultMessage:'',typeStart:false,itemSelected:false,firstTime:true});
      }
      onSearchPress(){
        const {searchText} = this.state;
        const{searchApi} =this.props;
        Object.entries(UNICODE).forEach(([key, value]) => {
          if (value.test(searchText) == true){
            this.setState({detectedLanguageCode: key});
          }
        });
        if(searchText === '' || !validateText(searchText)){
          locationArray = [];
          this.setState({validationError:true,validationErrorMessage:'Make sure you have searched the location',searchText:''});
        } else{
          myLog('checkcheck');
          this.setState({isLoading:true,placeId:'',noResult:false,validationError:false},()=>{
            searchApi(searchText,(status,response)=>{
              if(status === 'OK'){
                locationArray=response;
                this.setState({isLoading:false,itemSelected:false});
              } else if(status === 'ZERO_RESULTS'){
                locationArray= [];
                this.setState({isLoading:false,noResult:true,noResultMessage:'No result found for this search'});
              } else{
                locationArray = [];
                this.setState({isLoading:false,noResult:true,noResultMessage:'Some error'});
              }
            }).catch((err)=>{this.setState({isLoading:false});});
          });
        }
      }
      onSaveLocationPress(){
        const{placeId,city,district,state,country,lat,long,firstTime} = this.state;
        myLog('====================in search model=========',city,district,state,country,lat,long);
        myLog('====================in search model2=========',this.props.data);
        const {onSavePress} = this.props;
        if((!firstTime || this.props.data.country === '') && placeId===''){
          this.setState({validationError:true,validationErrorMessage:'Make sure you have searched and selected the location'});
        } else {
          const data ={
            country,
            state,
            city,
            district,
            latitude:lat,
            longitude:long
          };
          onSavePress(!firstTime?data:this.props.data, ()=>{
            this.setState({searchText:'',placeId:'',city:'',district:'',state:'',country:'',lat:'',long:'',noResult:false,
              noResultMessage:'',validationError:false,firstTime:true, detectedLanguageCode:'en'});
            locationArray = [];
          });
        }
      }
      onSelectItemPress(description,place_id){
        this.setState({placeId:place_id});
        const{placeId,detectedLanguageCode} = this.state;
        const data={
          place_id,
          detectedLanguageCode
        };
        myLog('==================item pressed========',description,place_id);
        this.props.searchByPlaceIdApi(data,(status,response)=>{
          if(status === true){
            myLog('============response by place id',response);
            response.address_components.map((item)=>{
              if(item.types[0] === 'locality'){
                this.setState({city:item.long_name});
              }
              if(item.types[0] === 'administrative_area_level_2'){
                this.setState({district:item.long_name});
              }
              if(item.types[0] === 'administrative_area_level_1'){
                this.setState({state:item.long_name});
              }
              if(item.types[0] === 'country'){
                this.setState({country:item.long_name});
              }
            });
            const {location} = response.geometry;
            this.setState({lat:location.lat,long:location.lng,typeStart:false,firstTime:false,itemSelected:true});
          }
        }).catch((err)=>{});
      }
      invokeSearch(text){
        const{searchText} = this.state;
        if(text === searchText){
          this.onSearchPress();
        }
      }
      onChangeSearchText(searchText){
        if(searchText !== ' '){
          this.setState({searchText,validationError:false});
        }
        if(searchText.length >= 3){
          setTimeout(()=>{
            this.invokeSearch(searchText);
          },1500);
        }
      }
      renderSearchView(){
        const {searchText,typeStart,firstTime} =this.state;
        const {city,district,state,country} = firstTime ? this.props.data :this.state;
        return(
          <View style={{paddingTop:verticalScale(10),paddingHorizontal:verticalScale(5),backgroundColor:COLORS.white}}>
            <View style={{paddingVertical:typeStart ||(firstTime && this.props.data.country === '') ?verticalScale(0):verticalScale(10), borderColor: 'gray', borderWidth:verticalScale(.7),borderRadius:verticalScale(12),
              flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}
            >
              { (city === '' && district === '' && state === '' && country === '') || typeStart ?
                <View style={{flex:.80}}>
                  <TextInput
                    style={{paddingHorizontal:verticalScale(10)}}
                    value={searchText}
                    onChangeText={this.onChangeSearchText}
                    onSubmitEditing={()=>{this.onSearchPress();}}
                    placeholder={'Search here'}
                  />
                </View>:
                <Ripple style={{flex:.80,paddingHorizontal:verticalScale(10)}} onPress= {()=>this.setState({typeStart:true,placeId:'',firstTime:false})}>
                  {city === '' && district === '' && state === '' && country === '' ? null:
                    <Text style={{fontSize:verticalScale(14),fontFamily:'Roboto-Regular', color:'black'}}>
                      {city === '' ? null:<Text >{city}, </Text>}
                      {district === '' || city === district?null:<Text>{district}, </Text>}
                      {state === '' ? null :<Text >{state}, </Text>}
                      {<Text >{country}</Text>}
                    </Text>}
                </Ripple>
              }
              { searchText?<View style={{}}>
                <ButtonWithIcon
                  iconName ="search-icon"
                  iconSize ={25}
                  iconColor={'#9a9a9a'}
                  textStyle={{fontSize:verticalScale(10)}}
                  onPress={()=>{this.onSearchPress();}}
                />
              </View>: null}
            </View>
          </View>
        );
      }
      renderBottomButtons(){
        const{validationError,validationErrorMessage} = this.state;
        return(
          <View style={{paddingLeft:verticalScale(15)}}>
            {validationError ?
              <Text style ={{color:'red',marginTop:verticalScale(10),fontSize:14}}>{validationErrorMessage}</Text> :null
            }
            <View style={{flexDirection:'row',marginTop: validationError ? verticalScale(5) :verticalScale(30)}}>
              <View style ={{flex:0.40,  flexDirection:'row'}}>
                <View style={{marginRight:verticalScale(15)}} >
                  <ButtonWithIcon
                    iconName="close"
                    iconSize ={15}
                    iconColor={COLORS.white}
                    containerStyle={[styles.bottomButtomStyle,{backgroundColor:'red'}]}
                    onPress={this.onCancelPress}
                  />
                </View>
                <View>
                  <ButtonWithIcon
                    iconName="check-mark"
                    iconSize ={16}
                    iconColor={COLORS.white}
                    containerStyle={styles.bottomButtomStyle}
                    onPress={this.onSaveLocationPress}
                  />
                </View>
              </View>
              <View style={{flex:0.6,marginLeft:verticalScale(4),paddingTop:verticalScale(5)}}>
                <Text style ={{fontSize:verticalScale(9), lineHeight:verticalScale(14),fontFamily:'Roboto-Light'}} >{stringsConvertor('location.consentLocation')}</Text>
              </View>
            </View>
          </View>
        );
      }
      renderLocationSugetion(item){
        const {description, place_id} =item;
        const {placeId} = this.state;
        return(
          <View style ={{borderBottomWidth:verticalScale(.5),paddingVertical:verticalScale(4),backgroundColor:placeId === place_id ?COLORS.gray :null}}>
            <Ripple onPress={()=>{this.onSelectItemPress(description,place_id);}}>
              <Text>
                {item.description}
              </Text>
            </Ripple>
          </View>
        );

      }
      render(){
        const {
          visible
        } = this.props;
        const{isLoading,noResult,noResultMessage,typeStart,itemSelected,firstTime} = this.state;
        return(
          <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
          >
            <SafeAreaView style={{height: deviceHeight, backgroundColor:COLORS.modalBackground}}>
              <View style={{backgroundColor:COLORS.white, padding: 10}}>
                <View style={{position:'absolute', right: 5, top: 5, zIndex:10}}>
                  <ButtonWithIcon
                    iconSize={verticalScale(18)}
                    iconName="close"
                    isLight={true}
                    iconColor={'#000000'}
                    onPress={this.onCancelPress}
                  />
                </View>
                <View style={{flexDirection:'row',alignContent:'center',marginTop:verticalScale(2)}}>
                  <View style={{flex:.22}}>
                    <ButtonWithIcon
                      iconName={'aim'}
                      iconColor= {'#bb5048'}
                      iconSize = {24}
                      onPress={''}
                      disabledRipple={true}
                    />
                  </View>
                  <Text style={{fontSize:15, fontWeight:'600', color: COLORS.gray,marginTop:verticalScale(8)}}>BASE LOCATION</Text>
                </View>
                {/* <Text style={[TEXT_TYPE.H5,{fontFamily:FONT_FAMILY.BOLD,color:COLORS.textColor,alignSelf:'center'}]}>Search and select location</Text> */}
                {this.renderSearchView()}
                {!typeStart ? firstTime && this.props.data.country === '' ?  null:
                  <View style={{paddingHorizontal:verticalScale(25),paddingTop:verticalScale(10)}}>
                    <Text>{stringsConvertor('location.locationHint')}</Text>
                  </View>:null
                }
                {isLoading ?
                  <View style={{alignSelf:'center'}}>
                    <Spinner
                      color={COLORS.primaryColor}
                      type="Wave"
                      size={25}
                    />
                  </View>:null
                }
                {locationArray.length === 0 || itemSelected ? null:
                  <View style={[styles.searchBoxShadow,styles.box]}>
                    <ScrollView style ={{height:locationArray.length >= 4 ? verticalScale(160):locationArray.length >=3?verticalScale(100):
                      locationArray.length >=2 ? verticalScale(75) :verticalScale(45)}}contentContainerStyle={{flexGrow:1}}
                    >
                      {locationArray.map(this.renderLocationSugetion)}
                      <Text style={{color:COLORS.gray,textAlign:'right'}}>powered by Google</Text>
                    </ScrollView>
                  </View>
                }
                {noResult ?
                  <View style={[styles.searchBoxShadow,styles.box, {marginTop:verticalScale(15)}]}>
                    <Text>{noResultMessage}</Text>
                  </View>:null
                }
                {this.renderBottomButtons()}
              </View>
            </SafeAreaView>
          </Modal>
        );
      }
}
