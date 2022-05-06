//React import
import { useEffect, useState, useRef } from "react";

//React Native import
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";

//Custom components import
import LoadingSpinner from "../../components/loadingSpinner/loadingSpinner";

//Dependencies import
import Toast from "react-native-toast-message";
import { Camera } from "expo-camera";

//Supabase import
import { supabase } from "../../utils/supabase";

//recoil import
import { useRecoilValue } from "recoil";
import { authState } from "../../recoil/state";

//Assets import
import Bolt from "../../assets/icons/bolt.svg";
import BoltSlash from "../../assets/icons/bolt-slash.svg";
import Settings from "../../assets/icons/setting.svg";
import CameraChange from "../../assets/icons/camera-change.svg";

const HomePage = ({ navigation }) => {
  //Use State
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);

  //Recoil State
  const auth = useRecoilValue(authState);

  //References
  const cameraRef = useRef(null);

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
          navigation.replace("OnBoading");
        }
        setIsLoading(false);
      })();
    } catch (error) {
      console.log(error);
    }
  }, []);

  //Getting permission to use the camera
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  //Function for switching the cameras
  const changeCamera = () => {
    setType(
      type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  //Function for switching the flash mode
  const changeFlash = () => {
    setFlash(
      flash === Camera.Constants.FlashMode.off
        ? Camera.Constants.FlashMode.torch
        : Camera.Constants.FlashMode.off
    );
  };

  //Displaying the loading spinner before the data is loaded
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      {/* Cameras */}
      <Camera
        style={styles.camera}
        type={type}
        ratio="16:9"
        ref={cameraRef}
        flashMode={flash}
      >
        <View
          style={{
            flex: 1,
            alignItems: "flex-end",
            marginTop: 60,
            marginRight: 5,
          }}
        >
          {/* Camera Change button */}
          <TouchableOpacity
            onPress={changeCamera}
            activeOpacity={0.8}
            style={{
              width: 40,
              height: 40,
              borderRadius: 50,
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <CameraChange height={30} width={30} />
          </TouchableOpacity>

          {/* Flash button */}
          <TouchableOpacity
            onPress={changeFlash}
            activeOpacity={0.8}
            style={{
              width: 40,
              height: 40,
              borderRadius: 50,
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            {flash === Camera.Constants.FlashMode.off ? (
              <Bolt height={30} width={30} />
            ) : (
              <BoltSlash height={30} width={30} />
            )}
          </TouchableOpacity>

          {/* Settings button */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              width: 40,
              height: 40,
              borderRadius: 50,
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Settings height={30} width={30} />
          </TouchableOpacity>
        </View>
        {/* Capture button View*/}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              width: 60,
              height: 60,
              borderRadius: 50,
              borderWidth: 5,
              borderColor: "white",
              justifyContent: "flex-end",

              alignSelf: "center",
            }}
          />
        </View>

        {/* Utility buttons view */}
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "flex-end",
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "white",
  },
});

export default HomePage;
