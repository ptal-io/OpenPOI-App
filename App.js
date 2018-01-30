/************************************************
  @author Grant McKenzie
  @date 28-01-2018
  @project OpenPOI.org app
  @license Creative Commons

*************************************************/
import React, { Component } from "react";
import { Image, View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { List, ListItem, SearchBar, Button } from "react-native-elements";
import { StackNavigator } from 'react-navigation';
import PopupDialog from 'react-native-popup-dialog';

console.disableYellowBox = true;

// HOMESCREEN
class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
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
      results: []
    };
    this._handleResults = this._handleResults.bind(this);
  }

  static navigationOptions = {
    title: 'OPENPOI',
    headerStyle: {backgroundColor: '#55828b'},
    headerTintColor: '#fff',
    headerTitleStyle: {fontFamily:'monospace', fontSize:30, fontWeight:'bold'}
  };

  componentDidMount() {
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
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 30000},
    );
    
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  makeRemoteRequest = () => {
    const { page, latitude, longitude, key, limit, query } = this.state;
    //const url = `https://randomuser.me/api/?seed=1&page=1&results=20`;
    const url = `http://52.55.18.220/openpoi.org/h/nearby.php?lat=${latitude}&lng=${longitude}&key=${key}&limit=${limit}&q=${query}`;
    console.log(url);
    this.setState({ loading: true });
    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          data: page === 1 ? res.poi : [...this.state.data, ...res.poi],
          error: res.error || null,
          loading: false,
          refreshing: false,
          searchResult: null,
        });
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });
  };

  _handleResults(results) {
    console.log(results);

    this.setState({ query: results});
    this.makeRemoteRequest();
  }

  _details(id) {
    console.log(id);
  }


  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={{ flex: 1}}>
     
        <View style={{ backgroundColor: '#55828b',marginBottom:0}}>
           <SearchBar
              placeholder='Find Place of Interest'
              ref={(ref) => this.searchBar = ref}
              containerStyle={{backgroundColor:'#3b6064', border:0}}
              inputStyle={{backgroundColor:'#d7ecf1', border:0}}
              onChangeText={(text) => this._handleResults(text)}

            />
        </View>
        <View style={{ backgroundColor: '#333', flex: 1}}>

          <FlatList style={{backgroundColor:'#fff'}}
            data={this.state.data}
            extraData={this.state}
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

// POI DETAILS
class PoiDetails extends React.Component {
  
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.name}`,
    headerStyle: {backgroundColor: '#55828b'},
    headerTintColor: '#fff',
    headerTitleStyle: {fontSize:20, fontWeight:'normal'}
  });

  _doCheckin(id) {
    console.log(id);
    fetch('http://52.55.18.220/openpoi.org/h/checkin.php?key=KL2RmYfnyEqS7nd00nGo5czG25qayHdF&user=1&id='+id, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    this.popupDialog.show();
  }

  render() {
    const { params } = this.props.navigation.state;
    return (
    <View style={{flex:1}}>
      <View style={{flex:1, backgroundColor:'#fff'}}>
        <Text style={{fontSize:15,margin:15,fontWeight:'bold',color:'#55828b'}}>OPENPOI ID: {params.id}</Text>
        <Text style={{fontSize:15,margin:15,fontWeight:'bold',color:'#55828b'}}>CATEGORY: {params.cat}</Text>
        <Text style={{fontSize:15,margin:15,fontWeight:'bold',color:'#55828b'}}>LOCATION: {params.lat}, {params.lng}</Text>
        
        <Button
          raised
          icon={{name: 'compass', type: 'font-awesome'}}
          title='CHECK-IN'
          color='#fff'
          fontWeight='bold'
          backgroundColor='#c94c4c'
          onPress={() => this._doCheckin(params.id)} />

      <Text style={{fontSize:15,margin:15,fontWeight:'bold',color:'#55828b'}}>PREVIOUS CHECK-INS:</Text>

      </View>
        <PopupDialog 
          width={0.7}
          height={100}
          dialogStyle={{backgroundColor:'#55828b'}}
          overlayBackgroundColor='#333'
          ref={(popupDialog) => { this.popupDialog = popupDialog; }}
        >
          <View style={{textAlign:'center'}}>
            <Text style={{margin:20, fontSize:20, color:'#fff', fontWeight:'bold'}}>Check-in Successful</Text>
          </View>
        </PopupDialog>
      </View>
      
    );
  }
}


const SimpleApp = StackNavigator({
  Home: { screen: HomeScreen },
  PoiDetails: { screen: PoiDetails }
});

export default class App extends React.Component {
  render() {
    return <SimpleApp />;
  }
}


