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
import { authState } from "../../recoil/state";


const LoginPage = ({ navigation }) => {
  //useState
  const [isLoading, setIsLoading] = useState(false);

  //Recoil
  const [_auth , setAuth] = useRecoilState(authState);

  //useForm
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    if (isLoading) return;
    setIsLoading(true);

    const { email, password } = data;

    try {
      const { user, error } = await supabase.auth.signIn({ email, password });

      if (error) {
        Toast.show({
          type: "error",
          text1: "Something went wrong",
          text2: error.message,
        });
        return setIsLoading(false);
      }

      setAuth(user);

      if (user) {
        Toast.show({
          type: "success",
          text1: "Logged in successfully",
        });
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);

      setIsLoading(false);
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
        <View
          style={{
            padding: 20,
          }}
        >
          <CustomText fontWeight="medium" fontSize={18}>
            Login
          </CustomText>
          <CustomText fontSize={18} style={{ marginBottom: "10%" }}>
            Welcome Back 😊
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

            <CustomText>Password:</CustomText>
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
                  - generated by stenography autopilot [ 🚗👩‍✈️ ]
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
            <CustomText style={{ alignSelf: "flex-end" }}>
              Forgot password?
            </CustomText>
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
                {isLoading ? "Loading..." : "Login"}
              </CustomText>
            </TouchableOpacity>
          </View>

          {/* Social Login */}
          <CustomText style={{ alignSelf: "center", marginBottom: 20 }}>
            OR
          </CustomText>

          <View
            style={{
              flexDirection: "row",
              alignSelf: "center",
              marginBottom: 20,
            }}
          >
            {/* Social Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={async () => {
                signInWithProvider("google");
              }}
              style={{
                width: 60,
                height: 60,
                backgroundColor: "#e5e5e5",
                borderRadius: 15,
                justifyContent: "center",
                alignItems: "center",
                marginRight: 20,
              }}
            >
              <Google width={40} height={40} />
            </TouchableOpacity>

            {/* Social Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={async () => {
                signInWithProvider("facebook");
              }}
              style={{
                width: 60,
                height: 60,
                backgroundColor: "#e5e5e5",
                borderRadius: 15,
                justifyContent: "center",
                alignItems: "center",
                marginRight: 20,
              }}
            >
              <Facebook width={40} height={40} />
            </TouchableOpacity>

            {/* Social Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={async () => {
                signInWithProvider("github");
              }}
              style={{
                width: 60,
                height: 60,
                backgroundColor: "#e5e5e5",
                borderRadius: 15,
                justifyContent: "center",
                alignItems: "center",
                marginRight: 20,
              }}
            >
              <Github width={40} height={40} />
            </TouchableOpacity>
          </View>

          {/* Forward to Sign Up */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.replace("SignUp")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CustomText>Don't have an account?</CustomText>

            <CustomText fontWeight="bold" style={{ marginLeft: 5 }}>
              Sign up
            </CustomText>
          </TouchableOpacity>
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

export default LoginPage;
