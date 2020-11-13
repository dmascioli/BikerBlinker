import React, { useState, useEffect } from "react";
import LeftSignalButton from '../components/leftSignalButton';
import RightSignalButton from '../components/rightSignalButton';
import { layout, components} from '../styles/styles';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import {
  AppState,
  View,
  NativeEventEmitter,
  NativeModules,
  PermissionsAndroid,
} from "react-native";
import BleManager from 'react-native-ble-manager';
import { stringToBytes } from "convert-string";


const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export default function Main() {
  const [accelData, setAccelData] = useState({});
  const [gyroData, setGyroData] = useState({});
  const [scanning, setScanning] = useState(false);
  const [peripheralId, setPeripheralId] = useState(false);
  const [leftSignal, setLeftSignal] = useState(false);
  const [rightSignal, setRightSignal] = useState(false);
  const [found, setFound] = useState(false);
  const [brake, setBrake] = useState(false);
  const [togglingLeft, setTogglingLeft] = useState(false);
  const [togglingRight, setTogglingRight] = useState(false);
  const [togglingBrake, setTogglingBrake] = useState(false);
  const [peripherals, setPeripherals] = useState(new Map());
  const [appState, setAppState] = useState('');

  useEffect(() => {
    _subscribeAppState();
    _toggleAccel();
    _toggleGyro();
  }, []);

  useEffect(() => {
    return () => {
      _unsubscribeAccel();
      _unsubscribeGyro();
      _unsubscribeBT()
    };
  }, []);

  const _toggleAccel = () => {
    if (this._subscribeAccel) {
      _unsubscribeAccel();
    } else {
      _subscribeAccel();
    }
  };

  const _toggleGyro = () => {
    if (this._subscribeGyro) {
      _unsubscribeGyro();
    } else {
      _subscribeGyro();
    }
  };

  const toggleLeft = () => {
    console.log("left turn");
    if (!togglingLeft) {
      setTogglingLeft(true);
      connectAndWrite(leftSignal ? "leftoff" : "left", setTogglingLeft, setLeftSignal, leftSignal);
    };
  }

  const toggleRight = () => {
    console.log("right turn");
    if (!togglingRight) {
      setTogglingRight(true);
      connectAndWrite(rightSignal ? "rightoff" : "right", setTogglingRight, setRightSignal, leftSignal);
    };
  }

  const connectAndWrite = (data, setToggle, setState, stateVar) =>  {
    if (found) {
      BleManager.connect(peripheralId)
        .then(() => {
          let newPeripherals = peripherals;
          let p = newPeripherals.get(peripheralId);
          if (p) {
            p.connected = true;
            newPeripherals.set(peripheralId, p);
            setPeripherals(newPeripherals);
          }
          console.log('Connected to ' + peripheralId);

          BleManager.retrieveServices(peripheralId).then((peripheralInfo) => {
            writeData(data, setToggle, setState, stateVar);
          });
          }).catch((error) => {
            console.log('Connection error', error);
          });
    }
  }

  const writeData = (data, setToggle, setState, stateVar) => {
    const service = 'dad223bb-67b0-40d0-8a76-4bca05ae04b6';
    const characteristic = 'cda2e29c-d126-4887-9bfc-5a390dfe8255';
    BleManager.write(peripheralId, service, characteristic, stringToBytes(data)).then(() => {
      console.log('wrote data: ' + data);
      setState(!stateVar);
      setToggle(false);
    });
  }

  const _subscribeAppState = () => {
    AppState.addEventListener('change', this.handleAppStateChange)

    this.handlerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral );
    this.handlerStop = bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan );
    this.handlerDisconnect = bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral );
    this.handlerUpdate = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic );


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

  const handleAppStateChange = (nextAppState) => {
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!')
      BleManager.getConnectedPeripherals([]).then((peripheralsArray) => {
        console.log('Connected peripherals: ' + peripheralsArray.length);
      });
    }
    setAppState(nextAppState);
  }

  const handleDisconnectedPeripheral = (data) => {
    console.log("discovered");
    console.log(data);
    let newPeriperals = peripherals;
    let peripheral = newPeriperals.get(data.peripheral);
    if (peripheral) {
      peripheral.connected = false;
      newPeriperals.set(peripheral.id, peripheral);
      setPeripherals(newPeriperals);

    }
    console.log('Disconnected from ' + data.peripheral);
  }

  const handleUpdateValueForCharacteristic = (data) => {
    console.log('Received data from ' + data.peripheral + ' characteristic ' + data.characteristic, data.value);
  }

  const handleStopScan = () => {
    console.log('Scan is stopped');
    setScanning(false);
  }

  const retrieveConnected = () => {
    BleManager.getConnectedPeripherals([]).then((results) => {
      if (results.length == 0) {
        console.log('No connected peripherals')
      }
      var newPeriperals = peripherals;
      for (var i = 0; i < results.length; i++) {
        var peripheral = results[i];
        peripheral.connected = true;
        newPeriperals.set(peripheral.id, peripheral);
        setPeripherals(newPeriperals);
      }
    });
  }

  const handleDiscoverPeripheral = (peripheral) => {
    let newPeriperals = peripherals;
    console.log('Got ble peripheral', peripheral);
    if (!peripheral.name) {
      peripheral.name = 'NO NAME';
    }
    newPeriperals.set(peripheral.id, peripheral);
    console.log(found);
    if (peripheral.name == 'BikerBlinker' && !found) {
        setPeripheralId(peripheral.id);
        setFound(true);
    };
    setPeripherals(newPeriperals);
  }

  const _subscribeAccel = () => {
    this._subscribeAccel = Accelerometer.addListener(accelerometerData => {
      setAccelData(accelerometerData);
    });
  };

  const _subscribeGyro = () => {
    this._subscribeGyro = Gyroscope.addListener(gyroscopeData => {
      setGyroData(gyroscopeData);
    });
  };

  const _unsubscribeAccel = () => {
    this._subscribeAccel && this._subscribeAccel.remove();
    this._subscribeAccel = null;
  };

  const _unsubscribeGyro = () => {
    this._subscribeGyro && this._subscribeGyro.remove();
    this._subscribeGyro = null;
  };

  const _unsubscribeBT = () => {
    this.handlerDiscover && this.handlerDiscover.remove();
    this.handlerDiscover = null;
    this.handlerStop && this.handlerStop.remove();
    this.handlerStop = null;
    this.handlerDisconnect && this.handlerDisconnect.remove();
    this.handlerDisconnect = null;
    this.handlerUpdate && this.handlerUpdate.remove();
    this.handlerUpdate = null;
  }
  
  var yAccel = accelData.y;
  var zGyro = gyroData.z;

  useEffect(() => {
    if(yAccel < 0 && !brake) {
      if (!togglingBrake) {
        setTogglingBrake(true);
        connectAndWrite("brake", setTogglingBrake, setBrake, brake);
      };
    } else {
      if (!togglingBrake) {
        setTogglingBrake(true);
        connectAndWrite("brakeoff", setTogglingBrake, setBrake, brake);
      };
    }
  }, [yAccel]);
  
  return (
    <View style={layout.container}>
      <View style={components.main}>
      <LeftSignalButton
        active={leftSignal}
        forwardDirection={zGyro}
        forwardAccel={yAccel}
        toggle={toggleLeft}
      />
        <View style={components.verticalRule}/>
      <RightSignalButton
        active={rightSignal}
        forwardDirection={zGyro}
        forwardAccel={yAccel}
        toggle={toggleRight}
      />
      </View>
    </View>
  );
}
