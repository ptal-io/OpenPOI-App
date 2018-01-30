import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, FlatList } from "react-native";
import { Button, ListItem, List } from "react-native-elements";
import { StackNavigator } from 'react-navigation';
import PopupDialog from 'react-native-popup-dialog';
import styles from './style_poiscreen'

// POI DETAILS
export default class PoiScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      key: 'KL2RmYfnyEqS7nd00nGo5czG25qayHdF',
      error: null,
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
  }


  _doCheckin(id) {
    console.log(id);
    fetch('http://52.55.18.220:3000/addcheckin?user=1&poi='+id, {
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
    <View style={{flex:1, backgroundColor:'#fff'}}>
      <View style={{height:250, backgroundColor:'#fff'}}>
        <View style={{flexDirection: 'row', height:30}}>
          <Text style={styles.detailtext}>OPENPOI ID: </Text>
          <Text style={styles.valuetext}>{params.id} </Text>
          <Text style={styles.detailtext}>OSM CATEGORY: </Text>
          <Text style={styles.valuetext}>{params.cat} </Text>
        </View>
        <Text style={styles.instructions}>Add/edit attribute info using #key:value syntax.</Text>
        <TextInput
          autoFocus={true}
          multiline={true}
          style={styles.textinput}
          //placeholder={'#category:'}
          // onChangeText={(text) => console.log({text})}
          defaultValue='#category:'
        />
      </View>

      <View style={{flex:1}}>
        <View style={{flexDirection: 'row'}}>
          <Button
            raised
            icon={{name: 'compass', type: 'font-awesome'}}
            title='UPDATE POI'
            color='#fff'
            containerViewStyle={{flex:1, marginRight:2}}
            fontWeight='bold'
            backgroundColor='#55828b'
            onPress={() => this._doCheckin(params.id)} />
          <Button
            raised
            icon={{name: 'compass', type: 'font-awesome'}}
            title='CHECK-IN'
            color='#fff'
            fontWeight='bold'
            containerViewStyle={{flex:1, marginLeft:2}}
            backgroundColor='#c94c4c'
            onPress={() => this._doCheckin(params.id)} />
        </View>
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
        <PopupDialog 
          width={0.7}
          height={100}
          dialogStyle={{backgroundColor:'#55828b'}}
          overlayBackgroundColor='#333'
          ref={(popupDialog) => { this.popupDialog = popupDialog; }}
        >
          <View>
            <Text style={{margin:20, fontSize:20, color:'#fff', fontWeight:'bold'}}>Check-in Successful</Text>
          </View>
        </PopupDialog>
      </View>
      
    );
  }
}
