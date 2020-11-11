import { StatusBar } from "expo-status-bar";
import React from 'react';
import { layout} from './styles/styles';
import { Text, View } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Main from './pages/main';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableHighlight, TouchableOpacity } from "react-native-gesture-handler";

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

export default class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Home} options={layoutOptions}/>
          <Stack.Screen name="Main" component={Main} options={layoutOptions}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

function Home() {
  const navigation = useNavigation();
  return (
      <View style={layout.container}>
        <TouchableOpacity onPress={() => navigation.navigate("Main")}>
          <Text style={layout.header}>Welcome to BikerBlinker</Text>
          <Text style={layout.subHeader}>Click here to begin!</Text>
        </TouchableOpacity>
        <StatusBar style="auto" />
      </View>
  );
}