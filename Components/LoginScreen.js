import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, TouchableNativeFeedback } from "react-native";
import { Button } from "react-native-elements";
import { StackNavigator } from 'react-navigation';
import { AsyncStorage } from 'react-native'

import md5 from "react-native-md5";
import styles from './style_signup';


// LOGIN SCREEN
export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: null,
      password: null,
      session: null,
      random: null,
      error: null
    };
  }
  
  static navigationOptions = ({ navigation }) => ({
    header: null
  });

  componentWillMount() {

    // Set session key to NOTHING when login screen loads (this is logging out)
    AsyncStorage.setItem("openpoisession", 'OPENNADA');
    AsyncStorage.setItem("openpoiuserid", '0');
    this.state.session = 'OPENNADA';

    // As a sanity check, make sure we are actually logged out
    try {
      AsyncStorage.getItem("openpoisession").then((value) => {
          console.log("LOGIN SCREEN (initial):"+ value);
      }).done();
    } catch (error) {
        console.log('error')
    }

    let hex_md5v = md5.hex_md5(Date.now() +"" );
    this.setState({random: hex_md5v});
    this.setState({session: null});
  }

  doLogin() {
    this.setState({error:''});
    var pass = md5.hex_md5(this.state.password+"");
    var url = 'https://openpoi.org/user/login?user='+this.state.username+'&pass='+this.state.random+pass;
    // console.log(url);
    fetch(url, {
      method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      .then((response) => response.json())
      .then((responseJson) => {
          // If there is a user found with those credentials...
          if (responseJson.lastErrorObject.n == 1) {

            // set session key
            this.setState({session:responseJson.session});
            AsyncStorage.setItem("openpoisession", this.state.session);
            AsyncStorage.setItem("openpoiuserid", responseJson.value.id+"");
            AsyncStorage.setItem("openpoiusername", responseJson.value.username);

            // hack to ensure that session key is actually set before going to the home screen
            try {
              AsyncStorage.getItem("openpoisession").then((value) => {
                  console.log("LOGIN SCREEN:"+ value);
                  this.props.navigation.navigate('Home');
              }).done();
            } catch (error) {
                console.log('error')
            }
     
          } else {
            this.setState({session:'error'});
            this.setState({error:'Check Credentials'});
          }

          //console.log(this.state.session);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // REDIRECT TO SIGN UP PAGE
  redirectSignUp() {
    this.props.navigation.navigate('SignUp');
  }

  render() {

    return (
      <View style={{flex:1, backgroundColor:'#55828b'}}>
        <View style={{height:450, alignItems:'center',justifyContent:'center'}}>
          <View style={{width:300}}>
            <Text style={styles.title}>SIGN IN</Text>
          </View>
          <TextInput 
            autoFocus={true}
            style={styles.txtinput}
            placeholder={'Username'}
            underlineColorAndroid = 'transparent'
            onChangeText={(username) => this.setState({username})}
          />
          <TextInput 
            style={styles.txtinput}
            placeholder={'Password'}
            secureTextEntry={true}
            underlineColorAndroid = 'transparent'
            onChangeText={(password) => this.setState({password})}
          />
          <TouchableNativeFeedback
            onPress={this._onPressButton}
            background={TouchableNativeFeedback.SelectableBackground()}>
            <View style={{flexDirection: 'row'}}>
              <Button
                raised
                icon={{name: 'compass', type: 'font-awesome'}}
                title='SIGN IN'
                color='#fff'
                fontWeight='bold'
                containerViewStyle={{width:300, marginTop:3}}
                backgroundColor='#3b6064'
                onPress={() => this.doLogin()} />
            </View>
          </TouchableNativeFeedback>
          <View style={{marginTop:5, height:30, width:300}}>
            <View style={{flex:1, flexDirection:'row'}}>
              <View style={{flex:1}}>
                <Text style={[styles.disc, {textDecorationLine:'none', color:'#c94c4c', fontWeight:'bold'}]}>{this.state.error}</Text>
              </View>
              <TouchableNativeFeedback
                onPress={this._onPressButton}
                background={TouchableNativeFeedback.SelectableBackground()}>
                <View style={{flex:1}}>
                  <Text style={[styles.disc, {alignSelf: 'flex-end'}]} onPress={() => this.redirectSignUp()}>Sign Up</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
          </View>
        </View>
      </View>
        
    );
  }
}
