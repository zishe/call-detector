/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, ListView, FlatList } from 'react-native';
import CallDetectorManager from 'react-native-call-detection'

let callDetector = undefined;

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props)
    // const ds = { rowHasChanged: (r1, r2) => r1 !== r2 };

    this.state = { callStates : [] }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>

        <Button
          onPress={this.startListenerTapped}
          title="Start Listener"
          color="#841584"
          style = {styles.bottomMargin}
        />
        <Button
          onPress={this.stopListenerTapped}
          title="Stop Listener"
          color="#841584"
          style = {styles.bottomMargin}
        />
        <FlatList
          data={this.state.callStates}
          renderItem={(rowData) => <Text style = {styles.callLogs}>{rowData}</Text>}
        />
      </View>
    );
  }

  startListenerTapped = () => {
    callDetector = new CallDetectorManager((event, number) => {
        var updatedCallStates = this.state.callStates
        updatedCallStates.push(event + ' - ' + number)
        this.setState({ callStates:  updatedCallStates });
      },
      true, // if you want to read the phone number of the incoming call [ANDROID], otherwise false
      ()=>{
        console.log('Permissions denied');
        
      }, // callback if your permission got denied [ANDROID] [only if you want to read incoming number] default: console.error
      {
        title: 'Phone State Permission',
        message: 'NativeLogger needs access to your phone state in order to react and/or to adapt to incoming calls.'
      } // a custom permission request message to explain to your user, why you need the permission [recommended] - this is the default one
    )
  }

  stopListenerTapped = () => {
    callDetector && callDetector.dispose();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
