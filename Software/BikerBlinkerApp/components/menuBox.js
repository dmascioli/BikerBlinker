import React from "react";
import { components } from '../styles/styles';
import { Text, View, Button, TouchableHighlight } from "react-native";
import { useNavigation } from '@react-navigation/native';

export default function MenuBox({boxText, boxLink}) {
  const navigation = useNavigation();
  return (
    <TouchableHighlight style={components.menuBox} onPress={() => navigation.navigate(boxLink)}>
      <Text style={components.menuText}>
          {boxText}
      </Text>
    </TouchableHighlight>
  );
}