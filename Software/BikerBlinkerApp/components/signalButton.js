import React from "react";
import { components } from '../styles/styles';
import { Text, TouchableHighlight } from "react-native";

export default function SignalButton({command}) {
  return (
    <TouchableHighlight style={components.menuBox} onPress={() => alert(command)}>
      <Text style={components.menuText}>
          {command}
      </Text>
    </TouchableHighlight>
  );
}