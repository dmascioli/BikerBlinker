import React from "react";
import LeftSignalButton from '../components/leftSignalButton';
import RightSignalButton from '../components/rightSignalButton';
import { layout, components} from '../styles/styles';
import { View } from "react-native";

export default function Main() {
  return (
    <View style={layout.container}>
      <View style={components.main}>
      <LeftSignalButton />
        <View style={components.verticalRule}/>
      <RightSignalButton />
      </View>
    </View>
  );
}