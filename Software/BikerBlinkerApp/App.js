import { StatusBar } from "expo-status-bar";
import React from "react";
import { layout} from './styles/styles';
import { Text, View } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Debug from './pages/debug';
import Main from './pages/main';
import SensorsPage from './pages/sensors';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback } from "react-native-gesture-handler";
import BluetoothPage from "./pages/bt";

const Stack = createStackNavigator();

const layoutOptions = {
  headerStyle: {
    backgroundColor: '#2c302e',
  },
  headerTintColor: 'white',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} options={layoutOptions}/>
        <Stack.Screen name="Debug" component={Debug} options={layoutOptions}/>
        <Stack.Screen name="Main" component={Main} options={layoutOptions}/>
        <Stack.Screen name="Sensors" component={SensorsPage} options={layoutOptions}/>
        <Stack.Screen name="Bluetooth" component={BluetoothPage} options={layoutOptions}/>

      </Stack.Navigator>
    </NavigationContainer>
  );
}

function Home() {
  const navigation = useNavigation();
  return (
      <View style={layout.container}>
        <TouchableOpacity onPress={() => navigation.navigate("Main")}>
          <Text style={layout.header}>Welcome to BikerBlinker</Text>
          <Text style={layout.subHeader}>Click here to begin!</Text>
        </TouchableOpacity>
        <TouchableHighlight onPress={() => navigation.navigate("Bluetooth")}>
          <View style={layout.menuItem}>
            <Text style={layout.menuItemText}>Bluetooth</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => navigation.navigate("Sensors")}>
          <View style={layout.menuItem}>
            <Text style={layout.menuItemText}>Sensors</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => navigation.navigate("Debug")}>
          <View style={layout.menuItem}>
            <Text style={layout.menuItemText}>Debug</Text>
          </View>
        </TouchableHighlight>
        <StatusBar style="auto" />
      </View>
  );
}