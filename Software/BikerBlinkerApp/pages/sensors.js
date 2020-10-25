import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Accelerometer, Gyroscope } from 'expo-sensors';

export default function SensorsPage() {
  const [accelData, setAccelData] = useState({});
  const [gyroData, setGyroData] = useState({});

  useEffect(() => {
    _toggle();
    _toggle2();
  }, []);

  useEffect(() => {
    return () => {
      _unsubscribe();
      _unsubscribe2();
    };
  }, []);

  const _toggle = () => {
    if (this._subscribe) {
      console.log("Unsubscribe");
      _unsubscribe();
    } else {
      console.log("Subscribe");
      _subscribe();
    }
  };

  const _toggle2 = () => {
    if (this._subscribe2) {
      console.log("Unsubscribe2");
      _unsubscribe2();
    } else {
      console.log("Subscribe2");
      _subscribe2();
    }
  };

  const _slow = () => {
    Accelerometer.setUpdateInterval(1000);
    Gyroscope.setUpdateInterval(1000);
  };

  const _fast = () => {
    Accelerometer.setUpdateInterval(16);
    Gyroscope.setUpdateInterval(16);
  };

  const _subscribe = () => {
    this._subscribe = Accelerometer.addListener(accelerometerData => {
      setAccelData(accelerometerData);
    });
  };

  const _subscribe2 = () => {
    this._subscribe2 = Gyroscope.addListener(gyroscopeData => {
      setGyroData(gyroscopeData);
    });
  };

  const _unsubscribe = () => {
    this._subscribe && this._subscribe.remove();
    this._subscribe = null;
  };

  const _unsubscribe2 = () => {
    this._subscribe2 && this._subscribe2.remove();
    this._subscribe2 = null;
  };

  
  var { x, y, z } = accelData;
  var x2 = gyroData.x;
  var y2 = gyroData.y;
  var z2 = gyroData.z;
  return (
    <View style={styles.sensor}>
      <Text style={styles.text}>Accelerometer: (in Gs where 1 G = 9.81 m s^-2)</Text>
      <Text style={styles.text}>
        x: {round(x)} y: {round(y)} z: {round(z)}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={_toggle} style={styles.button}>
          <Text>Toggle</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={_slow} style={[styles.button, styles.middleButton]}>
          <Text>Slow</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={_fast} style={styles.button}>
          <Text>Fast</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          borderBottomColor: 'black',
          borderBottomWidth: 1,
        }}
      />
      <Text style={styles.text}>Gyroscope:</Text>
      <Text style={styles.text}>
        x: {round(x2)} y: {round(y2)} z: {round(z2)}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={_toggle2} style={styles.button}>
          <Text>Toggle</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={_slow} style={[styles.button, styles.middleButton]}>
          <Text>Slow</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={_fast} style={styles.button}>
          <Text>Fast</Text>
        </TouchableOpacity>
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
  },
});