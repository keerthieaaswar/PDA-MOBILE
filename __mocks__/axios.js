import { axiosResponseMap } from './axiosReponseMock';
import { myLog } from '../src/utils/StaticFunctions';
let axios = jest.genMockFromModule('axios');

axios = {
  post: jest.fn((url, data) => {
    return new Promise((resolve, rejects)=>{ 
      axiosResponseMap(url, data, (status, response)=>{
        if (status) {
          resolve(response);
        }else{
          rejects(response);
        }
      });
    });
  }),
  
  get:jest.fn((url, config)=>{
    return new Promise((resolve, rejects)=>{
      axiosResponseMap(url, config, (status, response)=>{
        myLog('-------user---',status,response);
        if (status) {
          resolve(response);
        }else{
          rejects(response);
        } 
      });
    });
  }),

  create: () => axios,
  defaults: {
    adapter: {},
  },
  interceptors:{
    request:{
      use:jest.fn(),
    },
  },
};

export default axios;