/**
 * pda
 * index.js
 * @author PDA
 * @description Created on 27/02/2019
 * Copyright © 2019 pda. All rights reserved.
 */

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import Store from './redux/Store';
import OfflineBar from './container/OfflineBar';
import NavigationRouter from './navigation';
import {
  StatusBar
} from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { COLORS } from './constants/Color';


export default class App extends Component {
  render() {
    return (
      <Provider store={Store}>
        <NavigationRouter />
        <OfflineBar style={{position:'absolute'}}/>
        <FlashMessage position="top"/>
        <StatusBar color= {COLORS.moreInfoColor}/>
      </Provider>
    );
  }
}
