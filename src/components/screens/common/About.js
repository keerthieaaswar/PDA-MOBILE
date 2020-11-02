/**
 * pda
 * About.js
 * @author PDA
 * @description Created on 09/06/2019
 * Copyright © 2019 pda. All rights reserved.
 */
import React, { Component } from 'react';
import {
  View,
  Text,
  Linking,
  ScrollView,
  StyleSheet
} from 'react-native';
import Toolbar from '../../common/Toolbar';
import NotificationBell from '../../../container/common/NotificationBell';
import { stringsConvertor } from '../../../utils/I18n';
import DeviceInfo from 'react-native-device-info';
import {verticalScale } from '../../../theme/pdaStyleSheet';
import { COLORS } from '../../../constants/Color';
import { isTrainerApp} from '../../../utils/StaticFunctions';

const styles = StyleSheet.create({
  mainViewStyle:{
    flex: 1,justifyContent:'center',
    paddingHorizontal:verticalScale(12),
    paddingVertical:verticalScale(12)
  },
  heading:{
    textAlign:'center',color: COLORS.shadowColor,
    textDecorationLine:'underline',paddingBottom:verticalScale(13),
    fontFamily:'times-new-roman',fontSize:verticalScale(21)
  },
  headingPara:{
    fontFamily:'times-new-roman',
    paddingBottom:verticalScale(10),color:COLORS.aboutText,
    fontSize:verticalScale(18),
    lineHeight:23
  },
  head1:{
    paddingBottom:verticalScale(10),
    color:COLORS.aboutText,fontSize:verticalScale(18.5),
    fontFamily:'times-new-roman',
    lineHeight:23
  },
  subHead1:{
    color:COLORS.aboutText,fontSize:verticalScale(18),
    fontFamily:'times-new-roman',
    lineHeight:23
  },
  subHead:{
    paddingBottom:verticalScale(10),color:COLORS.aboutText,
    fontSize:verticalScale(18.5),fontFamily:'times-new-roman',
    lineHeight:23
  },
  hyphenText:{
    color:COLORS.aboutText,
    fontFamily:'times-new-roman',
    fontSize:verticalScale(18),
    lineHeight:23
  }
});

class About extends Component {

  render(){
    return(
      <View style={{flex:1, backgroundColor:COLORS.white}}>
        <Toolbar isBack={true} title={stringsConvertor('screenTitle.about')}
          rightRender={
            <NotificationBell color={COLORS.white} />
          }
        />
        <ScrollView style={{backgroundColor:COLORS.white}}>
          <View style={[styles.mainViewStyle]}>
            <View>
              <Text style={[styles.heading]}>Participatory Digital Attestation (PDA) Application</Text>
              <Text style={[styles.headingPara]}>Participatory Digital Attestation (PDA) application has been imagined, conceptualized
            and designed by <Text style={{color:COLORS.flashLoadingBackground,fontWeight:'bold'}} onPress={() =>Linking.openURL('')}>pda </Text>
             to democratize the ability of individuals
            and agencies to attest skill building and other activities performed in the field, in a
            digitally verifiable manner, and generate attestations for the individuals for their ownership
            and consumption. These digitally verifiable attestations can help individual participants track
            and assert their qualifications in their pursuit of better (livelihood) opportunities. PDA
            platform can be used by individuals and any large agencies/missions/programs that are involved in solving
            large-scale societal challenges. </Text>
            </View>
            <View style={{paddingBottom:verticalScale(10)}}>
              <Text style={[styles.head1]}>PDA suite of applications consist of:</Text>
              <Text style = {[styles.subHead1]}>PDA Participant Application (mobile app)</Text>
              <Text style = {[styles.subHead1]}>PDA Trainer Application (mobile app version)</Text>
              <Text style = {[styles.subHead1]}>PDA Program Administration Portal (web app version)</Text>
            </View>
            <View style={{paddingBottom:verticalScale(10)}}>
              <Text style={[styles.subHead]}>PDA Participant application enables individual participants to</Text>
              <View style={{flexDirection:'row'}}>
                <Text style={[styles.hyphenText]}>- </Text>
                <Text style={[styles.hyphenText]}> use the app and digitally record their participation by scanning QR codes generated
              when sessions are set up by trainers using the Trainer Application.</Text>
              </View>
              <View style={{flexDirection:'row'}}>
                <Text style ={[styles.hyphenText]}>- </Text>
                <Text style={[styles.hyphenText]}> track their participation, receive attestation for sessions attended, and access
              content associated with each session through digital links embedded in the attestation.
              Participants can also view/ download content shared during each session.</Text>
              </View>
              <View style={{flexDirection:'row'}}>
                <Text style={[styles.hyphenText]}>- </Text>
                <Text style={[styles.hyphenText]}> Share their attestations and content with others in ways that makes it easy for the
              receiving party to view the attestations and related content.</Text>
              </View>
            </View>
            <View style={{paddingBottom:verticalScale(10)}}>
              <Text style={[styles.subHead]}>PDA Trainer application enables Trainers (authorized by participating programs) to</Text>
              <View style={{flexDirection:'row'}}>
                <Text style={[styles.hyphenText]}>- </Text>
                <Text style={[styles.hyphenText]}> Share their attestations and content with others in ways that makes it easy for the
              receiving party to view the attestations and related content.</Text>
              </View>
              <View style={{flexDirection:'row'}}>
                <Text style={[styles.hyphenText]}>- </Text>
                <Text style={[styles.hyphenText]}> Share their attestations and content with others in ways that makes it easy for the
              receiving party to view the attestations and related content.</Text>
              </View>
              <View style={{flexDirection:'row'}}>
                <Text style={[styles.hyphenText]}>- </Text>
                <Text style={[styles.hyphenText]}> Share their attestations and content with others in ways that makes it easy for the
              receiving party to view the attestations and related content.</Text>
              </View>
            </View>
            <View style={{paddingBottom:verticalScale(10)}}>
              <Text style={[styles.subHead]}>PDA Program Administration Portal enables authorized entity/program staff to</Text>
              <View style={{flexDirection:'row'}}>
                <Text style={[styles.hyphenText]}>- </Text>
                <Text style={[styles.hyphenText]}> create and manage the entity and program level information.</Text>
              </View>
              <View style={{flexDirection:'row'}}>
                <Text style={[styles.hyphenText]}>- </Text>
                <Text style={[styles.hyphenText]}> register and manage program related topics and content used in training sessions.</Text>
              </View>
              <View style={{flexDirection:'row'}}>
                <Text style={[styles.hyphenText]}>- </Text>
                <Text style={[styles.hyphenText]}> assign and manage different roles/privileges required for administering program
                related tasks like creating training topics and associated content, setup training sessions
                etc.</Text>
              </View>
              <View style={{flexDirection:'row'}}>
                <Text style={[styles.hyphenText]}>- </Text>
                <Text style={[styles.hyphenText]}> access aggregated data that helps in analyzing interactions and generate insights
                related to participation by session, topic, time, location etc.</Text>
              </View>
            </View>
            <View style={{flexDirection:'row'}}>
              <Text style={[styles.subHead]}> {isTrainerApp() ? stringsConvertor('alert.trainerApp') : stringsConvertor('alert.participantApp') } : </Text>
              <Text style={[styles.subHead]}> {DeviceInfo.getVersion()} </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

}


export default About;
