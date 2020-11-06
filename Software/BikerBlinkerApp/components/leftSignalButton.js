import React, { useEffect, useState } from "react";
import { components } from '../styles/styles';
import { TouchableHighlight, Image } from "react-native";
import leftArrowOn from  '../assets/left_arrow.png';
import leftArrowOff from '../assets/left_arrow_dull.png';

export default function LeftSignalButton(props) {
  var [signalLight, setSignalLight] = useState(false);

  function toggleSignal() {
    setSignalLight(!signalLight);
    props.press();
  }
  
  return (
    <TouchableHighlight style={components.menuBox} onPress={() => toggleSignal()}>
      {(signalLight == true) ? <Image style={components.arrow} source={leftArrowOn} /> : <Image style={components.arrow} source={leftArrowOff} />}
    </TouchableHighlight>
  );
}