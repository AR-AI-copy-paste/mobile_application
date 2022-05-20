//React import
import { useEffect, useState, useRef } from "react";

//React Native import
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

//Custom components import
import LoadingSpinner from "../../components/loadingSpinner/loadingSpinner";
import TakenPhoto from "../../components/takenPhoto/takenPhoto";

//Dependencies import
import Toast from "react-native-toast-message";
import { Camera } from "expo-camera";
import { useIsFocused } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import TesseractOcr, {
  LANG_ENGLISH,
  useEventListener,
} from "react-native-tesseract-ocr";

//Supabase import
import { supabase } from "../../utils/supabase";
import { GOOGLE_CLOUD } from "@env";

//recoil import
import { useRecoilValue, useRecoilState } from "recoil";
import { authState, userProfileState } from "../../recoil/state";

//Assets import
import Bolt from "../../assets/icons/bolt.svg";
import BoltSlash from "../../assets/icons/bolt-slash.svg";
import Settings from "../../assets/icons/setting.svg";
import CameraChange from "../../assets/icons/camera-change.svg";
import KeepBackground from "../../assets/icons/image-plus.svg";
import RemoveBackground from "../../assets/icons/image-block.svg";
import TextIcon from "../../assets/icons/text.svg";
import Image from "../../assets/icons/image.svg";

import Constants from "expo-constants";

