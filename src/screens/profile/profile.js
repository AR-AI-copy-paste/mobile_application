//React Native import
import { View, TouchableOpacity, Image, ScrollView } from "react-native";

//Dependencies import
import { SafeAreaView } from "react-native-safe-area-context";

//Custom components import
import CustomText from "../../components/CustomText/CustomText";

//Asset import
import BackArrow from "../../assets/icons/backarrow.svg";

//Recoil import
import { useRecoilValue } from "recoil";
import { userProfileState } from "../../recoil/state";

const Profile = ({ navigation }) => {
  //Recoil State
  const userProfile = useRecoilValue(userProfileState);

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          marginVertical: 20,
        }}
      >
        <View
          style={{
            marginHorizontal: 20,
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Back Arrow */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.pop()}
            >
              <BackArrow width={40} height={40} />
            </TouchableOpacity>

            <CustomText fontWeight="bold" fontSize={18}>
              Profile
            </CustomText>

            <View></View>
          </View>

          {/* User Info */}
          <View
            style={{
              alignItems: "center",
            }}
          >
            <Image
              source={{ uri: userProfile.ProfileImage }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 15,
                margin: 10,
              }}
            />
            <CustomText fontSize={17} fontWeight="bold" style={{}}>
              {userProfile.fullName}
            </CustomText>
            <CustomText color="gray">@{userProfile.userName}</CustomText>
          </View>

          {/* Horizontal Line */}
          <View
            style={{
              alignSelf: "center",
              height: 2,
              marginVertical: 15,
              width: "90%",
              backgroundColor: "rgba(128,128,128,0.2)",
            }}
          />

          {/* User Stats */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignSelf: "center",
              width: "90%",
              alignItems: "center",
            }}
          >
            {/* Scans stat */}
            <View style={{ alignItems: "center" }}>
              <CustomText fontWeight="bold">{userProfile.scans}</CustomText>
              <CustomText>Scans</CustomText>
            </View>

            {/* Scans stat */}
            <View style={{ alignItems: "center" }}>
              <CustomText fontWeight="bold">
                {userProfile.totalViews}
              </CustomText>
              <CustomText>Views</CustomText>
            </View>

            {/* Scans stat */}
            <View style={{ alignItems: "center" }}>
              <CustomText fontWeight="bold">
                {userProfile.totalDownload}
              </CustomText>
              <CustomText>Downloads</CustomText>
            </View>
          </View>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              width: "100%",
              height: "100%",
              marginTop: 10,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              flex: 1,
            }}
          ></View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
