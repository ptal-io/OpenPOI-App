import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, FlatList, Modal, TouchableNativeFeedback, Keyboard } from "react-native";
import { Button } from "react-native-elements";
import { StackNavigator } from 'react-navigation';
import styles from './style_signup';

// POI DETAILS
export default class SignupScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: null,
      password: null,
      email: null
    };
  }
  
  static navigationOptions = ({ navigation }) => ({
    header: null
  });

  componentWillMount() {

  }

  doSignUp() {

  }

  render() {

    return (
      <View style={{flex:1, backgroundColor:'#55828b'}}>
        <View style={{height:450, alignItems:'center',justifyContent:'center'}}>
          <View style={{width:300}}>
            <Text style={styles.title}>SIGN UP</Text>
          </View>
          <TextInput 
            style={styles.txtinput}
            placeholder={'Name'}
            value={'Luke'}
            underlineColorAndroid = 'transparent'
          />
          <TextInput 
            style={styles.txtinput}
            placeholder={'Email'}
            value={'luke@skywalker.com'}
            underlineColorAndroid = 'transparent'
          />
          <TextInput 
            style={styles.txtinput}
            placeholder={'Username'}
            value={'luke'}
            underlineColorAndroid = 'transparent'
          />
          <TextInput 
            style={styles.txtinput}
            placeholder={'Password'}
            value={'pass'}
            secureTextEntry={true}
            underlineColorAndroid = 'transparent'
          />
          <TouchableNativeFeedback
            onPress={this._onPressButton}
            background={TouchableNativeFeedback.SelectableBackground()}>
            <View style={{flexDirection: 'row'}}>
              <Button
                raised
                icon={{name: 'compass', type: 'font-awesome'}}
                title='SIGN UP'
                color='#fff'
                fontWeight='bold'
                containerViewStyle={{width:300, marginTop:3}}
                backgroundColor='#3b6064'
                onPress={() => this.doSignUp()} />
            </View>
          </TouchableNativeFeedback>
        </View>
      </View>
        
    );
  }
}
