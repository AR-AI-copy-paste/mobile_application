//React import
import { useState } from "react";

//React Native import
import {
  View,
  TouchableOpacity,
  Image,
  Animated,
  TextInput,
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

//Assets import
import BackArrow from "../../assets/icons/backarrow.svg";
import Download from "../../assets/icons/download_white.svg";
import Locked from "../../assets/icons/lock.svg";
import Unlocked from "../../assets/icons/unlock.svg";

//Utils import
import { uploadImage } from "../../utils/ipfs_storage";
import { supabase } from "../../utils/supabase";

const TakenPhoto = ({ setPhotoTaken, photoTaken }) => {
  // useState
  const [title, setTitle] = useState(Generate.generate().dashed);
  const [originalTitle, setOriginalTitle] = useState(title);
  const [isBarActive, setisBarActive] = useState(true);
  const [isPrivate, setIsPrivate] = useState(true);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const submitImage = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const imageUrl = await uploadImage(photoTaken.uri);

      const { _data, error } = await supabase.from("images").insert({
        title,
        imgUrl: imageUrl,
        owner: supabase.auth.user().id,
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
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Something went wrong",
        text2: error.message,
      });
    }
  };

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
      <View
        style={{
          flex: 1,
          flexGrow: 1,
          alignSelf: "stretch",
          backgroundColor: "#000",
          position: "relative",
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setisBarActive(true)}
        >
          <Image
            source={{
              uri: photoTaken.uri,
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
          />
        </InteractionProvider>
      </View>
    </SafeAreaView>
  );
};

const OptionBar = ({
  isActive,
  photoTaken,
  isPrivate,
  setIsPrivate,
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
          height: 130,
          borderRadius: 100,
          backgroundColor: "rgba(0,0,0,0.4)",
          paddingVertical: 20,
          alignItems: "center",
        }}
      >
        {/* Download button */}
        <TouchableOpacity
          style={{ marginBottom: 20 }}
          activeOpacity={0.8}
          onPress={async () => {
            try {
              await MediaLibrary.saveToLibraryAsync(photoTaken.uri);
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
      </View>
    </Animated.View>
  );
};

export default TakenPhoto;
