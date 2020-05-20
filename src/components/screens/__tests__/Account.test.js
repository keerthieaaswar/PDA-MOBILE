import React from 'react';
import renderer from 'react-test-renderer';
import Account from '../Account';
jest.mock('../../../utils/StaticFunctions');
jest.mock('react-native-device-info');
describe('Account Page Component',()=>{
  beforeEach(()=>{
  });
  describe('Account Page Component rendering',()=>{

    it('Check Account render without break', () =>{
      const tree = renderer.create(<Account/>).toJSON();
      expect(tree).toBeTruthy();
    });

    it('Account Component should render ',()=>{
      const snap = renderer.create(<Account/>);
      expect(snap.toJSON()).toMatchSnapshot();
    });
  });
});