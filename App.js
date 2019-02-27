/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import CallDetectorManager from 'react-native-call-detection';
import { PermissionsAndroid } from 'react-native';
import { Button, Container, Content, List, Header, Text, ListItem } from 'native-base';

let callDetector = undefined;

async function requestPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
      {
        title: 'Need App Permission',
        message: 'Cool Photo App needs access to your camera ',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the camera');
      return true;
    } else {
      console.log('Camera permission denied');
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
}

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props)
    this.state = { callStates : [] }
  }

  render() {
    return (
      <Container>
        <Header />
        <Content>
          <Button success onPress={this.startListenerTapped}><Text> Start Listener </Text></Button>
          <Button danger onPress={this.stopListenerTapped}><Text> Stop Listener </Text></Button>
          <List>
            {this.state.callStates.forEach(rowData => {
              return (
                <ListItem>
                  <Text>{rowData}</Text>
                </ListItem>
              );
            })}
          </List>
        </Content>
      </Container>
    );
  }

  startListenerTapped = () => {
    const result = requestPermission();
    console.log(result);

    callDetector = new CallDetectorManager((event, number) => {
        this.setState({ callStates:  [...this.state.callStates, `${event} - ${number}`] });
        console.log(`new event:  ${event}  -  ${number}`);
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
