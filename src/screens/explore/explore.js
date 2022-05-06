//Safe area import
import { SafeAreaView } from "react-native-safe-area-context";

//React Native import
import { StyleSheet, TextInput, View, Image, ScrollView , Animated } from "react-native";

//Custom components import
import CustomText from "../../components/CustomText/CustomText";

const ExplorePage = () => {
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
          {/* Image component */}
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
                height: "75%",
                width: "100%",
                borderRadius: 15,

                resizeMode: "cover",
              }}
              source={{
                uri: "https://images.unsplash.com/photo-1650241310135-84089b245660?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80",
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
                  Aimen Sahnoun
                </CustomText>
              </View>
            </View>
          </View>
          {/* Image component */}
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
                height: "75%",
                width: "100%",
                borderRadius: 15,

                resizeMode: "cover",
              }}
              source={{
                uri: "https://images.unsplash.com/photo-1504297050568-910d24c426d3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60",
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
                  Aimen Sahnoun
                </CustomText>
              </View>
            </View>
          </View>
          {/* Image component */}
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
                height: "75%",
                width: "100%",
                borderRadius: 15,

                resizeMode: "cover",
              }}
              source={{
                uri: "https://images.unsplash.com/photo-1650244369727-1efd30e797de?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60",
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
                  Aimen Sahnoun
                </CustomText>
              </View>
            </View>
          </View>
          {/* Image component */}
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
                height: "75%",
                width: "100%",
                borderRadius: 15,

                resizeMode: "cover",
              }}
              source={{
                uri: "https://images.unsplash.com/photo-1650228599110-5598b11c9b25?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60",
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
                  Aimen Sahnoun
                </CustomText>
              </View>
            </View>
          </View>
          {/* Image component */}
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
                height: "75%",
                width: "100%",
                borderRadius: 15,

                resizeMode: "cover",
              }}
              source={{
                uri: "https://images.unsplash.com/photo-1648737155328-0c0012cf2f20?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHw2fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60",
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
                  Aimen Sahnoun
                </CustomText>
              </View>
            </View>
          </View>
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
