
import CryptoJS from 'crypto-js';

let keySize = 128 / 32;
let iterationCount = 1000;

let iv = '';
let salt = '';
let passPhrase = '';

export default class AesUtil {
  generateKey(salt, passPhrase){
    let key = CryptoJS.PBKDF2(
      passPhrase,
      CryptoJS.enc.Hex.parse(salt),
      { keySize, iterations: iterationCount });
    return key;
  }
  encrypt(plainText){
    let key = this.generateKey(salt, passPhrase);
    let encrypted = CryptoJS.AES.encrypt(
      plainText,
      key,
      { iv: CryptoJS.enc.Hex.parse(iv) });
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  }
  decrypt(cipherText){
    let key = this.generateKey(salt, passPhrase);
    let cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(cipherText)
    });
    let decrypted = CryptoJS.AES.decrypt(
      cipherParams,
      key,
      { iv: CryptoJS.enc.Hex.parse(iv) });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}

