import { StyleSheet } from "react-native";

export default StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000044'
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  drawer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width:250,
    backgroundColor: "#333",
    top:0,
  }
});