//React import
import { useState, useEffect } from "react";

//Expo import
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

//React native import
import { ActivityIndicator, View } from "react-native";

//Dependencies import
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RecoilRoot, useRecoilState } from "recoil";
import "react-native-url-polyfill/auto";
import Toast from "react-native-toast-message";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

//Custom components import
import LoadingSpinner from "./src/components/loadingSpinner/loadingSpinner";

//Screens import
import LoginPage from "./src/screens/loginScreen/loginScreen";
import SignUpScreen from "./src/screens/signupScreen/signupScreen";

//Supabase import
import { supabase } from "./src/utils/supabase";
import { authState } from "./src/recoil/state";
import HomePage from "./src/screens/homepage/homepage";

export default function App() {
  return (
    <SafeAreaProvider>
      <RecoilRoot>
        <MyApp />
      </RecoilRoot>
    </SafeAreaProvider>
  );
}

function MyApp() {
  //FontLoader
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  console.log("Font: ", fontsLoaded);

  //Recoil state
  const [auth, setAuth] = useRecoilState(authState);

  //useState
  const [isLoading, setIsLoading] = useState(true);

  //React navigation
  const Stack = createNativeStackNavigator();

  useEffect(() => {
    //Checking if user is already logged in
    const userObject = supabase.auth.user();
    setAuth(userObject);
    setIsLoading(false);
  }, [supabase.auth.user()]);

  return fontsLoaded && !isLoading ? (
    !auth ? (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </Stack.Navigator>
        <Toast />
      </NavigationContainer>
    ) : (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Home" component={HomePage} />
        </Stack.Navigator>
        <Toast />
      </NavigationContainer>
    )
  ) : (
    <LoadingSpinner />
  );
}
