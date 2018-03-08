import React, { Component } from "react";
import { View, Text, FlatList, Image, AppState, ActivityIndicator, Modal, Alert, TouchableOpacity, Animated } from "react-native";
import { List, ListItem, SearchBar } from "react-native-elements";
import { StackNavigator, DrawerItems } from 'react-navigation';
import { AsyncStorage } from 'react-native'

// import '../global.js'

import Drawer from 'react-native-drawer'
import LoginScreen from './LoginScreen';
import styles from './style_homescreen';


var isHidden = true;
var _baseurl = "openpoi.org";



export default class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      data: [],
      page: 1,
      latitude: 48.1883808,
      longitude: -122.1988266,
      key: 'KL2RmYfnyEqS7nd00nGo5czG25qayHdF',
      error: null,
      refreshing: false,
      searchResult: null,
      limit: 50,
      query: '',
      results: [],
      appState: AppState.currentState,
      session:null
    };
    this._handleResults = this._handleResults.bind(this);
  }

  static navigationOptions = {
    title: 'OPENPOI', //<Image source={require('../img/logo.png')}/>,
    headerStyle: {backgroundColor: '#55828b'},
    headerTintColor: '#fff',
    headerTitleStyle: {fontFamily:'monospace', fontSize:30, fontWeight:'bold'},
    headerLeft: (
        <TouchableOpacity onPress={() => 
          Alert.alert(
            'Coming Soon',
            'OpenPOI profile drawer on back order.',
            [
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            { cancelable: false }
          )

        }>
          <Image source={require('../img/menu.png')} style={{width:24, height:24, marginLeft:15}} />
        </TouchableOpacity>
      )
  };

  gpsError(error) {
    if (error == 'Location services are disabled') {
        Alert.alert(
          'Location Services are Disabled',
          'OpenPOI requires use of location services to function.  Please turn on location services and then restart the application.',
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          { cancelable: false }
        )
    }
  }


  getCurrentLocationYo() {
    console.log('Get Current Location')
    this.watchId = navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
        this.makeRemoteRequest();
        //this.refs.searchBar.focus();
      },
      (error) => {this.gpsError(error.message)},
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 30000},
    ); 
  }

  async _addItem () { 
    await AsyncStorage.setItem('grantname', 'test'); 
  } 

  async _getItem () { 
    response = AsyncStorage.getItem('grantname')
      .then((response) => { 
        console.log(response)
        return response; 
      })
    return 'hello';
  }


  _handleAppStateChange = (nextAppState) => {
    console.log("Handle App State Change: " + nextAppState)
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      this.setState({ loading: true });
      console.log('App has come to the foreground!');
      this.getCurrentLocationYo();
    }
    this.setState({appState: nextAppState});
  }


  componentWillMount() {
    console.log('Home Screen: Component Will Mount');

    try {
      AsyncStorage.getItem("openpoisession").then((value) => {
          console.log("HOME SCREEN:"+ value);
          // If the user is not logged in, send them to the login screen
          if (value == 'OPENNADA') {
            this.setState({loading: false });
            this.props.navigation.navigate('Login');
          } else {
              this.getCurrentLocationYo();
          }
              

      }).done();
    } catch (error) {
        console.log('error')
    }

    AppState.addEventListener('change', this._handleAppStateChange);
    console.log('end componentWillMount');
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');
    AppState.removeEventListener('change', this._handleAppStateChange);
    navigator.geolocation.clearWatch(this.watchId);
  }

  makeRemoteRequest() {
    const { page, latitude, longitude, key, limit, query } = this.state;
    const url = `https://openpoi.org/poi/nearby?lat=${latitude}&lng=${longitude}&key=${key}&offset=0&limit=${limit}&q=${query}`;
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
          this.setState({
            data: responseJson.data,
            error: responseJson.error || null,
            loading: false,
            refreshing: false,
            searchResult: null,
          });
          
      })
      .catch((error) => {
        console.error(error);
        this.setState({ error, loading: false });
      });
  };

  _handleResults(results) {
    this.setState({ query: results});
    this.makeRemoteRequest();
  }


  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={{ flex: 1}}>
        <Modal 
          transparent={true}
          visible={this.state.loading} 
          animationType={'none'}
          onRequestClose={() => {console.log('close modal')}}>
          <View style={styles.modalBackground}>
              <View style={styles.activityIndicatorWrapper}>
                <ActivityIndicator
                  animating={this.state.loading} />
              </View>
            </View>
        </Modal>
        <View style={{ backgroundColor: '#55828b',marginBottom:0}}>
           <SearchBar
              placeholder='Find Place of Interest'
              ref={(ref) => this.searchBar = ref}
              containerStyle={{backgroundColor:'#3b6064'}}
              inputStyle={{backgroundColor:'#d7ecf1'}}
              onChangeText={(text) => this._handleResults(text)}
            />
        </View>

        <View style={{ backgroundColor: '#333', flex: 1}}>
          <FlatList style={{backgroundColor:'#fff'}}
            data={this.state.data}
            extraData={this.state}
            keyExtractor={(item, index) => index}
            renderItem={({ item }) => (
              <ListItem
                onPress={() => navigate('PoiDetails', { name: item.osm_name, id: item.id, lat:item.osm_lat, lng:item.osm_lng, cat:item.osm_cat })}
                title={`${item.osm_name}`}
                subtitle={`${item.distance} ${item.direction}`}
                avatar={{ uri: item.avatar }}
                    />
                  )}
                />
        </View>
      </View>
    );
  }
}