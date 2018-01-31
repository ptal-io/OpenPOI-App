import React, { Component } from "react";
import { View, Text, FlatList, Image } from "react-native";
import { List, ListItem, SearchBar } from "react-native-elements";
import { StackNavigator } from 'react-navigation';


export default class HomeScreen extends Component {
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
    title: 'OPENPOI', //<Image source={require('../img/logo.png')}/>,
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
              containerStyle={{backgroundColor:'#3b6064'}}
              inputStyle={{backgroundColor:'#d7ecf1'}}
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