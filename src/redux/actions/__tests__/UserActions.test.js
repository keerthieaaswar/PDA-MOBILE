import * as actions from '../UserActions';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { myLog } from '../../../utils/StaticFunctions';
import { GET_PROFILE_SUCCESS } from '../Types';
jest.mock('axios');
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('UserActions ', () => {

  it('user profile API get correct response', () =>{
    const email =  'pda@gmail.com';
    const store = mockStore({});
    return store.dispatch(actions.userProfileView(email,(status, message)=>{
      myLog('-------dispatch callback', status, message);
    })).then(() => {
      // return of async actions
      let response = store.getActions();
      response = response[0];

      myLog('-------action return callback',response);
      expect(response).not.toBeNull();
      expect(response).toBeDefined();
      expect(response).toHaveProperty('type');
      expect(response).toHaveProperty('payload');
      expect(response.type).toEqual(GET_PROFILE_SUCCESS);
      expect(response.payload).toHaveProperty('email');
      expect(response.payload).toHaveProperty('email','pda@gmail.com');
      expect(response.payload).toHaveProperty('firstName','abc');
      expect(response.payload).toHaveProperty('lastName','xyz');
      expect(response.payload).toHaveProperty('phone','1234567890');
      expect(response.payload).toHaveProperty('photo','http//abcd');
      expect(response.payload).toHaveProperty('qrCodeValue');
      expect(response.payload).toHaveProperty('salutation');

      // expect().toEqual();
    });
  });

  // it('user profile API get error when emailId empty', () =>{
  //   const email =  '';
  //   const store = mockStore({});
  //   const expectedActions = [];
  //   return store.dispatch(actions.userProfileView(email, (status,Message) =>{
  //     myLog('==============',status,Message);
  //   })).then(() =>()=>{
  //     const response = store.getActions();
  //     myLog('???????????????????', response);
  //     expect(response).toEqual(expectedActions);
  //   });
  // });

  // it('userSignIn API Get Correct response', () => {
  //   const params = {
  //     userName:'test@gmail.com',
  //     password : '123456',
  //     grantType:'password',
  //   };
  //   const store = mockStore({});
  //   const expectedActions = [];
  //   return store.dispatch(actions.userSignIn(params, (status, message)=>{
  //     myLog('??????????????????? status, message', status, message);
  //   } )).then(()=>{
  //     const response = store.getActions();
  //     myLog('???????????????????', response);
  //     expect(response).toEqual(expectedActions);
  //   });

  // assert axios();
  // expect(axios).toBeCalledWith({ url: endpoint, method, data});
  // });

  // describe('callApi()', () => {
  //   it('calls `axios()` with `endpoint`, `method` and `body`', async(done) => {
  //     const data =  {
  //       'email': '',
  //       'firstName': 'pda_LLp',
  //       'lastName': 'mani',
  //       'password': '3d9vwW2TZ7DUIhIQ1n9rZBKref484uQs8Y2GDLUVT5M=',
  //       'salutation': 'Mr.',
  //     };
  //     const store = mockStore({});
  //     const expectedActions = [];

  //     return store.dispatch(actions.userSignup(URL.SIGN_UP, data)).then(()=>{
  //       expect(store.getActions()).toEqual(expectedActions);
  //     });

  //     // assert axios()
  //     // expect(axios).toBeCalledWith({ url: endpoint, method, data});
  //   });
  //   it('call `axios()` with the response error', ()=>{
  //     const data = {
  //       'email': '',
  //       'firstName': '',
  //       'lastName': '',
  //       'password': '',
  //       'salutation': '',
  //     };
  //     const store = mockStore({});
  //     const expectedActions = [];
  //     return store .dispatch(actions.userSignup(URL.SIGN_UP, data)).then(() =>{
  //       expect(store.getActions()).toEqual(expectedActions);
  //     });
  //   });
  // });
});
