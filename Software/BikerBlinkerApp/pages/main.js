import React, { useState, useEffect } from "react";
import LeftSignalButton from '../components/leftSignalButton';
import RightSignalButton from '../components/rightSignalButton';
import { layout, components} from '../styles/styles';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import {
  AppState,
  Button,
  View,
  NativeEventEmitter,
  NativeModules,
  PermissionsAndroid,
} from "react-native";
import Voice from 'react-native-voice';
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
  const [results, setResults] = useState([]);
  const [voiceRunning, setVoiceRunning] = useState(false);
  const [peripherals, setPeripherals] = useState(new Map());
  const [appState, setAppState] = useState('');
  const [recognized, setRecognized] = useState('');
  const [started, setStarted] = useState('');
  const [madeLeft, setMadeLeft] = useState(false);
  const [madeRight, setMadeRight] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const words = [
    "turn",
    "turns",
    "turned",
    "left",
    "lefts",
    "right",
    "rights",
    "stop",
    "stops",
    "stopped",
  ];

  const leftCommands = ["left", "lefts"];
  const rightCommands = ["right", "rights"];
  const stopCommands = ["stop", "stops"];

  useEffect(() => {
    _subscribeAppState();
    _subscribeVoice();
    _toggleAccel();
    _toggleGyro();
  }, []);

  useEffect(() => {
    return () => {
      _unsubscribeAccel();
      _unsubscribeGyro();
      _unsubscribeBT();
      _unsubscribeVoice();
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
      setLeftSignal(!toggleLeft);
      setTogglingLeft(true);
      connectAndWrite(leftSignal ? "leftoff" : "left", setTogglingLeft);
    };
  }

  const toggleRight = () => {
    console.log("right turn");
    if (!togglingRight) {
      setRightSignal(!toggleRight);
      setTogglingRight(true);
      connectAndWrite(rightSignal ? "rightoff" : "right", setTogglingRight);
    };
  }

  const connectAndWrite = (data, setToggle) =>  {
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
            writeData(data, setToggle);
          });
          }).catch((error) => {
            console.log('Connection error', error);
          });
    }
  }

  const writeData = (data, setToggle) => {
    const service = 'dad223bb-67b0-40d0-8a76-4bca05ae04b6';
    const characteristic = 'cda2e29c-d126-4887-9bfc-5a390dfe8255';
    BleManager.write(peripheralId, service, characteristic, stringToBytes(data)).then(() => {
      console.log('wrote data: ' + data);
      setToggle(false);
    });
  }

  const _subscribeVoice = () => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechResults = onSpeechResults;
    _startRecognition()
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
    if (found) 
      alert('biker blinker module found');
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

  const onSpeechStart = (e) => {
    setStarted('√');
  };

  const onSpeechRecognized = (e) => {
    setRecognized('√');
  };

  const onSpeechResults = (e) => {
    console.log(e.value);
    setResults(e.value);
  }

  useEffect(() => {
    console.log(results);
    if (!detecting && results.length > 0) {
      setDetecting(true);
      var detectedWords = results[0].split(' ');
      const leftResults = detectedWords.filter(word => leftCommands.includes(word.trim().toLowerCase()));
      console.log(leftResults);
      const rightResults = detectedWords.filter(word => rightCommands.includes(word.trim().toLowerCase()));
      console.log(rightResults);
      if (!madeLeft && !leftSignal && !rightSignal && leftResults.length > 0) {
        setMadeLeft(true);
        console.log("make left turn");
        toggleLeft();
      } else if (!madeRight && !leftSignal && !rightSignal && rightResults.length > 0) {
        setMadeRight(true);
        console.log("make right turn");
        toggleRight();
      };
      setDetecting(false);
    };
  }, [results, detecting, leftSignal, rightSignal, madeRight, madeLeft])

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

  const _unsubscribeVoice = () => {
    Voice.destroy().then(Voice.removeAllListeners);
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

  const _startRecognition = async (e) => {
    setVoiceRunning(true);
    setResults([]);
    try {
      await Voice.start('en-US');
      alert('voice detection started');
    } catch (e) {
      console.error(e);
    }
  }

  const _stopRecognition = async (e) => {
    setVoiceRunning(stop);
    setResults([]);
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  }
  
  var yAccel = accelData.y;
  var zGyro = gyroData.z;

  useEffect(() => {
    // if(yAccel < 0 && !brake) {
    //   if (!togglingBrake) {
    //     setTogglingBrake(true);
    //     connectAndWrite("brake", setTogglingBrake, setBrake, brake);
    //   };
    // } else {
    //   if (!togglingBrake) {
    //     setTogglingBrake(true);
    //     connectAndWrite("brakeoff", setTogglingBrake, setBrake, brake);
    //   };
    // }
  }, [yAccel]);
  const toggleBrake = () => {
    console.log("toggle brake: " + brake);
    if (!togglingBrake) {
      setTogglingBrake(true);
      connectAndWrite(brake ? "brakeoff" : "brake", setTogglingBrake, setBrake, brake);
    };
  }
  
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
      <Button onPress={toggleBrake} title="BRAKE"></Button>
      </View>
    </View>
  );
}
