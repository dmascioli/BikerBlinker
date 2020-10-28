import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  AppRegistry,
} from 'react-native';

import Voice from 'react-native-voice';


import Clipboard from '@react-native-community/clipboard';

export default class VoiceNative extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recognized: '',
      started: '',
      running: false,
      results: [],
      words: [
        "turn",
        "turns",
        "turned",
        "left",
        "lefts",
        "right",
        "rights",
        "stop",
        "stops",
        "stopped",
      ],
    };
Voice.onSpeechStart = this.onSpeechStart.bind(this);
    Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this);
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
  }
componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }
onSpeechStart(e) {
    this.setState({
      started: '√',
    });
  };
onSpeechRecognized(e) {
    this.setState({
      recognized: '√',
    });
  };
onSpeechResults(e) {
    this.setState({
      results: e.value,
    });
  }
async _startRecognition(e) {
    this.setState({
      recognized: '',
      started: '',
      running: true,
      results: [],
    });
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  }
async _stopRecognition(e) {
    this.setState({
      recognized: '',
      started: '',
      running: false,
      results: [],
    });
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  }


copyToClipboard = () => {
  Clipboard.setString(this.state.results.map((result, index) => index == 0 ? `${result}` : ` ${result}`).toString())
}

render () {
    return (
      <View>
        {
          !this.state.running && (
            <Button style={styles.transcript}
            onPress={this._startRecognition.bind(this)}
            title="Start"></Button>
          )
        }
        {
          this.state.running && (
            <Button style={styles.transcript}
            onPress={this._stopRecognition.bind(this)}
            title="Stop"></Button>
          )
        }
        {
          this.state.results
            && this.state.results.length > 0
            && (
              <Button style={styles.transcript}
              onPress={this.copyToClipboard.bind(this)}
              title="Copy"></Button>
            )
        }
        <Text style={styles.header}>
            Transcript
        </Text>
        <>
          {this.state.results.map((result, index) => <Text key={`result-${index}`} style={styles.transcript}>{result}</Text>
          )}
          {
            this.state.results.map((result, index) => {
              var words = result.split(' ');
              var highlightedWords = words.filter(word => this.state.words.includes(word.trim().toLowerCase()));
              return (
                highlightedWords.map((highlightedWord, index) => <Text key={`highlighted-${index}`} style={styles.highlighted}>{highlightedWord.toLowerCase()}</Text>)                
              );
            })
          }
        </>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  header: {
    textAlign: 'center',
    color: '#B0171F',
    marginBottom: 1,
  },
  transcript: {
    textAlign: 'center',
    color: '#B0171F',
    marginBottom: 1,
  },
  highlighted: {
    textAlign: 'center',
    color: '#fcba03',
    marginBottom: 1,
  },
});
AppRegistry.registerComponent('VoiceNative', () => VoiceNative);