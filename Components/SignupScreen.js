import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, FlatList, Modal, TouchableNativeFeedback, Keyboard } from "react-native";
import { Button } from "react-native-elements";
import { StackNavigator } from 'react-navigation';
import md5 from "react-native-md5";

import styles from './style_signup';

// POI DETAILS
export default class SignupScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: null,
      name: null,
      password: null,
      email: null,
      random: null
    };
  }
  
  static navigationOptions = ({ navigation }) => ({
    header: null
  });

  componentWillMount() {

  }

  doSignUp() {
    var hex_md5v = md5.hex_md5(Date.now() +"" );
    var pass = md5.hex_md5(this.state.password+"");
    console.log(hex_md5v);
    console.log(pass);

    var url = 'https://openpoi.org/signup/?username='+this.state.username+'&name='+this.state.name+'&email='+this.state.email+'&pass='+hex_md5v+pass;
    console.log(url);
    fetch(url, {
      method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      .then((response) => response.json())
      .then((responseJson) => {
        this.props.navigation.navigate('Login');
      })
      .catch((error) => {
        console.error(error);
      });
    
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
            underlineColorAndroid = 'transparent'
            onChangeText={(name) => this.setState({name})}
          />
          <TextInput 
            style={styles.txtinput}
            placeholder={'E-mail Address'}
            underlineColorAndroid = 'transparent'
            onChangeText={(email) => this.setState({email})}
          />
          <TextInput 
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
