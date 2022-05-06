//React Native
import { StyleSheet, ScrollView, View } from "react-native";

//Dependncies Import
import { SafeAreaView } from "react-native-safe-area-context";

//Custom components import
import CustomText from "../../components/CustomText/CustomText";

const Settings = ({ navigation }) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            flex: 1,
            padding: 20,
          }}
        >
          <CustomText fontSize={18} fontWeight="bold">
            Profile
          </CustomText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default Settings;
