/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import { Button, StyleSheet, View, Text} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import { Connection, Exchange, Queue } from 'react-native-rabbitmq';


const config = {
  host: '18.217.66.222',
  port: 5672,
  username: 'appUser',
  password: 'galaksity',
  virtualhost: 'vhost',
  ttl: 10000 // Message time to live,
  // ssl: true // Enable ssl connection, make sure the port is 5671 or an other ssl port
}
let connection = new Connection(config);
let queue;
let exchange;
let queueId = 'QueueID_' + new Date;
let connected = false;
let routing_key = queueId;// 'react-native-queue';
let exchange_name = 'react-native-exchange';
let properties = {
  expiration: 10000,
}

export function sendRabbitMQ() {

  console.log("start Rabbitmq middlewares");

  connection.connect();
  // store.dispatch(actions.connectRabbitAttempt({}));

  connection.on('error', (event) => {
    connected = false;
  });

  connection.on('connected', (event) => {
    console.log('connected', event);
    connected = true;

    queue = new Queue(connection, {
      name: queueId,
      durable: false,
      autoDelete: false,
      exclusive: false,
      consumer_arguments: { 'x-priority': 1 }
    });

    exchange = new Exchange(connection, {
      name: exchange_name,
      type: 'fanout',
      durable: false,
      autoDelete: false,
      exclusive: false,
      internal: false,
      confirm: true
    });

    queue.bind(exchange, queueId);

    // Receive one message when it arrives
    queue.on('message', (data) => { console.log("message", data) });

  });

  // const now = moment().format('YYYY-MM-DD HH:mm:ss');
  const testdata = {
    UserId: 22,
    LogDate: "01/01/2021 00:00:00",
    // LogDate: now,
    LogType: "Error",
    Code: 1025,
    Summary: "Connection refused.",
    Description: "Not able to reach api.galaksity.com",
    LogPath: "App.js",
    LineNumber: 258
  };

  // exchange.publish(json2Str(testdata), routing_key, properties);

}

export function json2Str(obj) {
  if (obj)
    return JSON.stringify(obj);
  else
    return '{}';
}

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
      </Text>
        <Button title='Send Que' />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
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
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
