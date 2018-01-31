import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, FlatList, Modal, TouchableNativeFeedback, Keyboard } from "react-native";
import { Button, ListItem, List } from "react-native-elements";
import { StackNavigator } from 'react-navigation';
import styles from './style_poiscreen';

// POI DETAILS
export default class PoiScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      key: 'KL2RmYfnyEqS7nd00nGo5czG25qayHdF',
      error: null,
      tags: '',
      category: '',
      isModalVisible: false,
      refreshing: false,
    };
  }
  
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.name}`,
    headerStyle: {backgroundColor: '#55828b'},
    headerTintColor: '#fff',
    headerTitleStyle: {fontSize:20, fontWeight:'normal'}
  });

  componentWillMount() {
    var url = 'http://52.55.18.220:3000/getcheckins?poi='+this.props.navigation.state.params.id;
    this.setState({category:this.props.navigation.state.params.cat});

    //console.log(this.props.navigation.state);
    console.log(url);
    this.setState({ loading: true });
    fetch(url)
      .then(response => response.json())
      .then(response => {
        console.log(response.result[0]);
        this.setState({
          data: response.result,
          error: response.error || null,
          loading: false,
          refreshing: false,
          searchResult: null,
        });
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });

    // GET CATEGORY.  To Do: combine this with getcheckins and other data.
    var url = 'http://52.55.18.220:3000/getcategory?poi='+this.props.navigation.state.params.id;
    fetch(url)
      .then(response => response.json())
      .then(response => {
        console.log(response);
        this.setState({
          category: response[0].cat,
          error: response.error || null,
          loading: false,
          refreshing: false,
          searchResult: null,
        });
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });
  }

  // CHECK-IN CURRENT USER
  doCheckin(id, lat, lng) {

    console.log(lat);
    fetch('http://52.55.18.220:3000/addcheckin?user=1&poi='+id+"&lat="+lat+"&lng="+lng, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      .then((response) => response.json())
      .then((responseJson) => {
        
        this.props.navigation.goBack();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // UPDATE POI WITH TAGS
  addTags(id) {
    console.log(this.state.tags);
    var tags = this.state.tags.replace(":","=").replace("#","&");
    var newcat = tags.split("=");
    console.log(tags);
    var url = 'http://52.55.18.220:3000/addtags?user=1&poi='+id+tags;
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
        this.setState({category:newcat[1]});
        this.props.navigation.goBack();
      })
      .catch((error) => {
        console.error(error);
      });
    
  }

  render() {
    const { params } = this.props.navigation.state;

    console.log(params);

    return (
    <View style={{flex:1, backgroundColor:'#fff'}}>
      <View style={{height:250, backgroundColor:'#fff'}}>
        <View style={{flexDirection: 'row', height:30}}>
          <Text style={styles.detailtext}>OPENPOI ID: </Text>
          <Text style={styles.valuetext}>{params.id} </Text>
          <Text style={styles.detailtext}>CATEGORY: </Text>
          <Text style={styles.valuetext}>{this.state.category} </Text>
        </View>
        <TextInput
          autoFocus={true}
          multiline={true}
          style={styles.textinput}
          //placeholder={'#category:'}
          // onChangeText={(text) => console.log({text})}
          defaultValue='#category:'
          onChangeText={(tags) => this.setState({tags})}
        />      
      </View>

      <View style={{flex:1}}>
        <TouchableNativeFeedback
          onPress={this._onPressButton}
          background={TouchableNativeFeedback.SelectableBackground()}>
        <View style={{flexDirection: 'row'}}>
          <Button
            raised
            icon={{name: 'compass', type: 'font-awesome'}}
            title='UPDATE POI'
            color='#fff'
            containerViewStyle={{flex:1, marginRight:2}}
            fontWeight='bold'
            backgroundColor='#55828b'
            onPress={() => this.addTags(params.id)} />
          <Button
            raised
            icon={{name: 'compass', type: 'font-awesome'}}
            title='CHECK-IN'
            color='#fff'
            fontWeight='bold'
            containerViewStyle={{flex:1, marginLeft:2}}
            backgroundColor='#c94c4c'
            onPress={() => this.doCheckin(params.id, params.lat, params.lng)} />
        </View>
        </TouchableNativeFeedback>
        <View style={{backgroundColor:'#fff'}}>
          <Text style={styles.detailtext}>PAST CHECK-INS</Text>
        </View>
          <FlatList style={{backgroundColor:'#fff'}}
            roundAvatar
            data={this.state.data}
            renderItem={({ item }) => (
              <ListItem 
                  roundAvatar
                  hideChevron={true}
                  title={`${item.userdetails[0].name}`}
                  subtitle={`${new Date(item.ts).toDateString() + " " + new Date(item.ts).getHours() + ":" + (new Date(item.ts).getMinutes()<10?'0':'') + new Date(item.ts).getMinutes()}`}
                  avatar={{ uri: item.userdetails[0].photo }}    
                />
                )}
            />
        </View>
      </View>
      
    );
  }
}
