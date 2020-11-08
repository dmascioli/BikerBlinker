import React from 'react';
import LeftSignalButton from '../components/leftSignalButton';
import RightSignalButton from '../components/rightSignalButton';
import { layout, components} from '../styles/styles';
import { View } from "react-native";
import { BleManager } from 'react-native-ble-plx';

export default class HomePage extends React.Component {
	constructor() {
    super()
    this.manager = new BleManager()
    this.state = {info: "", values: {}, device: null, deviceId: null};
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
  	console.log("turn left");
  	//this.manager.writeCharacteristicWithResponseForService(this.state.deviceId, 'dad223bb-67b0-40d0-8a76-4bca05ae04b6', 'cda2e29c-d126-4887-9bfc-5a390dfe8255', 'bGVmdA==', false);
    //this.manager.connectedDevices()
    console.log("left is on");
    this.manager.startDeviceScan(['dad223bb-67b0-40d0-8a76-4bca05ae04b6'], 
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

  rightTurn() {
  	console.log("turn right");
  }

	componentWillMount() {
    if (Platform.OS === 'ios') {
      this.manager.onStateChange((state) => {
      	console.log("scanning for bt");
        if (state === 'PoweredOn') this.scanAndConnect()
      })
    } else {
      this.scanAndConnect()
    }
  }

  scanAndConnect() {
    this.manager.startDeviceScan(['dad223bb-67b0-40d0-8a76-4bca05ae04b6'], 
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
    conosle.log("off?");
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