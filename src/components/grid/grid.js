import { View, TouchableOpacity, Text } from "react-native";

const Grid = () => {
  return (
    <View style={styles.gridContainer}>
      <TouchableOpacity
        style={styles.item}
        onPress={() => alert("You tapped the button!")}
      >
        <Text style={styles.itemText}>1</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.item}
        onPress={() => alert("You tapped the button!")}
      >
        <Text style={styles.itemText}>2</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.item}
        onPress={() => alert("You tapped the button!")}
      >
        <Text style={styles.itemText}>3</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.item}
        onPress={() => alert("You tapped the button!")}
      >
        <Text style={styles.itemText}>4</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.item}
        onPress={() => alert("You tapped the button!")}
      >
        <Text style={styles.itemText}>5</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  gridContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 2,
  },
  item: {
    height: 120,
    width: 120,
    backgroundColor: "#ddd",
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  itemText: {
    fontSize: 20,
  },
});

export default Grid;
