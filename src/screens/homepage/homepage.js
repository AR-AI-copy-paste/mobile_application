//React import
import { useEffect, useState, useRef } from "react";

//React Native import
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";

//Custom components import
import LoadingSpinner from "../../components/loadingSpinner/loadingSpinner";
import TakenPhoto from "../../components/takenPhoto/takenPhoto";

//Dependencies import
import Toast from "react-native-toast-message";
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";
import { useIsFocused } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
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
import Gallery from "../../assets/icons/gallery.svg";

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
  const [imageFromGallery, setImageFromGallery] = useState(null);
  const [textImage, setTextImage] = useState(null);
  const [cameraRatio, setCameraRatio] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const isFocused = useIsFocused();

  const uri = `https://copycatserver.aimensahnoun.com`;

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
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      setHasPermission(status === "granted");
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setIsTakingPic(true);
      setProcessType("image");
      await removeBackgroundFromImage(imageFromGallery);
    })();
  }, [imageFromGallery]);

  const prepareRatio = async () => {
    const array = await cameraRef.current.getSupportedRatiosAsync();
    const { height, width } = Dimensions.get("window");
    const screenRatio = height / width;
    let distances = {};
    let realRatios = {};
    let minDistance = null;
    for (const ratio of array) {
      const parts = ratio.split(":");
      const realRatio = parseInt(parts[0]) / parseInt(parts[1]);
      realRatios[ratio] = realRatio;
      // ratio can't be taller than screen, so we don't want an abs()
      const distance = screenRatio - realRatio;
      distances[ratio] = realRatio;
      if (minDistance == null) {
        minDistance = ratio;
      } else {
        if (distance >= 0 && distance < distances[minDistance]) {
          minDistance = ratio;
        }
      }
    }
    // set the best match
    let desiredRatio = minDistance;
    //  calculate the difference between the camera width and the screen height
    const remainder = Math.floor(
      (height - realRatios[desiredRatio] * width) / 2
    );
    setCameraRatio(desiredRatio);
  };

  const setCameraReady = async () => {
    await prepareRatio();
  };

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

  const getImageFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
      allowsEditing: true,
    });

    if (!result.cancelled) {
      const file = await ImageManipulator.manipulateAsync(
        result.uri,
        [{ resize: { width: 720, height: 1280 } }],
        {
          compress: 1,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        }
      );
      setImageFromGallery(file);
    }
  };

  //Function for removing background
  const removeBackgroundFromImage = async (file) => {
    try {
      var response = await fetch(`${uri}/objectEx`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          base64: file.base64,
        }),
      });

      const url = await response.json();

      const imageUrl64 = url.imgUri64;

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
        "https://vision.googleapis.com/v1/images:annotate?key=" + GOOGLE_CLOUD,
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
        responseJson.responses[0].safeSearchAnnotation.adult === "POSSIBLE" ||
        responseJson.responses[0].safeSearchAnnotation.adult === "VERY_LIKELY"
      ) {
        setIsTakingPic(false);
        return Toast.show({
          type: "error",
          text1: "Adult content not allowed",
        });
      }
      setLabel(responseJson.responses[0].webDetection.bestGuessLabels[0].label);

      setPhotoTaken(imageUrl64);
      setIsTakingPic(false);
    } catch (error) {
      setIsTakingPic(false);
    }
  };

  const takePicture = async () => {
    try {
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

          await removeBackgroundFromImage(file);
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
          setTextImage(file);
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

  if (photoTaken) {
    return (
      <TakenPhoto
        setPhotoTaken={setPhotoTaken}
        photoTaken={photoTaken}
        processType={processType}
        label={label}
        textImage={textImage}
      />
    );
  }

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
        onCameraReady={setCameraReady}
        style={styles.camera}
        type={type}
        ratio={cameraRatio}
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
          {cameraMode && (
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
          )}

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
          <TouchableOpacity activeOpacity={0.8} onPress={getImageFromGallery}>
            <Gallery height={40} width={40} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={takePicture}
            activeOpacity={0.8}
            style={{
              width: 60,
              height: 60,
              borderRadius: 50,
              borderWidth: 5,
              borderColor: "white",
            }}
          />

          <TouchableOpacity onPress={changeCamera} activeOpacity={0.8}>
            <CameraChange height={40} width={40} />
          </TouchableOpacity>
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
    flexDirection: "row",
    backgroundColor: "transparent",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    width: "100%",
    paddingHorizontal: 20,
    bottom: 20,
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
