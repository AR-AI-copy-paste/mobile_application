//React Native import
import { View, ActivityIndicator, StyleSheet } from "react-native";

const LoadingSpinner = () => {
  return (
    <View style={styles.pageContainer}>
      <ActivityIndicator size="large" color="#000" />
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoadingSpinner;
