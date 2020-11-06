import React from 'react';
import LeftSignalButton from '../components/leftSignalButton';
import RightSignalButton from '../components/rightSignalButton';
import { layout, components} from '../styles/styles';
import { View, StyleSheet } from "react-native";
import BluetoothSerial from 'react-native-bluetooth-serial';

export default class HomePage extends React.Component {
	constructor(props) {
    super(props)
    this.state = {
      isEnabled: false,
      discovering: false,
      devices: [],
      unpairedDevices: [],
      connected: false,
    }
  }

  componentDidMount() {
    Promise.all([
      BluetoothSerial.isEnabled(),
      BluetoothSerial.list()
    ])
    .then((values) => {
      const [ isEnabled, devices ] = values
 
      this.setState({ isEnabled, devices })
    })
 
    BluetoothSerial.on('bluetoothEnabled', () => {
 
      Promise.all([
        BluetoothSerial.isEnabled(),
        BluetoothSerial.list()
      ])
      .then((values) => {
        const [ isEnabled, devices ] = values
        this.setState({  devices })
      })
 
      BluetoothSerial.on('bluetoothDisabled', () => {
 
         this.setState({ devices: [] })
 
      })
      BluetoothSerial.on('error', (err) => console.log(`Error: ${err.message}`))
 
    })
  }
  _renderItem(item){
 
    return(<View style={styles.deviceNameWrap}>
            <Text style={styles.deviceName}>{item.item.name}</Text>
          </View>)
  }
  enable () {
    BluetoothSerial.enable()
    .then((res) => this.setState({ isEnabled: true }))
    .catch((err) => Toast.showShortBottom(err.message))
  }
 
  disable () {
    BluetoothSerial.disable()
    .then((res) => this.setState({ isEnabled: false }))
    .catch((err) => Toast.showShortBottom(err.message))
  }
 
  toggleBluetooth (value) {
    if (value === true) {
      this.enable()
    } else {
      this.disable()
    }
  }

  leftTurn() {
  	console.log("turn left");
  	//this.manager.writeCharacteristicWithResponseForService(this.state.deviceId, 'dad223bb-67b0-40d0-8a76-4bca05ae04b6', 'cda2e29c-d126-4887-9bfc-5a390dfe8255', 'bGVmdA==', false);
  }

  rightTurn() {
  	console.log("turn right");
  }

  render() {
	  return (  
	    <View style={layout.container}>
        <View style={styles.toolbar}>

              <Text style={styles.toolbarTitle}>Bluetooth Device List</Text>

              <View style={styles.toolbarButton}>

                <Switch
                  value={this.state.isEnabled}
                  onValueChange={(val) => this.toggleBluetooth(val)}
                />

              </View>
        </View>
        <FlatList
          style={{flex:1}}
          data={this.state.devices}
          keyExtractor={item => item.id}
          renderItem={(item) => this._renderItem(item)}
        />
	      <View style={components.main}>
	      <LeftSignalButton press={this.leftTurn} />
	        <View style={components.verticalRule}/>
	      <RightSignalButton press={this.rightTurn} />
	      </View>
	    </View>
	  );  	
  }
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  toolbar:{
    paddingTop:30,
    paddingBottom:30,
    flexDirection:'row'
  },
  toolbarButton:{
    width: 50,
    marginTop: 8,
  },
  toolbarTitle:{
    textAlign:'center',
    fontWeight:'bold',
    fontSize: 20,
    flex:1,
    marginTop:6
  },
  deviceName: {
    fontSize: 17,
    color: "black"
  },
  deviceNameWrap: {
    margin: 10,
    borderBottomWidth:1
  }
});