const HomePage = ({ navigation }) => {
  const { manifest } = Constants;

  //Use State
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [willRemoveBackground, setWillRemoveBackground] = useState(true);
  const [isTakingPic, setIsTakingPic] = useState(false);
  const [cameraMode, setCameraMode] = useState(true);
  const [processType, setProcessType] = useState(null);
  const [label, setLabel] = useState(null);

  const isFocused = useIsFocused();

  //Recoil State
  const auth = useRecoilValue(authState);
  const [_profile, setProfile] = useRecoilState(userProfileState);

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
        } else {
          const userResponse = await supabase
            .from("profiles")
            .select()
            .match({ id: auth.id });

          if (userResponse.error) {
            Toast.show({
              type: "error",
              text1: "Something went wrong",
              text2: error.message,
            });
            return setIsLoading(false);
          }

          setProfile(userResponse.data[0]);
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

  //Function for background removal mode
  const changeBackground = () => {
    setWillRemoveBackground(!willRemoveBackground);
  };

  const takePicture = async () => {
    try {
      const uri = `http://copycatserver.aimensahnoun.com`;

      if (isTakingPic) return;
      setIsTakingPic(true);
      if (cameraRef.current) {
        const options = { quality: 1, base64: true };
        const data = await cameraRef.current.takePictureAsync(options);
        const file = await ImageManipulator.manipulateAsync(
          data.uri,
          [{ resize: { width: 720, height: 1280 } }],
          {
            compress: 1,
            format: ImageManipulator.SaveFormat.JPEG,
            base64: true,
          }
        );

        if (cameraMode) {
          setProcessType("image");
          if (!willRemoveBackground) {
            let body = JSON.stringify({
              requests: [
                {
                  features: [
                    // { type: "LABEL_DETECTION", maxResults: 10 },
                    // { type: "LANDMARK_DETECTION", maxResults: 5 },
                    // { type: "FACE_DETECTION", maxResults: 5 },
                    // { type: "LOGO_DETECTION", maxResults: 5 },
                    // { type: "TEXT_DETECTION", maxResults: 5 },
                    // { type: "DOCUMENT_TEXT_DETECTION", maxResults: 5 },
                    { type: "SAFE_SEARCH_DETECTION", maxResults: 5 },
                    // { type: "IMAGE_PROPERTIES", maxResults: 5 },
                    // { type: "CROP_HINTS", maxResults: 5 },
                    { type: "WEB_DETECTION", maxResults: 5 },
                  ],
                  image: {
                    content: file.base64,
                  },
                },
              ],
            });

            let googleResponse = await fetch(
              "https://vision.googleapis.com/v1/images:annotate?key=" +
                GOOGLE_CLOUD,
              {
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                method: "POST",
                body: body,
              }
            );
            let responseJson = await googleResponse.json();

            if (
              responseJson.responses[0].safeSearchAnnotation.adult ===
                "LIKELY" ||
              responseJson.responses[0].safeSearchAnnotation.adult ===
                "POSSIBLE" ||
              responseJson.responses[0].safeSearchAnnotation.adult ===
                "VERY_LIKELY"
            ) {
              setIsTakingPic(false);
              return Toast.show({
                type: "error",
                text1: "Adult content not allowed",
              });
            }
            setLabel(
              responseJson.responses[0].webDetection.bestGuessLabels[0].label
            );
            setIsTakingPic(false);
            return setPhotoTaken(file);
          }

          const image = { type: "image", base64: file.base64, uri: file.uri };

          var response = await FileSystem.uploadAsync(
            `${uri}/expoObjectEx`,
            image.uri,
            {
              headers: {
                "content-type": "image/jpeg",
              },
              httpMethod: "POST",
              uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
            }
          );

          const imageUrl64 = JSON.parse(response.body).imgUri64;

          let body = JSON.stringify({
            requests: [
              {
                features: [
                  // { type: "LABEL_DETECTION", maxResults: 10 },
                  // { type: "LANDMARK_DETECTION", maxResults: 5 },
                  // { type: "FACE_DETECTION", maxResults: 5 },
                  // { type: "LOGO_DETECTION", maxResults: 5 },
                  // { type: "TEXT_DETECTION", maxResults: 5 },
                  // { type: "DOCUMENT_TEXT_DETECTION", maxResults: 5 },
                  { type: "SAFE_SEARCH_DETECTION", maxResults: 5 },
                  // { type: "IMAGE_PROPERTIES", maxResults: 5 },
                  // { type: "CROP_HINTS", maxResults: 5 },
                  { type: "WEB_DETECTION", maxResults: 5 },
                ],
                image: {
                  content: imageUrl64.split("data:image/png;base64,")[1],
                },
              },
            ],
          });

          let googleResponse = await fetch(
            "https://vision.googleapis.com/v1/images:annotate?key=" +
              GOOGLE_CLOUD,
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              method: "POST",
              body: body,
            }
          );
          let responseJson = await googleResponse.json();

          if (
            responseJson.responses[0].safeSearchAnnotation.adult === "LIKELY" ||
            responseJson.responses[0].safeSearchAnnotation.adult ===
              "POSSIBLE" ||
            responseJson.responses[0].safeSearchAnnotation.adult ===
              "VERY_LIKELY"
          ) {
            setIsTakingPic(false);
            return Toast.show({
              type: "error",
              text1: "Adult content not allowed",
            });
          }
          setLabel(
            responseJson.responses[0].webDetection.bestGuessLabels[0].label
          );
          setPhotoTaken(imageUrl64);
          setIsTakingPic(false);
        } else {
          let body = JSON.stringify({
            requests: [
              {
                features: [
                  // { type: "LABEL_DETECTION", maxResults: 10 },
                  // { type: "LANDMARK_DETECTION", maxResults: 5 },
                  // { type: "FACE_DETECTION", maxResults: 5 },
                  // { type: "LOGO_DETECTION", maxResults: 5 },
                  { type: "TEXT_DETECTION", maxResults: 5 },
                  { type: "DOCUMENT_TEXT_DETECTION", maxResults: 5 },
                  // { type: "SAFE_SEARCH_DETECTION", maxResults: 5 },
                  // { type: "IMAGE_PROPERTIES", maxResults: 5 },
                  // { type: "CROP_HINTS", maxResults: 5 },
                  // { type: "WEB_DETECTION", maxResults: 5 },
                ],
                image: {
                  content: file.base64,
                },
              },
            ],
          });

          let response = await fetch(
            "https://vision.googleapis.com/v1/images:annotate?key=" +
              GOOGLE_CLOUD,
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              method: "POST",
              body: body,
            }
          );
          let responseJson = await response.json();

          let text = responseJson.responses[0].textAnnotations[0].description;

          setProcessType("text");
          setPhotoTaken(text);
          setIsTakingPic(false);
        }
      }
    } catch (error) {
      setIsTakingPic(false);
      console.log(error);
    }
  };

  //Function for changing the processing mode
  const changeProcessMode = () => {
    setCameraMode(!cameraMode);
  };

  //Displaying the loading spinner before the data is loaded
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (photoTaken) {
    return (
      <TakenPhoto
        setPhotoTaken={setPhotoTaken}
        photoTaken={photoTaken}
        processType={processType}
      />
    );
  }

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return isFocused ? (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          display: isTakingPic ? "flex" : "none",
          position: "absolute",
          zIndex: 500,
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          width: "100%",
          height: "100%",
          justifyContent: "center",
          backgroundColor: "rgba(0,0,0,0.3)",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#fff" />
      </View>
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

          {/* Mode Change button */}
          <TouchableOpacity
            onPress={changeProcessMode}
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
            {cameraMode ? (
              <Image height={30} width={30} />
            ) : (
              <TextIcon height={30} width={30} />
            )}
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

          {/* Background state button */}
          <TouchableOpacity
            onPress={changeBackground}
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
            {willRemoveBackground === false ? (
              <KeepBackground height={30} width={30} />
            ) : (
              <RemoveBackground height={30} width={30} />
            )}
          </TouchableOpacity>

          {/* Settings button */}
          <TouchableOpacity
            onPress={() => navigation.push("Settings")}
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
            onPress={takePicture}
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
  ) : (
    <LoadingSpinner />
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
