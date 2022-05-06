//React import
import { useState, useEffect } from "react";

//React Native import
import {
  StyleSheet,
  Dimensions,
  View,
  TouchableOpacity,
  Image,
} from "react-native";

//Custom Components import
import CustomText from "../CustomText/CustomText";

//Dependencies import
import { SafeAreaView } from "react-native-safe-area-context";
import InteractionProvider from "react-native-interaction-provider";
import * as Generate from "project-name-generator";

//Assets import
import BackArrow from "../../assets/icons/backarrow.svg";
import Download from "../../assets/icons/download_white.svg";

const TakenPhoto = ({ setPhotoTaken, photoTaken }) => {
  // useState
  const [title, setTitle] = useState(Generate.generate().dashed);
  const [isBarActive, setisBarActive] = useState(true);

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
          onPress={() => setPhotoTaken(null)}
        >
          <BackArrow width={40} height={40} />
        </TouchableOpacity>

        {/* Title */}
        <CustomText fontWeight="bold">{title}</CustomText>

        {/* Save Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            width: 60,
            height: 30,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#000",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CustomText fontWeight="medium">Save</CustomText>
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
          <OptionBar isActive={isBarActive} />
        </InteractionProvider>
      </View>
    </SafeAreaView>
  );
};

const OptionBar = ({ isActive, ...rest }) => {
  return (
    <View
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
          height: 300,
          borderRadius: 100,
          backgroundColor: "rgba(0,0,0,0.4)",
          paddingVertical: 20,
          alignItems: "center",
        }}
      >
        <TouchableOpacity activeOpacity={0.8}>
          <Download height={30} width={30} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TakenPhoto;
