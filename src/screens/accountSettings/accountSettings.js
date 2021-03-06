//React import
import { useState } from "react";
//React Native import
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";

//Dependencies import
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import Toast from "react-native-toast-message";

//Custom components import
import CustomText from "../../components/CustomText/CustomText";

//Assets import
import Google from "../../assets/icons/google.svg";
import Facebook from "../../assets/icons/facebook.svg";
import Github from "../../assets/icons/github.svg";

//Supabase import
import { supabase, signInWithProvider } from "../../utils/supabase";

//Recoil import
import { useRecoilState } from "recoil";
import { authState, userProfileState } from "../../recoil/state";

const AccountSettings = ({ navigation }) => {
  //useState
  const [isLoading, setIsLoading] = useState(false);

  //Recoil
  const [_auth, setAuth] = useRecoilState(authState);
  const [userProfile, setUserProfile] = useRecoilState(userProfileState);

  //useForm
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: userProfile.email,
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data) => {
    if (isLoading) return;
    setIsLoading(true);

    const { email, password } = data;

    try {
      const { data, error } = await supabase.auth.update({
        email: email,
        password,
      });

      if (error) {
        Toast.show({
          type: "error",
          text1: "Something went wrong",
          text2: error.message,
        });

        if (email !== userProfile.email) {
          const userUpdateResponse = await supabase
            .from("profiles")
            .update([
              {
                email: email,
              },
            ])
            .match({ id: userProfile.id });
          setUserProfile(userUpdateResponse.data);
        }

        return setIsLoading(false);
      }

      Toast.show({
        type: "success",
        text1: "Account Details Successfully",
      });

      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
        }}
      >
        <View style={{ padding: 20, marginBottom: 50 }}>
          <CustomText fontWeight="bold" fontSize={18}>
            Account Settings
          </CustomText>

          {/* Form */}
          <View>
            <CustomText>Email:</CustomText>
            <Controller
              control={control}
              rules={{
                required: { value: true, message: "Email is required" },
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "invalid email address",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={styles.textInput}
                  placeholder="john.doe@email.com"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="email"
            />
            {errors.email && (
              <CustomText style={{ color: "#DC3545" }}>
                {errors.email.message}
              </CustomText>
            )}

            <CustomText>New Password:</CustomText>
            <Controller
              control={control}
              rules={{
                required: { value: true, message: "This is required." },
                minLength: {
                  message: "Password must be at least 6 characters long",
                  value: 6,
                },
              }}
              /*
                  This code is setting up a text input with the following properties
                  - generated by stenography autopilot [ ????????????????? ]
                  */
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  keyboardType="default"
                  style={styles.textInput}
                  autoCapitalize="none"
                  placeholder="******"
                  secureTextEntry={true}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="password"
            />
            {errors.password && (
              <CustomText style={{ color: "#DC3545" }}>
                {errors.password.message}
              </CustomText>
            )}

            <CustomText>Confirm Password:</CustomText>
            <Controller
              control={control}
              rules={{
                required: { value: true, message: "This is required." },
                minLength: {
                  message: "Password must be at least 6 characters long",
                  value: 6,
                },
                validate: (value) => {
                  return value === password || "Passwords do not match";
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  keyboardType="default"
                  style={styles.textInput}
                  autoCapitalize="none"
                  placeholder="******"
                  secureTextEntry={true}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="confirmPassword"
            />
            {errors.confirmPassword && (
              <CustomText style={{ color: "#DC3545" }}>
                {errors.confirmPassword.message}
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
                {isLoading ? "Loading..." : "Change Details"}
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
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

export default AccountSettings;
