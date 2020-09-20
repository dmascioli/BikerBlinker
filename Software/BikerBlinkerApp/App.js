import { StatusBar } from "expo-status-bar";
import React from "react";
import { layout} from './styles/styles';
import { Text, View } from "react-native";
import MenuBox from './components/menuBox';
import Debug from './pages/debug';
import Main from './pages/main';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="home">
        <Stack.Screen name="home" component={Home} />
        <Stack.Screen name="debug" component={Debug} />
        <Stack.Screen name="main" component={Main} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function Home() {
  return (
    <View style={layout.container}>
      <Text style={layout.header}>BikerBlinker</Text>
      <View style={layout.menu}> 
        <MenuBox boxText="Main" boxLink="main"/>
        <MenuBox boxText="Debug" boxLink="debug"/>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}