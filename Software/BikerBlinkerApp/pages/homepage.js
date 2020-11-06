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
    this.state = {info: "", values: {}, device: null}
    this.prefixUUID = "f000aa"
    this.suffixUUID = "-0451-4000-b000-000000000000"
    this.serviceUUID = ""
    this.blinkerUUID = ""
    this.batteryUUID =""
    this.sensors = {
      0: "Battery",
      1: "LeftBlinkerOn",
      2: "RightBlinker",
      3: "Brake",
      4: "Barometer",
      5: "Gyroscope"
    }
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
  	this.manager.writeCharacteristicWithResponseForService(this.state.deviceId, 'dad223bb-67b0-40d0-8a76-4bca05ae04b6', 'cda2e29c-d126-4887-9bfc-5a390dfe8255', 'bGVmdA==', false);
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
                                 null, (error, device) => {
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
    for (const id in this.sensors) {
      const service = this.serviceUUID(id)
      const characteristicW = this.writeUUID(id)
      const characteristicN = this.notifyUUID(id)

      const characteristic = await device.writeCharacteristicWithResponseForService(
        service, characteristicW, "AQ==" /* 0x01 in hex */
      )

      device.monitorCharacteristicForService(service, characteristicN, (error, characteristic) => {
        if (error) {
          this.error(error.message)
          return
        }
        this.updateValue(characteristic.uuid, characteristic.value)
      })
    }
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