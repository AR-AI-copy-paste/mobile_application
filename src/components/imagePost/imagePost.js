//React import
import { useState, useEffect } from "react";

//React Native import
import { View, Image } from "react-native";

//Custom Component import
import CustomText from "../../components/CustomText/CustomText";

//Utils import
import { supabase } from "../../utils/supabase";

const ImagePost = ({ userId, imgUrl }) => {
  //UseState
  const [ownerUsername, setOwnerUsername] = useState("");
  const gap = 6;

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("userName")
        .match({ id: userId });

      if (error) {
        return console.log(error);
      }

      setOwnerUsername(data[0].userName);
    })();
  }, []);

  return (
    <View
      style={{
        backgroundColor: "#fff",
        width: "48%",
        height: 200,
        elevation: 5,
        borderRadius: 15,
        marginHorizontal: gap / 2,
        marginBottom: gap * 2,
      }}
    >
      <Image
        style={{
          height: "80%",
          width: "100%",
          borderRadius: 15,

          resizeMode: "cover",
        }}
        source={{
          uri: imgUrl,
        }}
      />

      <View
        style={{
          height: "25%",
          width: "100%",
          padding: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <CustomText fontSize={13} style={{ marginRight: 3 }}>
            {ownerUsername}
          </CustomText>
        </View>
      </View>
    </View>
  );
};

export default ImagePost;
