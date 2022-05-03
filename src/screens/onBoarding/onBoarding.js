//React import
import { useState } from "react";

//React Native import
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";

//Dependencies import
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";

//Custom components import
import CustomText from "../../components/CustomText/CustomText";

//Assets import
import Upload from "../../assets/icons/upload.svg";
import Delete from "../../assets/icons/delete.svg";

const OnBoading = ({ navigation }) => {
  //useState
  const [isLoading, setIsLoading] = useState(false);

  //useForm
  const {
    control,
    handleSubmit,

    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      fullName: "",
    },
  });

  const onSubmit = async (data) => {};

  return (
    <SafeAreaView style={styles.screenContainer}>
      <CustomText
        fontSize={18}
        fontWeight="bold"
        style={{
          marginBottom: 20,
        }}
      >
        Create a profile
      </CustomText>

      {/* Image Container */}
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          marginBottom: 20,
        }}
      >
        <Image
          source={{
            uri: "https://bafybeihj2j6solt4kbl6doc7w2vw7e5eqgc66fsuzpattjnn4mjhxici7y.ipfs.dweb.link/avatar.png",
          }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 15,
            marginBottom: 20,
            resizeMode: "cover",
          }}
        />

        {/* Image actions container */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            position: "absolute",
            bottom: 5,
          }}
        >
          {/* Upload Button */}
          <View
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              elevation: 3,
              backgroundColor: "#fff",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 8,
            }}
          >
            <Upload height={20} width={20} />
          </View>

          {/* Delete Button */}
          <View
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              elevation: 3,
              backgroundColor: "#fff",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Delete height={20} width={20} />
          </View>
        </View>
      </View>

      {/* Form */}
      <View>
        <CustomText>Username:</CustomText>
        <Controller
          control={control}
          rules={{
            required: { value: true, message: "Username is required" },
            minLength: {
              value: 3,
              message: "Usename needs to be at least 3 characters",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              autoCapitalize="none"
              keyboardType="default"
              style={styles.textInput}
              placeholder="john.doe"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="username"
        />
        {errors.username && (
          <CustomText style={{ color: "#DC3545" }}>
            {errors.username.message}
          </CustomText>
        )}

        <CustomText>Full Name:</CustomText>
        <Controller
          control={control}
          rules={{
            required: { value: true, message: "Full Name is required." },
            minLength: {
              message: "Full Name needs to be at least 3 characters long",
              value: 3,
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              keyboardType="default"
              style={styles.textInput}
              autoCapitalize="none"
              placeholder="John Doe"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="fullName"
        />
        {errors.fullName && (
          <CustomText style={{ color: "#DC3545" }}>
            {errors.fullName.message}
          </CustomText>
        )}

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          activeOpacity={0.8}
          style={{
            width: "100%",
            backgroundColor: "#000",
            height: 60,
            borderRadius: 15,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
            marginBottom: 20,
          }}
        >
          <CustomText
            fontSize={18}
            fontWeight="bold"
            style={{ color: "white" }}
          >
            {isLoading ? "Loading..." : "Create Profile"}
          </CustomText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    padding: 20,
  },
  textInput: {
    backgroundColor: "#e5e5e5",
    height: 60,
    padding: 10,
    borderRadius: 15,
    marginBottom: 10,
    fontFamily: "Poppins_400Regular",
  },
});

export default OnBoading;
