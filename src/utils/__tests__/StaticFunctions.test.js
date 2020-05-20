import {
  validateEmail,
  showAlert,
  myLog
} from '../StaticFunctions';
describe('validateEmail Function',()=>{
  it('validateEmail to check email is correct',()=>{
    const expectedValue = true;
    const inputValue = 'cdc@gmail.com';
    expect(
      validateEmail(inputValue)
    ).toEqual(expectedValue);
  });

  it('validateEmail to check email is Incorrect',()=>{
    const expectedValue = false;
    const inputValue = 'cdc.com';
    expect(
      validateEmail(inputValue)
    ).toEqual(expectedValue);
  });

});


describe('showAlert Function',()=>{
  it('showAlert the alert',()=>{
    expect(showAlert('Test','Alert test')).toEqual([{'text': 'OK'}]);
  });
});

describe('myLog Function',()=>{
  it('myLog called with single param',()=>{
    expect(myLog('Test')).toMatchSnapshot();
  });
});