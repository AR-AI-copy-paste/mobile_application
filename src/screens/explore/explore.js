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

const ExplorePage = ({ navigation }) => {
  //UseState
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState(posts);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("images")
        .select()
        .match({ isPrivate: false });
      if (error) {
        return console.log(error);
      }

      const sorted = data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setPosts(sorted);
    })();
  }, []);

  useEffect(() => {
    if (search.length === 0) return setFilteredPosts(posts);
    const filtered = posts.filter((post) => {
      return post.label?.toLowerCase().includes(search.toLowerCase());
    });
    setFilteredPosts(filtered);
  }, [search]);

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
        onChangeText={(text) => {
          setSearch(text);
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
          {filteredPosts.map((post) => {
            return (
              <ImagePost
                key={post.id}
                userId={post.owner}
                post={post}
                navigation={navigation}
              />
            );
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
