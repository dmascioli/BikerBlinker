# Software

This folder contains code for the accompanying mobile application.

## Initial Setup
1. Make sure `node.js >= v12` is installed
2. Install expo cli:

    `sudo npm i -g expo-cli`

3. Install Expo client on phone (iOS app store or Google Play Store)
4. Make sure VS Code is installed
5. Install plugins
    
    - React Native Tools
    - React-Native/React/Redux snippets

## Libraries used
1. React-Native-Voice (https://github.com/react-native-voice/voice)
    - used for input and transcription of users audio
2. react-native-nlp (https://www.npmjs.com/package/react-native-nlp)
    - used to analyize audio transcription for detecting audio commands
3. react-native-ble-plx (https://github.com/Polidea/react-native-ble-plx)
    - used for bluetooth communitcation with biker blinker modual
