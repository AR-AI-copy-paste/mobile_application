//React import
import { useState, useEffect } from "react";

//Safe area import
import { SafeAreaView } from "react-native-safe-area-context";

//React Native import
import {
  StyleSheet,
  TextInput,
  View,
  Image,
  ScrollView,
  Animated,
} from "react-native";

//Custom components import
import CustomText from "../../components/CustomText/CustomText";
import ImagePost from "../../components/imagePost/imagePost";

//Utils import
import { supabase } from "../../utils/supabase";

const ExplorePage = () => {
  //UseState
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("images")
        .select()
        .match({ isPrivate: false });
      if (error) {
        return console.log(error);
      }

      setPosts(data);
    })();
  }, []);

  const gap = 6;

  return (
    <SafeAreaView style={styles.container}>
      <CustomText fontSize={30} fontWeight="bold">
        Explore
      </CustomText>

      <TextInput
        style={{
          width: "100%",
          borderColor: "#000",
          borderWidth: 1,
          borderRadius: 15,
          height: 50,
          padding: 10,
          marginBottom: 20,
        }}
        placeholder="Search images..."
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            width: "100%",
            paddingHorizontal: gap / -2,
            paddingVertical: gap / 2,
          }}
        >
          {posts.map((post) => {
            return <ImagePost userId={post.owner} imgUrl={post.imgUrl}/>;
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
});

export default ExplorePage;
