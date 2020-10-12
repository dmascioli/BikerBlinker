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
      borderWidth: 16,
      overflow: 'scroll', 
      alignItems: "center",
      justifyContent: "center",
      height: '100%'
    },
    header: {
        color: "#F8DA00",
        textAlign: 'center',
        fontSize: 24,
    },
    touchable: {
      height: '500px'
    },
    subHeader: {
      color: "#F8DA00",
      textAlign: 'center',
      fontSize: 18
    },
    menu: {
      display: "flex", 
      height: "40%",
      width: "100%"
    }
  });

export const components = StyleSheet.create({
  menuText: {
    color: "white",
    fontSize: 32
  },
  menuBox: {
    width: '50%',
    height: '100%',
    alignItems: "center",
    justifyContent: "center",
  },
  main: {
    display: 'flex',
    flexDirection: 'row',
  },
  verticalRule: {
    borderLeftWidth: 6,
    borderLeftColor: 'white',
    borderStyle: 'dashed',
    height: '100%',
    position: 'absolute',
    left: '50%',
    marginLeft: -3,
    top: 0
  }
});
  