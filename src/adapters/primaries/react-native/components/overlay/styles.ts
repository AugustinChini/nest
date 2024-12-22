import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  overlayContainer: { width: 400, display: "flex", flexDirection: "row" },
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: { backgroundColor: "rgba(200, 39, 39, 1)" },
  buttonView: { flex: 2, margin: 2 },
  input: { width: "100%" },
});

export default styles;
