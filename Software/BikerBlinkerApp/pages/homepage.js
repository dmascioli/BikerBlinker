import React from 'react';
import LeftSignalButton from '../components/leftSignalButton';
import RightSignalButton from '../components/rightSignalButton';
import { layout, components} from '../styles/styles';
import {
  AppState,
  View,
  NativeEventEmitter,
  NativeModules,
  PermissionsAndroid,
} from "react-native";
//import { BleManager } from 'react-native-ble-plx';
import BleManager from 'react-native-ble-manager';
import { stringToBytes } from "convert-string";


const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export default class HomePage extends React.Component {

	constructor(props) {
    super(props)
    //this.manager = new BleManager()
    this.state = {
      scanning:false,
      peripherals: new Map(),
      appState: '',
      peripheralId: null,
      found: false,
      turningLeft: false,
    }
    console.log("start app")
    this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
    this.leftTurn = this.leftTurn.bind(this);
    this.rightTurn = this.rightTurn.bind(this);
    this.writeData = this.writeData.bind(this);
    this.retrieveConnected = this.retrieveConnected.bind(this);
    this.handleStopScan = this.handleStopScan.bind(this);
    this.handleUpdateValueForCharacteristic = this.handleUpdateValueForCharacteristic.bind(this);
    this.handleDisconnectedPeripheral = this.handleDisconnectedPeripheral.bind(this);
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
  }

  serviceUUID(num) {
    return this.prefixUUID + num + "0" + this.suffixUUID
  }

  notifyUUID(num) {
    return this.prefixUUID + num + "1" + this.suffixUUID
  }

  writeUUID(num) {
    return this.prefixUUID + num + "2" + this.suffixUUID
  }
  info(message) {
    this.setState({info: message})
  }

  error(message) {
    this.setState({info: "ERROR: " + message})
  }

  updateValue(key, value) {
    this.setState({values: {...this.state.values, [key]: value}})
  }

  leftTurn() {
    
    if (this.state.found) {
      BleManager.connect(this.state.peripheralId)
        .then(() => {
          let peripherals = this.state.peripherals;
            let p = peripherals.get(this.state.peripheralId);
            if (p) {
              p.connected = true;
              peripherals.set(this.state.peripheralId, p);
              this.setState({peripherals});
            }
            console.log('Connected to ' + this.state.peripheralId);

            BleManager.retrieveServices(this.state.peripheralId).then((peripheralInfo) => {
              this.writeData(this.state.turningLeft ? "leftoff" : "left")

              this.setState({turningLeft: !this.state.turningLeft});
            });
          }).catch((error) => {
            console.log('Connection error', error);
          });
    }
  }

  rightTurn() {

  }

  connectAndWrite(data, callback) {
    if (this.state.found) {
      BleManager.connect(this.state.peripheralId)
        .then(() => {
          let peripherals = this.state.peripherals;
            let p = peripherals.get(this.state.peripheralId);
            if (p) {
              p.connected = true;
              peripherals.set(this.state.peripheralId, p);
              this.setState({peripherals});
            }
            console.log('Connected to ' + this.state.peripheralId);

            BleManager.retrieveServices(this.state.peripheralId).then((peripheralInfo) => {
              this.writeData(this.state.turningLeft ? "leftoff" : "left")

              this.setState({turningLeft: !this.state.turningLeft});
            });
          }).catch((error) => {
            console.log('Connection error', error);
          });
    }
  }

  writeData(data) {    
    const service = 'dad223bb-67b0-40d0-8a76-4bca05ae04b6';
    const characteristic = 'cda2e29c-d126-4887-9bfc-5a390dfe8255';
    BleManager.write(this.state.peripheralId, service, characteristic, stringToBytes(data)).then(() => {
      console.log('Left turn on');
    });
  }

	componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);

    this.handlerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral );
    this.handlerStop = bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan );
    this.handlerDisconnect = bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', this.handleDisconnectedPeripheral );
    this.handlerUpdate = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValueForCharacteristic );


    if (Platform.OS === 'android' && Platform.Version >= 23) {
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
            if (result) {
              console.log("Permission is OK");
            } else {
              PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                if (result) {
                  console.log("User accept");
                } else {
                  console.log("User refuse");
                }
              });
            }
      });
    }

    BleManager.start({showAlert: false}).then(() => {
      console.log("started");
      BleManager.scan(['dad223bb-67b0-40d0-8a76-4bca05ae04b6'], 5, true).then(() => {
        // Success code
        console.log("Scan started");
      });
    });

  }

  handleAppStateChange(nextAppState) {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!')
      BleManager.getConnectedPeripherals([]).then((peripheralsArray) => {
        console.log('Connected peripherals: ' + peripheralsArray.length);
      });
    }
    this.setState({appState: nextAppState});
  }

  componentWillUnmount() {
    this.handlerDiscover.remove();
    this.handlerStop.remove();
    this.handlerDisconnect.remove();
    this.handlerUpdate.remove();
  }

  handleDisconnectedPeripheral(data) {
    console.log("discovered");
    console.log(data);
    let peripherals = this.state.peripherals;
    let peripheral = peripherals.get(data.peripheral);
    if (peripheral) {
      peripheral.connected = false;
      peripherals.set(peripheral.id, peripheral);
      this.setState({peripherals});
    }
    console.log('Disconnected from ' + data.peripheral);
  }

  handleUpdateValueForCharacteristic(data) {
    console.log('Received data from ' + data.peripheral + ' characteristic ' + data.characteristic, data.value);
  }

  handleStopScan() {
    console.log('Scan is stopped');
    this.setState({ scanning: false });
  }

  retrieveConnected(){
    BleManager.getConnectedPeripherals([]).then((results) => {
      if (results.length == 0) {
        console.log('No connected peripherals')
      }
      var peripherals = this.state.peripherals;
      for (var i = 0; i < results.length; i++) {
        var peripheral = results[i];
        peripheral.connected = true;
        peripherals.set(peripheral.id, peripheral);
        this.setState({ peripherals });
      }
    });
  }

  handleDiscoverPeripheral(peripheral){
    var peripherals = this.state.peripherals;
    console.log('Got ble peripheral', peripheral);
    if (!peripheral.name) {
      peripheral.name = 'NO NAME';
    }
    peripherals.set(peripheral.id, peripheral);
    if (peripheral.name == 'BikerBlinker' && !this.state.found) {
        this.setState(prevState => Object.assign({}, {
          ...prevState,
          peripheralId: peripheral.id,
          found: true,
        }));
    };
    this.setState(prevState => Object.assign({}, {
      ...prevState,
      peripherals,
    }));
  }

  scanAndConnect() {
    this.manager.startDeviceScan([], 
                                 {allowDuplicates: true}, (error, device) => {
			console.log("Scanning");                                 	
      this.info("Scanning...")
      console.log(device);
      console.log(error);
      
      if (error) {
      	console.log("has error");
        this.error(error.message)
        return
      }

      console.log("has device");
      console.log(device.name);

      if (device.name === 'BikerBlinker') {
      	console.log("has biker blinker");
        this.info("Connecting to Biker Blinker")
        this.manager.stopDeviceScan()
        this.setState(prevState => Object.assign({}, {
          ...prevState,
          deviceId: device.id,
          device, device,
        }));
        device.connect()
          .then((device) => {
          	console.log("connected to biker blinker");
          	console.log(device);
            this.info("Discovering services and characteristics")
            return device.discoverAllServicesAndCharacteristics()
          })
          .then((device) => {
            this.info("Setting notifications")
            return this.setupNotifications(device)
          })
          .then(() => {
            this.info("Listening...")
          }, (error) => {
            this.error(error.message)
          })
      }
    });
  }

  async setupNotifications(device) {
    console.log("Left turn on");
    // turn on blinker left
    await device.writeCharacteristicWithResponseForService(
      'dad223bb-67b0-40d0-8a76-4bca05ae04b6',
      'cda2e29c-d126-4887-9bfc-5a390dfe8255',
      "bGVmdA==", false);
    console.log("left on");
    await new Promise(resolve => setTimeout(resolve, 2000));
    // turn of blinker left
    console.log("left turn of");
    await device.writeCharacteristicWithResponseForService(
      'dad223bb-67b0-40d0-8a76-4bca05ae04b6',
      'cda2e29c-d126-4887-9bfc-5a390dfe8255',
      "bGVmdG9mZg==", false);
    console.log("left off");
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log("Right turn on");
    // turn on blinker right
    await device.writeCharacteristicWithResponseForService(
      'dad223bb-67b0-40d0-8a76-4bca05ae04b6',
      'cda2e29c-d126-4887-9bfc-5a390dfe8255',
      "cmlnaHQ=", false);
    console.log("right on");
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log("right turn off");
    // turn off blinker right
    await device.writeCharacteristicWithResponseForService(
      'dad223bb-67b0-40d0-8a76-4bca05ae04b6',
      'cda2e29c-d126-4887-9bfc-5a390dfe8255',
      "cmlnaHRvZmY=", false);
    console.log("right off");
    // turn on brake
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log("activate brake");
    await device.writeCharacteristicWithResponseForService(
      'dad223bb-67b0-40d0-8a76-4bca05ae04b6',
      'cda2e29c-d126-4887-9bfc-5a390dfe8255',
      "YnJha2U=", false);
    console.log("brake on");
    // turn off brake
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log("deactivate brake");
    await device.writeCharacteristicWithResponseForService(
      'dad223bb-67b0-40d0-8a76-4bca05ae04b6',
      'cda2e29c-d126-4887-9bfc-5a390dfe8255',
      "YnJha2VvZmY=", false);
    console.log("off?");
  }

  render() {
	  return (
	    <View style={layout.container}>
	      <View style={components.main}>
	      <LeftSignalButton press={this.leftTurn} />
	        <View style={components.verticalRule}/>
	      <RightSignalButton press={this.rightTurn} />
	      </View>
	    </View>
	  );  	
  }
}