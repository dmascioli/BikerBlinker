import React, {useState} from "react";
import { components } from '../styles/styles';
import { TouchableHighlight, Image } from "react-native";
import rightArrowOn from  '../assets/right_arrow.png';
import rightArrowOff from  '../assets/right_arrow_dull.png';

export default function RightSignalButton(props) {
  var [signalLight, setSignalLight] = useState(false);

  function toggleSignal() {
    setSignalLight(!signalLight);
    props.press();
  }
  
  return (
    <TouchableHighlight style={components.menuBox} onPress={() => toggleSignal()}>
      {(signalLight == true) ? <Image style={components.arrow} source={rightArrowOn} /> : <Image style={components.arrow} source={rightArrowOff} />}
    </TouchableHighlight>
  );  
}