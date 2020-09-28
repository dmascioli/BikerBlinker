import { StatusBar } from "expo-status-bar";
import React from "react";
import { layout} from './styles/styles';
import { Text, View } from "react-native";
import MenuBox from './components/menuBox';
import { useNavigation } from '@react-navigation/native';
import Debug from './pages/debug';
import Main from './pages/main';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback } from "react-native-gesture-handler";

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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function Home() {
  const navigation = useNavigation();
  return (
    <View>
      <TouchableOpacity onPress={() => navigation.navigate("Main")}>
        <View style={layout.container}>
          <Text style={layout.header}>Welcome to BikerBlinker</Text>
          <br />
          <br />
          <Text style={layout.subHeader}>Click anywhere to begin!</Text>
          <TouchableWithoutFeedback onPress={() => navigation.navigate("Debug")}><Text>debug</Text></TouchableWithoutFeedback>
          <StatusBar style="auto" />
        </View>
      </TouchableOpacity>
    </View>
  );
}