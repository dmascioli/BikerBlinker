import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  AppRegistry,
} from 'react-native';

import BLEManager from 'react-native-ble-plx';

export default class BluetoothPLX extends React.Component {
    constructor(props) {
      super(props);
    
      this.manager = new BLEManager();

      this.state = {
      };
    }}


scanAndConnect() 
{
    this.manager.startDeviceScan(null, null, (error, device) => {
      this.info("Scanning...");
      console.log(device);

      if (error) {
        this.error(error.message);
        return
      }

      if (device.name ==='BikerBlinker') {
        this.info("Connecting to Tappy");
        this.manager.stopDeviceScan();

        device.connect()
          .then((device) => {
            this.info("Discovering services and characteristics");
            return device.discoverAllServicesAndCharacteristics()
          })
          .then((device) => {
            this.info(device.id);
            device.writeCharacteristicWithResponseForService('12ab', '34cd', 'aGVsbG8gbWlzcyB0YXBweQ==')
              .then((characteristic) => {
                this.info(characteristic.value);
                return 
              })
          })
          .catch((error) => {
            this.error(error.message)
          })
       }
   });
}