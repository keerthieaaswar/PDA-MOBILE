import ReactNative from 'react-native';
import I18n from 'react-native-i18n';
import moment from 'moment';

// Import all locales
import en from '../assets/locales/en.json';

// Should the app fallback to English if user locale doesn't exists
I18n.fallbacks = true;

// Define the supported translations
I18n.translations = {
  en
};

const currentLocale = I18n.currentLocale();

// Is it a RTL language?
export const isRTL = currentLocale.indexOf('he') === 0 || currentLocale.indexOf('ar') === 0;

// Allow RTL alignment in RTL languages
ReactNative.I18nManager.allowRTL(isRTL);

// Localizing moment js to Hebrew or English
if (currentLocale.indexOf('he') === 0) {
  require('moment/locale/he.js');
  moment.locale('he');
} else {
  moment.locale('en');
}


// The method we'll use instead of a regular string
export function stringsConvertor(name, params = {}) {
  return I18n.t(name, params);
}

export default I18n;