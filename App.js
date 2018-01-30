/************************************************
  @author Grant McKenzie
  @date 28-01-2018
  @project OpenPOI.org app
  @page Entry for app
  @license Creative Commons

*************************************************/
import React, { Component } from "react";
import { StackNavigator } from 'react-navigation';
import HomeScreen from './Components/HomeScreen';
import PoiScreen from './Components/PoiScreen';

// Get rid of that annoying warnings box for prod app
console.disableYellowBox = true;

// Navigation - Screens
const OpenPOI = StackNavigator({
  Home: { screen: HomeScreen },
  PoiDetails: { screen: PoiScreen }
});

// Render the first screen
export default class App extends React.Component {
  render() {
    return <OpenPOI />;
  }
}







