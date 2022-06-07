//React Native import
import { Image, TouchableOpacity, View, Share } from "react-native";

//Dependencies import
import { SafeAreaView } from "react-native-safe-area-context";

//Custom Component import
import CustomText from "../../components/CustomText/CustomText";

//Assets import
import BackArrow from "../../assets/icons/backarrow.svg";
import Bookmark from "../../assets/icons/bookmark.svg";
import Download from "../../assets/icons/download.svg";
import Heart from "../../assets/icons/heart.svg";
import ShareIcon from "../../assets/icons/share.svg";

//Utils import
import { supabase } from "../../utils/supabase";

const ImageDetails = ({ navigation, route }) => {
  const { post, ownerUsername } = route.params;

  console.log(post, ownerUsername);

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      {/* Image */}
      <View
        style={{
          flex: 0.72,
          position: "relative",
        }}
      >
        <Image
          source={{ uri: post.imgUrl }}
          style={{
            height: "100%",
            width: "100%",
            resizeMode: "cover",
          }}
        />
        <View
          style={{
            position: "absolute",
            flexDirection: "row",
            top: 10,
            left: 0,
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
          }}
        >
          {/* Back button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.pop()}
            style={{
              width: 45,
              height: 45,
              borderRadius: 15,
              backgroundColor: "rgba(120,120,120,.9)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BackArrow width={40} height={40} />
          </TouchableOpacity>

          {/* Bookmark button */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              width: 45,
              height: 45,
              borderRadius: 15,
              backgroundColor: "rgba(120,120,120,0.9)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Bookmark width={30} height={30} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Image Details */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          width: "100%",
          height: "31.2%",
          flex: 0.33,
          backgroundColor: "white",
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          padding: 20,
          zIndex: 10,
        }}
      >
        <CustomText fontWeight="bold" fontSize={18}>
          {post.title}
        </CustomText>
        <CustomText fontWeight="medium">{ownerUsername}</CustomText>

        {/* Post Stats */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 5,
          }}
        >
          {/* Downloads */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                marginRight: 5,
              }}
            >
              <CustomText fontSize={13} fontWeight="bold">
                {post.downloads}
              </CustomText>
              <CustomText fontSize={13} fontWeight="medium">
                Downloads
              </CustomText>
            </View>
            <Download width={25} height={25} />
          </View>

          {/* Likes */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                marginRight: 5,
              }}
            >
              <CustomText fontSize={13} fontWeight="bold">
                {post.likes}
              </CustomText>
              <CustomText fontSize={13} fontWeight="medium">
                Likes
              </CustomText>
            </View>
            <Heart width={25} height={25} />
          </View>
        </View>

        {/* Action Buttons */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 10,
            width: "100%",
          }}
        >
          {/* Like Button */}
          <TouchableOpacity
            onPress={async () => {
              try {
                const { data, error } = await supabase.rpc("like", {
                  post_id: post.id,
                });
              } catch (error) {
                console.log(error);
              }
            }}
            activeOpacity={0.8}
            style={{
              width: "40%",
              height: 50,
              borderRadius: 15,
              backgroundColor: "black",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CustomText color="#fff" fontWeight="bold">
              Like
            </CustomText>
          </TouchableOpacity>

          {/* Download Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              width: "40%",
              height: 50,
              borderRadius: 15,
              backgroundColor: "black",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CustomText color="#fff" fontWeight="bold">
              Download
            </CustomText>
          </TouchableOpacity>

          {/* Share button */}
          <TouchableOpacity
            onPress={async () => {
              try {
                const result = await Share.share({
                  message: `This image was shared with you from CopyCat |   ${post.imgUrl}`,
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
                console.log(error);
              }
            }}
            activeOpacity={0.8}
            style={{
              width: "15%",
              height: 50,
              borderRadius: 15,
              borderWidth: 2,
              borderColor: "#000",
              backgroundColor: "transparent",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ShareIcon width={25} height={25} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ImageDetails;
