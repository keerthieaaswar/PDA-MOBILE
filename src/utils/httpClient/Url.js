/**
 * pda
 * Url.js
 * @author PDA
 * @description Created on 27/02/2019
 * Copyright © 2019 pda. All rights reserved.
 */
import awsConfigDev from '../../assets/awsConfigDev.json';
import awsConfigProduction from '../../assets/awsConfigProduction.json';
import awsConfigStageDoc from '../../assets/awsConfigStageDoc.json';
//  Local Server
// export const isDevelopment = true;
//  export const BASE_URL = '';

// Dev Server
// export const isDevelopment = true;
// export const BASE_URL = '';
// export const AWS_CONFIG = {
//   accessKey: awsConfigDev.accessKey,
//   secretKey: awsConfigDev.secretKey,
//   bucket: awsConfigDev.bucket,
//   keyPrefix: awsConfigDev.keyPrefix,
//   region: awsConfigDev.region
// };
// Stage
// export const isDevelopment = true;

// Production
export const isDevelopment = true;
export const BASE_URL = '';
export const AWS_CONFIG = {
  accessKey: awsConfigProduction.accessKey,
  secretKey: awsConfigProduction.secretKey,
  bucket: awsConfigProduction.bucket,
  keyPrefix: awsConfigProduction.keyPrefix,
  region: awsConfigProduction.region
};
export const awsConfigDocument = {
  accessKey: awsConfigStageDoc.accessKey,
  secretKey: awsConfigStageDoc.secretKey,
  bucket: awsConfigStageDoc.bucket,
  keyPrefix: awsConfigStageDoc.keyPrefix,
  region: awsConfigStageDoc.region
};

export const URL = {
  OAUTH : 'user/generate-access-token',
  SIGN_IN:'user/login',
  SIGN_UP :'user/register',
  RESEND_OTP :'user/send-otp',
  VALIDATE_OTP:'user/validate-otp',
  SET_PASSWORD:'user/set-password',
  FORGOT_PASSWORD:'user/forgot-password',
  SIGN_OUT : 'user/logout',
  VIEW_PROFILE: 'user/get-profile',
  UPDATE_PROFILE : 'user/update-profile',
  UPDATE_EMAIL:'user/update-email-id',
  UPDATE_PHONE:'user/update-phone-number',
  VERIFY_OTP :'user/send-otp-new-phone',
  COUNTRY_CODE_LIST : 'user/get-country-codes',
  RESEND_EMAIL:'user/resend-verify-email',
  DEACTIVATE_ACCOUNT:'user/change-status',
  CHANGE_PASSWORD:'user/change-password',
  SCAN_USER:'session/user/get-user-details',
  SESSION_SUBMIT:'session/submit',
  SESSION_CREATE: 'session/create',
  SESSION_UPDATE: 'session/update',
  SESSION_ADD_MEMBER: 'session/member/add',
  SESSION_UPDATE_MEMBER: 'session/member/update',
  SESSION_DELETE_MEMBER:'session/member/remove',
  SESSION_LIST:'session/list',
  SESSION_DELETE: 'session/delete/',
  ADD_TOPIC:'session/topic/',
  SESSION_INFO_DETAILS: 'session/get-complete-session-information/',
  ATTESTATION_LIST:'session/my-attestations-session-info',
  ATTESTATION_INFO_DETAILS:'session/get-session-info-attestation',
  TRAININGORGANIZATIONLIST: 'entity/orgs',
  ATTESTATIONLIST: 'attestations/org',
  SCAN_IN_OUT:'session/attendance',
  NOTIFICATION_UN_READ_COUNT:'session/notifications/unReadCount',
  NOTIFICATION_LIST:'/session/notifications',
  NOTIFICATION_UPDATE_STATUS:'session/notifications/status',
  NOTIFICATION_UPDATE_PHOTO: 'user/update-photo',
  ENTITY_TELEMETRY:'entity/telemetry',
  UPDATE_APP:'user/versionCheckUpdate',
  UPDATE_ADDITIONAL_LINK: 'session/link/',
  DELETE_ADDITIONAL_LINK: 'session/link/',
  SHARE_PII_PROFILE: 'user/update-pii/status',
  GET_LINKEDPROGRAM:'session/link/programs',
  ADD_QUALIFICATION:'user/qualification/add',
  GET_USERQUALIFICATION:'user/qualification',
  UPDATE_QUALIFICATION:'user/qualification/update/',
  DELETE_QUALIFICATION:'user/qualification/',
  UPDATE_BASE_LOCATION:'user/location',
  DELETE_BASE_LOCATION:'user/location',
  GETCONSENTINFO:'user/consent/'
};
