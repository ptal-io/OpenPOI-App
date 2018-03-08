/************************************************
  @author Grant McKenzie
  @date 28-01-2018
  @project OpenPOI.org app
  @page Entry for app
  @license Creative Commons

*************************************************/
import React, { Component } from "react";
import { StackNavigator, DrawerNavigator } from 'react-navigation';
import { AsyncStorage } from 'react-navigation';
import LoginScreen from './Components/LoginScreen';
import SignupScreen from './Components/SignupScreen';
import HomeScreen from './Components/HomeScreen';
import PoiScreen from './Components/PoiScreen';
// import './global.js'

// Get rid of that annoying warnings box for prod app
console.disableYellowBox = true;



// Navigation - Screens
const OpenPOI = StackNavigator({
  Home: { screen: HomeScreen },
  PoiDetails: { screen: PoiScreen },
  Login: { screen: LoginScreen }
});


const DrawerWrapper = DrawerNavigator ({
    Home: {screen: OpenPOI },
    Logout: { screen: LoginScreen }
});


// Render the first screen
export default class App extends React.Component {
  render() {
    return <DrawerWrapper />;
  }
}







