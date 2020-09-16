import { StatusBar } from "expo-status-bar";
import React from "react";
import { layout} from './styles/styles';
import { Text, View } from "react-native";

export default function App() {
  return (
    <View style={layout.container}>
      <Text style={layout.header}>BikerBlinker</Text>
      <StatusBar style="auto" />
    </View>
  );
}