//React import
import { useState, useEffect } from "react";

//React Native import
import {
  View,
  TouchableOpacity,
  Image,
  Animated,
  TextInput,
  BackHandler,
  ScrollView,
  Text,
  Share,
} from "react-native";

//Custom Components import
import CustomText from "../CustomText/CustomText";

//Dependencies import
import { SafeAreaView } from "react-native-safe-area-context";
import InteractionProvider from "react-native-interaction-provider";
import * as Generate from "project-name-generator";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import * as ImageManipulator from "expo-image-manipulator";
import * as Clipboard from "expo-clipboard";
import { io } from "socket.io-client";

//Assets import
import BackArrow from "../../assets/icons/backarrow.svg";
import Download from "../../assets/icons/download_white.svg";
import Locked from "../../assets/icons/lock.svg";
import Unlocked from "../../assets/icons/unlock.svg";
import Send from "../../assets/icons/message.svg";
import ClipboardIcon from "../../assets/icons/clipboard.svg";
import ShareIcon from "../../assets/icons/share-white.svg";

//Utils import
import { uploadImage } from "../../utils/ipfs_storage";
import { supabase } from "../../utils/supabase";

const TakenPhoto = ({
  setPhotoTaken,
  photoTaken,
  processType,
  label,
  textImage,
}) => {
  // useState
  const [title, setTitle] = useState(Generate.generate().dashed);
  const [originalTitle, setOriginalTitle] = useState(title);
  const [isBarActive, setisBarActive] = useState(true);
  const [isPrivate, setIsPrivate] = useState(true);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [compressFile, setFile] = useState(null);
  const [webSocket, setWebSocket] = useState(null);
  const [isSending, setIsSending] = useState(false);

  console.log("Label: ", label);

  const submitImage = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const imageUrl =
        processType == "image"
          ? await uploadImage(
              photoTaken.uri ? photoTaken.uri : compressFile.uri
            )
          : await uploadImage(textImage.uri);

      if (processType == "image") {
        const { _data, error } = await supabase.from("images").insert({
          title,
          imgUrl: imageUrl,
          owner: supabase.auth.user().id,
          label: label,
          isPrivate,
        });

        if (error) {
          Toast.show({
            type: "error",
            text1: "Something went wrong",
            text2: error.message,
          });
          return setIsLoading(false);
        }

        Toast.show({
          type: "success",
          text1: "Photo uploaded successfully",
        });

        setIsLoading(false);
        setPhotoTaken(null);
      } else {
        const { _data, error } = await supabase.from("text").insert({
          title,
          originalImage: imageUrl,
          owner: supabase.auth.user().id,
          text: photoTaken,
          isPrivate,
        });

        if (error) {
          Toast.show({
            type: "error",
            text1: "Something went wrong",
            text2: error.message,
          });
          return setIsLoading(false);
        }

        Toast.show({
          type: "success",
          text1: "Text uploaded successfully",
        });

        setIsLoading(false);
        setPhotoTaken(null);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Something went wrong",
        text2: error.message,
      });
    }
  };

  //useEffect
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        setPhotoTaken(false);
        return true;
      }
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    (async () => {
      const filename =
        FileSystem.documentDirectory + `${new Date().getTime()}.png`;
      await FileSystem.writeAsStringAsync(
        filename,

        photoTaken.split("data:image/png;base64,")[1],
        {
          encoding: FileSystem.EncodingType.Base64,
        }
      );

      const compressedFile = await ImageManipulator.manipulateAsync(
        filename,
        [],
        { compress: 0.3, base64: true, format: ImageManipulator.SaveFormat.PNG }
      );

      setFile(compressedFile);
    })();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          padding: 20,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Back button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            if (isLoading) return;
            setPhotoTaken(null);
          }}
        >
          <BackArrow width={40} height={40} />
        </TouchableOpacity>

        {/* Title */}
        {!isEditingTitle ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setIsEditingTitle(true);
            }}
          >
            <CustomText fontWeight="bold">{title}</CustomText>
          </TouchableOpacity>
        ) : (
          <TextInput
            onBlur={() => setIsEditingTitle(false)}
            value={title}
            style={{
              fontWeight: "bold",
              fontFamily: "Poppins_700Bold",
            }}
            onChangeText={(value) => {
              setTitle(value);
            }}
          />
        )}

        {/* Save Button */}
        <TouchableOpacity
          onPress={submitImage}
          activeOpacity={0.8}
          style={{
            width: 80,
            height: 30,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#000",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CustomText fontWeight="medium">
            {isLoading ? "Loading..." : "Save"}
          </CustomText>
        </TouchableOpacity>
      </View>

      {/* Image */}
      {processType == "image" ? (
        <View
          style={{
            flex: 1,
            flexGrow: 1,
            alignSelf: "stretch",
            backgroundColor: "#fff",
            position: "relative",
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setisBarActive(true)}
          >
            <Image
              source={{
                uri: photoTaken.uri ? photoTaken.uri : photoTaken,
              }}
              style={{
                width: "100%",
                height: "100%",
                resizeMode: "cover",
              }}
            />
          </TouchableOpacity>

          <InteractionProvider
            timeout={5 * 1000} // idle after 1m
            onActive={() => setisBarActive(true)}
            onInactive={() => setisBarActive(false)}
          >
            <OptionBar
              isActive={isBarActive}
              photoTaken={photoTaken}
              isPrivate={isPrivate}
              setIsPrivate={setIsPrivate}
              compressFile={compressFile}
              webSocket={webSocket}
              processType={processType}
              isSending={isSending}
              setIsSending={setIsSending}
            />
          </InteractionProvider>
        </View>
      ) : (
        <>
          <ScrollView
            style={{
              flex: 1,
              backgroundColor: "white",
            }}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setisBarActive(true)}
              style={{
                flex: 1,
                padding: 20,
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                }}
              >
                {photoTaken}
              </Text>
            </TouchableOpacity>
            <InteractionProvider
              timeout={5 * 1000} // idle after 1m
              onActive={() => setisBarActive(true)}
              onInactive={() => setisBarActive(false)}
            >
              <OptionBar
                isActive={isBarActive}
                photoTaken={photoTaken}
                isPrivate={isPrivate}
                setIsPrivate={setIsPrivate}
                compressFile={compressFile}
                webSocket={webSocket}
                processType={processType}
                isSending={isSending}
                setIsSending={setIsSending}
              />
            </InteractionProvider>
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
};

const OptionBar = ({
  isActive,
  photoTaken,
  isPrivate,
  setIsPrivate,
  compressFile,
  webSocket,
  processType,
  isSending,
  setIsSending,
  ...rest
}) => {
  return (
    <Animated.View
      {...rest}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flex: 1,
        zIndex: 100,
        justifyContent: "center",
        alignItems: "flex-end",
        paddingRight: 10,
        opacity: isActive ? 1 : 0,
      }}
    >
      <View
        style={{
          width: 50,
          height: processType == "image" ? 170 : 220,
          borderRadius: 100,
          backgroundColor: "rgba(0,0,0,0.4)",
          paddingVertical: 20,
          alignItems: "center",
        }}
      >
        {/* Download button */}
        {processType == "image" ? (
          <>
            <TouchableOpacity
              style={{ marginBottom: 20 }}
              activeOpacity={0.8}
              o
              onPress={async () => {
                try {
                  await MediaLibrary.saveToLibraryAsync(
                    photoTaken.uri ? photoTaken.uri : compressFile.uri
                  );
                  Toast.show({
                    type: "success",
                    text1: "Photo saved to gallery successfully",
                  });
                } catch (error) {
                  Toast.show({
                    type: "error",
                    text1: "Something went wrong",
                    text2: error.message,
                  });
                }
              }}
            >
              <Download height={30} width={30} />
            </TouchableOpacity>

            {/* Private/Public button */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={{ marginBottom: 20 }}
              onPress={async () => {
                setIsPrivate(!isPrivate);
              }}
            >
              {isPrivate ? (
                <Locked height={30} width={30} />
              ) : (
                <Unlocked height={30} width={30} />
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Private/Public button */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={{ marginBottom: 20 }}
              onPress={async () => {
                setIsPrivate(!isPrivate);
              }}
            >
              {isPrivate ? (
                <Locked height={30} width={30} />
              ) : (
                <Unlocked height={30} width={30} />
              )}
            </TouchableOpacity>
            {/* // Copy to clipboard button */}
            <TouchableOpacity
              style={{ marginBottom: 20 }}
              activeOpacity={0.8}
              onPress={async () => {
                try {
                  await Clipboard.setStringAsync(photoTaken);
                  Toast.show({
                    type: "success",
                    text1: "Text Copied to clipboard",
                  });
                } catch (error) {
                  Toast.show({
                    type: "error",
                    text1: "Something went wrong",
                    text2: error.message,
                  });
                }
              }}
            >
              <ClipboardIcon height={30} width={30} />
            </TouchableOpacity>

            {/* Share text button */}
            <TouchableOpacity
              style={{ marginBottom: 20 }}
              activeOpacity={0.8}
              onPress={async () => {
                try {
                  const result = await Share.share({
                    message: `This text was scanned using CopyCat:\n\n\n${photoTaken}`,
                  });
                  if (result.action === Share.sharedAction) {
                    if (result.activityType) {
                      // shared with activity type of result.activityType
                    } else {
                      // shared
                    }
                  } else if (result.action === Share.dismissedAction) {
                    // dismissed
                  }
                } catch (error) {
                  Toast.show({
                    type: "error",
                    text1: "Something went wrong",
                    text2: error.message,
                  });
                }
              }}
            >
              <ShareIcon height={30} width={30} />
            </TouchableOpacity>
          </>
        )}
        {/* Share button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={async () => {
            try {
              if (isSending) return;
              setIsSending(true);
              const message =
                processType === "image"
                  ? photoTaken.uri
                    ? photoTaken.uri
                    : compressFile.uri
                  : photoTaken;

              const manipulator =
                processType === "image"
                  ? await ImageManipulator.manipulateAsync(
                      message,
                      [{ resize: { width: 720, height: 1280 } }],
                      {
                        compress: 0.3,
                        format: ImageManipulator.SaveFormat.PNG,
                        base64: true,
                      }
                    )
                  : null;

              const messageObject = {
                type: processType,
                message:
                  processType === "image" ? manipulator.base64 : photoTaken,
              };

              const socket = io("https://capstoneserver-2.herokuapp.com");

              socket.on("connect", () => {
                console.log("connected");
                Toast.show({
                  type: "success",
                  position: "bottom",
                  text1: "Connected to desktop app successfully",
                });
                socket.emit("message", JSON.stringify(messageObject));
                setTimeout(() => {
                  socket.disconnect();
                }, 13000);
                setIsSending(false);
              });
            } catch (e) {
              console.log(e);
            }
          }}
        >
          <Send height={30} width={30} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default TakenPhoto;
