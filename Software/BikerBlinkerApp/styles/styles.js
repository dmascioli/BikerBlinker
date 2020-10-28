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
        color: "white",
        textAlign: 'center',
        fontSize: 28,
        marginTop: 120
    },
    touchable: {
      height: '500px'
    },
    subHeader: {
      color: "white",
      textAlign: 'center',
      fontSize: 16,
      marginBottom: 160
    },
    menu: {
      display: "flex", 
      height: "40%",
      width: "100%"
    },
    menuItem: {
      borderTopColor: "#909590",
      width: 100,
      borderWidth: 1,
      padding: 30,
      borderLeftWidth: 0,
      borderRightWidth: 0,
      borderBottomWidth: 0
    },
    menuItemText: {
      color: "white",
      textAlign: "center",
      fontSize: 20,
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
    height: '100%'
  },
  verticalRule: {
    borderLeftWidth: 6,
    borderLeftColor: 'white',
    borderStyle: 'dashed'
  },
  arrow: {
    width: 150,
    height: 100
  }
});
  