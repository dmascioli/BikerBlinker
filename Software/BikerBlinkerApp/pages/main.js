import React, { Component } from 'react';
import LeftSignalButton from '../components/leftSignalButton';
import RightSignalButton from '../components/rightSignalButton';
import { layout, components} from '../styles/styles';
import { View } from "react-native";
import { BleManager } from 'react-native-ble-plx';

export default class Main extends Component {
	constructor() {
    super()
    this.manager = new BleManager()
    this.state = {info: "", values: {}}
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
    this.manager.startDeviceScan(null, 
                                 null, (error, device) => {
			console.log("Scanning");                                 	
      this.info("Scanning...")
      //conosle.log(device);
      
      if (error) {
      	console.log("has error");
        this.error(error.message)
        return
      }

      if (device.name === 'BikerBlinker') {
      	console.log("has biker blinker");
        this.info("Connecting to Biker Blinker")
        this.manager.stopDeviceScan()
        device.connect()
          .then((device) => {
          	console.log("connected to biker blinker");
            this.info("Discovering services and characteristics")
            return device.discoverAllServicesAndCharacteristics()
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
	      <LeftSignalButton />
	        <View style={components.verticalRule}/>
	      <RightSignalButton />
	      </View>
	    </View>
	  );  	
  }
}