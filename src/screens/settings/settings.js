//React Native import
import {
  StyleSheet,
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";

//Dependncies Import
import { SafeAreaView } from "react-native-safe-area-context";

//Custom components import
import CustomText from "../../components/CustomText/CustomText";

//Assets import
import Gallery from "../../assets/icons/images.svg";
import SignOut from "../../assets/icons/signout.svg";
import AccountSettings from "../../assets/icons/account-settings.svg";

//utils import
import { supabase } from "../../utils/supabase";

//Recoil import
import { useRecoilState, useRecoilValue } from "recoil";
import { authState, userProfileState } from "../../recoil/state";

const Settings = ({ navigation }) => {
  //Recoil State
  const [_auth, setAuth] = useRecoilState(authState);
  const userProfile = useRecoilValue(userProfileState);

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            flex: 1,
            padding: 20,
          }}
        >
          <CustomText fontSize={20} fontWeight="bold">
            Profile
          </CustomText>

          {/* User profile info */}
          <View
            style={{
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Image
              style={{
                width: 120,
                height: 120,
                borderRadius: 15,
                margin: 10,
              }}
              source={{
                uri: userProfile.ProfileImage,
              }}
            />

            <CustomText fontWeight="medium">{userProfile.fullName}</CustomText>
          </View>

          {/* Settings buttons */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",

              width: Dimensions.get("screen").width * 0.85,
              marginBottom: 20,
            }}
          >
            {/* View Profile Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                height: 50,
                width: "48%",
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#000",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CustomText fontWeight="medium" fontSize={18}>
                View Profile
              </CustomText>
            </TouchableOpacity>

            {/* Edit Profile Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.push("EditProfile")}
              style={{
                height: 50,
                width: "48%",
                borderRadius: 10,
                borderWidth: 1,
                backgroundColor: "#000",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CustomText color="#fff" fontSize={18} fontWeight="bold">
                Edit Profile
              </CustomText>
            </TouchableOpacity>
          </View>

          {/* Settings view */}
          <CustomText
            fontWeight="bold"
            style={{
              marginBottom: 20,
            }}
            fontSize={20}
          >
            Settings ⚙️
          </CustomText>

          {/* Explore Page tab */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.push("Explore")}
            style={{
              width: "100%",
              height: 150,
              borderColor: "#e5e5e5",
              borderWidth: 1,
              borderRadius: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 10,
            }}
          >
            {/* Icon */}
            <View
              style={{
                width: 50,
                height: 50,
                backgroundColor: "#e5e5e5",
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 20,
              }}
            >
              <Gallery width={35} height={35} />
            </View>

            {/* Text */}
            <View
              style={{
                flexDirection: "column",
              }}
            >
              <CustomText fontSize={20} fontWeight="medium">
                Explore
              </CustomText>
              <CustomText
                style={{ width: 200, color: "#a8a8a8" }}
                fontSize={14}
              >
                Find images shared by other users and implement them in your
                projects.
              </CustomText>
            </View>
          </TouchableOpacity>

          {/* Account Settings Page tab */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.push("AccountSettings")}
            style={{
              width: "100%",
              height: 150,
              borderColor: "#e5e5e5",
              borderWidth: 1,
              borderRadius: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 30,
            }}
          >
            {/* Icon */}
            <View
              style={{
                width: 50,
                height: 50,
                backgroundColor: "#e5e5e5",
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 20,
              }}
            >
              <AccountSettings width={35} height={35} />
            </View>

            {/* Text */}
            <View
              style={{
                flexDirection: "column",
              }}
            >
              <CustomText fontSize={20} fontWeight="medium">
                Account Settings
              </CustomText>
              <CustomText
                style={{ width: 200, color: "#a8a8a8" }}
                fontSize={14}
              >
                Change your authentication email and password.
              </CustomText>
            </View>
          </TouchableOpacity>

          {/* Logout Tab */}
          <TouchableOpacity
            onPress={() => {
              supabase.auth.signOut();
              setAuth(null);
            }}
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <SignOut width={35} height={35} />
            <CustomText
              fontWeight="medium"
              fontSize={20}
              style={{ marginLeft: 20 }}
            >
              Logout
            </CustomText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default Settings;
