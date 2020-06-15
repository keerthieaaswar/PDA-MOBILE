/**
 * pda
 * pdaStyleSheet.js
 * @author Socion Advisors LLP
 * @description Created on 27/02/2019
 * Copyright © 2019 pda. All rights reserved.
 */

import {
  Platform,
  StyleSheet,
  Dimensions
} from 'react-native';
import DeviceInfo from 'react-native-device-info';

export const deviceWidth = Dimensions.get('window').width;
export const deviceHeight = Dimensions.get('window').height;


//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const scale = (size) => deviceWidth / guidelineBaseWidth * size;
export const verticalScale = (size) => deviceHeight / guidelineBaseHeight * size;
export const horizontalScale = (size) => deviceWidth / guidelineBaseWidth * size;
const moderateScale = (size, factor = 0.5) => size + ( scale(size) - size ) * factor;


export const pdaStyleSheet = StyleSheet.create({
  toolbarPaddingTop : (Platform.OS === 'ios') ? (DeviceInfo.hasNotch() ) ? 37 : 20 : 0
});


export const FONT_FAMILY = {
  LIGHT: 'Roboto-Light',
  NORMAL: 'Roboto-Regular',
  SEMI_BOLD: 'Roboto-Medium',
  BOLD: 'Roboto-Bold',
  THIN: 'Roboto-Thin'
};

export const TEXT_SIZE =  Object.freeze({
  EXTRA_SMALL : moderateScale(12),
  SMALL : moderateScale(14),
  NORMAL : moderateScale(15),
  MEDIUM : moderateScale(16),
  LARGE : moderateScale(17),
  EXTRA_LARGE : moderateScale(18),
  EXTRA_LARGE_2X : moderateScale(20),
  EXTRA_LARGE_3X : moderateScale(22),
  EXTRA_LARGE_4X : moderateScale(24),
  EXTRA_LARGE_5X : moderateScale(26),
  EXTRA_LARGE_6X : moderateScale(36),
  BADGE_TEXT : moderateScale(14.5),
  TOOLBAR_TITLE:moderateScale(18)
});


export const TEXT_TYPE = {
  H0: {
    fontSize: moderateScale(8),
    fontFamily: FONT_FAMILY.NORMAL,
    fontStyle: 'normal',
    fontWeight: 'normal'
  },
  H1: {
    fontSize: TEXT_SIZE.EXTRA_SMALL,
    fontFamily: FONT_FAMILY.NORMAL,
    fontStyle: 'normal',
    fontWeight: 'normal'
  },
  H2: {
    fontSize: TEXT_SIZE.SMALL,
    fontFamily: FONT_FAMILY.NORMAL,
    fontStyle: 'normal',
    fontWeight: 'normal'
  },
  H3: {
    fontSize: TEXT_SIZE.NORMAL,
    fontFamily: FONT_FAMILY.NORMAL,
    fontStyle: 'normal',
    fontWeight: 'normal'
  },
  H4: {
    fontSize: TEXT_SIZE.MEDIUM,
    fontFamily: FONT_FAMILY.NORMAL,
    fontStyle: 'normal',
    fontWeight: 'normal'
  },
  H5: {
    fontSize: TEXT_SIZE.LARGE,
    fontFamily: FONT_FAMILY.NORMAL,
    fontStyle: 'normal',
    fontWeight: 'normal'
  },
  H6: {
    fontSize: TEXT_SIZE.EXTRA_LARGE,
    fontFamily: FONT_FAMILY.NORMAL,
    fontStyle: 'normal',
    fontWeight: 'normal'
  },
  H7: {
    fontSize: TEXT_SIZE.EXTRA_LARGE_2X,
    fontFamily: FONT_FAMILY.NORMAL,
    fontStyle: 'normal',
    fontWeight: 'normal'
  },
  H8: {
    fontSize: TEXT_SIZE.EXTRA_LARGE_3X,
    fontFamily: FONT_FAMILY.NORMAL,
    fontStyle: 'normal',
    fontWeight: 'normal'
  },
  H9: {
    fontSize: TEXT_SIZE.EXTRA_LARGE_3X,
    fontFamily: FONT_FAMILY.NORMAL,
    fontStyle: 'normal',
    fontWeight: 'normal'
  },
  H10: {
    fontSize: TEXT_SIZE.EXTRA_LARGE_4X,
    fontFamily: FONT_FAMILY.NORMAL,
    fontStyle: 'normal',
    fontWeight: 'normal'
  },
  H11: {
    fontSize: TEXT_SIZE.EXTRA_LARGE_5X,
    fontFamily: FONT_FAMILY.NORMAL,
    fontStyle: 'normal',
    fontWeight: 'normal'
  },
  H12: {
    fontSize: TEXT_SIZE.EXTRA_LARGE_6X,
    fontFamily: FONT_FAMILY.NORMAL,
    fontStyle: 'normal',
    fontWeight: 'normal'
  }
};

