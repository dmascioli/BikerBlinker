import React, {useState} from "react";
import { components } from '../styles/styles';
import { TouchableHighlight, Image } from "react-native";
import rightArrowOn from  '../assets/right_arrow.png';
import rightArrowOff from  '../assets/right_arrow_dull.png';

export default function RightSignalButton() {
    var [signalLight, setSignalLight] = useState(false);

    function toggleSignal() {
      setSignalLight(!signalLight);
    }
  return (
    <TouchableHighlight style={components.menuBox} onPress={() => toggleSignal()}>
      {(signalLight == true) ? <Image style={components.arrow} source={rightArrowOn} /> : <Image style={components.arrow} source={rightArrowOff} />}
    </TouchableHighlight>
  );
}