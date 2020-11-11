import React, { useState, useEffect } from "react";
import { components } from '../styles/styles';
import { TouchableHighlight, Image } from "react-native";
import leftArrowOn from  '../assets/left_arrow.png';
import leftArrowOff from '../assets/left_arrow_dull.png';

export default function LeftSignalButton({forwardDirection}) {
  var [signalLight, setSignalLight] = useState(false);
  var [shutOffReady, setShutOffReady] = useState(false);
  const [average, setAverage] = useState(0);
  const [stabilization, setStabilization] = useState([0,0,0,0,0]);

  useEffect(() => {
      if(Array.isArray(stabilization)) {
        var tempStabilization = stabilization;
        tempStabilization.push(forwardDirection);
        tempStabilization.shift(); 
        setStabilization(tempStabilization);
        var total = 0;
        for(var i = 0; i < tempStabilization.length; i++) {
            total += tempStabilization[i];
        }
        setAverage(total / tempStabilization.length);
        if(average < .1 && average > -.1) {
          if(shutOffReady) {
            setSignalLight(false);
            setShutOffReady(false);
          }
        }
    }
  }, [forwardDirection]);

  useEffect(() => {
    if(average > .3 || average < -.3) {
      setShutOffReady(true);
    }
  }, [average]);

  function toggleSignal() {
    setSignalLight(!signalLight);
  }
  
  return (
    <TouchableHighlight style={components.menuBox} onPress={() => toggleSignal()}>
      {(signalLight == true) ? <Image style={components.arrow} source={leftArrowOn} /> : <Image style={components.arrow} source={leftArrowOff} />}
    </TouchableHighlight>
  );
}