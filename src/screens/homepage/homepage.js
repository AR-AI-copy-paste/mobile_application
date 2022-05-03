//React import
import { useEffect, useState } from "react";

//React Native import
import { Text, StyleSheet, View } from "react-native";

//Custom components import
import LoadingSpinner from "../../components/loadingSpinner/loadingSpinner";

//Dependencies import
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";

//Supabase import
import { supabase } from "../../utils/supabase";

//recoil import
import { useRecoilValue } from "recoil";
import { authState } from "../../recoil/state";

const HomePage = ({ navigation }) => {
  //Use State
  const [isLoading, setIsLoading] = useState(true);

  //Recoil State
  const auth = useRecoilValue(authState);

  //Checking is user has a profile
  useEffect(() => {
    try {
      (async () => {
        const { data, error } = await supabase
          .from("profiles")
          .select()
          .match({ id: auth.id });

        if (error) {
          Toast.show({
            type: "error",
            text1: "Something went wrong",
            text2: error.message,
          });
          return setIsLoading(false);
        }

        if (data.length === 0) {
          console.log("No Profile");
        }
        setIsLoading(false);
      })();
    } catch (error) {
      console.log(error);
    }
  }, []);

  //Displaying the loading spinner before the data is loaded
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView>
      <Text>HomePage</Text>
    </SafeAreaView>
  );
};

export default HomePage;
