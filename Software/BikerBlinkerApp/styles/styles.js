import { StyleSheet } from "react-native";

/*
* Color Palette
* Primary: 9ae19d
* Secondary: 909590
* Tertiary: F8DA00
* Dark: 537a5a
* BG-Light: 909590
* BG-Dark: 2c302e
* Failure: d00000 
* Success: 00b4d8 */

export const layout = StyleSheet.create({
    container: {
      flex: 1,
      borderColor: "#9ae19d",
      backgroundColor: "#474a48",
      borderWidth: "1em",
      borderRadius: "2em",
      alignItems: "center",
      justifyContent: "center",
    },
    header: {
        color: "white",
        fontFamily: "sans-serif",
        fontSize: "5em"
    }
  });
  