import React, { useState, useEffect } from "react";
import LeftSignalButton from '../components/leftSignalButton';
import RightSignalButton from '../components/rightSignalButton';
import { layout, components} from '../styles/styles';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import { View } from "react-native";

export default function Main() {
  const [accelData, setAccelData] = useState({});
  const [gyroData, setGyroData] = useState({});

  useEffect(() => {
    _toggleAccel();
    _toggleGyro();
  }, []);

  useEffect(() => {
    return () => {
      _unsubscribeAccel();
      _unsubscribeGyro();
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
  
  var yAccel = accelData.y;
  var zGyro = gyroData.z;

  useEffect(() => {
    if(yAccel < 0) {
      //alert("Brake");
    }
  }, [yAccel]);
  
  return (
    <View style={layout.container}>
      <View style={components.main}>
      <LeftSignalButton forwardDirection={zGyro} forwardAccel={yAccel}/>
        <View style={components.verticalRule}/>
      <RightSignalButton forwardDirection={zGyro} forwardAccel={yAccel}/>
      </View>
    </View>
  );
}
