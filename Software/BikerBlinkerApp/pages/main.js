import React from "react";
import SignalButton from '../components/signalButton';
import { layout, components} from '../styles/styles';
import { View } from "react-native";

export default function Main() {
  return (
    <View style={layout.container}>
      <View style={components.main}>
      <SignalButton command="<-" />
        <View style={components.verticalRule}/>
      <SignalButton command="->" />
      </View>
    </View>
  );
}