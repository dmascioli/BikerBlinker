import React, { useState, useEffect } from "react";
import LeftSignalButton from '../components/leftSignalButton';
import RightSignalButton from '../components/rightSignalButton';
import { layout, components} from '../styles/styles';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import { View, StyleSheet, Text } from "react-native";

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
  
  var xAccel = accelData.x;
  var yAccel = accelData.y;
  var zAccel = accelData.z;
  var xGyro = gyroData.x;
  var yGyro = gyroData.y;
  var zGyro = gyroData.z;

  useEffect(() => {
    if(yAccel < 0) {
      alert("Brake");
    }
  }, [yAccel]);
  
  return (
    <View style={layout.container}>
      <View style={styles.sensor}>
      <Text style={styles.text}>Accelerometer: (in Gs where 1 G = 9.81 m s^-2)</Text>
      <Text style={styles.text}>
        x: {round(xAccel)} y: {round(yAccel)} z: {round(zAccel)}
      </Text>
      <View
        style={{
          borderBottomColor: 'black',
          borderBottomWidth: 1,
        }}
      />
      <Text style={styles.text}>Gyroscope:</Text>
      <Text style={styles.text}>
        x: {round(xGyro)} y: {round(yGyro)} z: {round(zGyro)}
      </Text>
    </View>
      <View style={components.main}>
      <LeftSignalButton forwardAcceleration={yAccel}/>
        <View style={components.verticalRule}/>
      <RightSignalButton forwardAcceleration={yAccel}/>
      </View>
    </View>
  );
}

function round(n) {
  if (!n) {
    return 0;
  }

  return Math.floor(n * 100) / 100;
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 15,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  sensor: {
    marginTop: 45,
    paddingHorizontal: 10,
  },
  text: {
    textAlign: 'center',
    color: 'white'
  },
});