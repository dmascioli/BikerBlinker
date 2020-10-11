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
      borderColor: "#9ae19d",
      backgroundColor: "#2c302e",
      borderWidth: "1em",
      overflow: 'auto', 
      alignItems: "center",
      justifyContent: "center",
      height: '100vh'
    },
    header: {
        color: "white",
        textAlign: 'center',
        fontFamily: "sans-serif",
        fontSize: "3em",
        marginTop: "2.75em"
    },
    touchable: {
      height: '500px'
    },
    subHeader: {
      color: "white",
      textAlign: 'center',
      fontFamily: "sans-serif",
      fontSize: "2em",
      marginBottom: "4em"
    },
    menu: {
      display: "inline-block", 
      height: "40%",
      width: "100%"
    },
    menuItem: {
      borderTopColor: "#909590",
      width: "100vw",
      borderWidth: "0.1em",
      textAlign: "center",
      padding: "1em",
      borderBottomWidth: "0px"
    },
    menuItemText: {
      color: "white",
      fontFamily: "sans-serif",
      fontSize: "2em",
    }
  });

export const components = StyleSheet.create({
  menuText: {
    color: "white",
    fontSize: "5em"
  },
  menuBox: {
    width: '49.5vw',
    height: '100vh',
    alignItems: "center",
    justifyContent: "center",
  },
  main: {
    display: 'flex',
    flexDirection: 'row',
    padding: 'none'
  },
  verticalRule: {
    borderLeftWidth: '6px',
    borderLeftColor: 'white',
    borderStyle: 'dashed',
    height: '100%',
    position: 'absolute',
    left: '50%',
    marginLeft: '-3px',
    top: '0'
  }
});
  