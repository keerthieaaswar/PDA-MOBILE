import AesUtil from '../AesUtil';
import { myLog } from '../StaticFunctions';

let cipherText = 'Qxd4/W7kTE59FFY6jcma4trSBdmmrQ8ew4zMS+B+JTvazlqAMQUg0DRoaWdV+AEc';

let plainText = '7c6394ea-c8c6-485f-9f70-f89752e6c65a';

describe('AesUtil', function() {
  it('encrypts', function() {
    let aesUtil = new AesUtil();
    //    var aesUtil = new AesUtil(keySize, iterationCount);
    let encrypt = aesUtil.encrypt(plainText);
    myLog('-----------encrypt------------>>', encrypt);
    expect(encrypt).toBe(cipherText);
  });
  it('decrypts 380f0a49-8f95-475a-9b26-693987e244ad', function() {

    let aesUtil = new AesUtil();
    //    var aesUtil = new AesUtil(keySize, iterationCount);
    let decrypt = aesUtil.decrypt(cipherText);
    myLog('------------decrypt----------->>', decrypt);
    expect(decrypt).toBe(plainText);
  });
});