import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Dimensions } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { useMutation } from "@apollo/client";
import { CREATE_CONTENT, POST_QUERY } from "../query/query";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { ActivityIndicator } from "react-native";

export default function PostContent() {
  const navigation = useNavigation();
  const [inputContent, setInputContent] = useState({
    content: "",
    imgUrl: "",
    tags: [],
  });
  const handlerChange = (key, value) => {
    if (key === "tags") {
      setInputContent({ ...inputContent, [key]: value.split(" ") });
    } else {
      setInputContent({ ...inputContent, [key]: value });
    }
  };

  const [handlerPostContent, { error, loading, data }] = useMutation(
    CREATE_CONTENT,
    {
      onCompleted: (data) => {
        navigation.navigate("Home");
        setInputContent({ content: "", imgUrl: "", tags: [] });
      },
      refetchQueries: [POST_QUERY],
    }
  );

  return (
    <>
      <SafeAreaProvider>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView
            style={{
              flex: 1,
              backgroundColor: "#fff",
              height: style.screenScale.height,
              width: style.screenScale.width,
            }}
          >
            <View
              style={{
                flex: 1,
                paddingLeft: 10,
                paddingRight: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  paddingTop: 7,
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <FontAwesome
                  name="user-circle-o"
                  size={30}
                  style={{ color: "black" }}
                ></FontAwesome>
                <Text
                  style={{ fontSize: 24, fontWeight: "500", marginRight: 167 }}
                >
                  Comment
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    handlerPostContent({
                      variables: {
                        input: {
                          content: inputContent.content,
                          imgUrl: inputContent.imgUrl,
                          tags: inputContent.tags,
                        },
                      },
                    })
                  }
                >
                  <View
                    style={{
                      backgroundColor: "#3897f0",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      alignContent: "center",
                      borderRadius: 10,
                      height: 45,
                      height: "auto",
                      marginRight: 7,
                      width: 90,
                    }}
                  >
                    <FontAwesome
                      name="send"
                      size={21}
                      color={"white"}
                      style={{ paddingRight: 5 }}
                    ></FontAwesome>
                    <Text
                      style={{
                        fontSize: 21,
                        textAlign: "center",
                        paddingRight: 10,
                        color: "white",
                      }}
                    >
                      Post
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              {loading && <ActivityIndicator size="large" color="#0000ff" />}
              {error && (
                <Text
                  style={{ textAlign: "center", fontSize: 30, color: "red" }}
                >
                  {error.message}
                </Text>
              )}
              <Text
                style={{
                  color: "black",
                  fontSize: 25,
                  fontWeight: "bold",
                  marginTop: 5,
                }}
              >
                Content
              </Text>
              <TextInput
                multiline={true}
                numberOfLines={3}
                maxLength={250}
                style={{
                  color: "black",
                  fontSize: 20,
                  textAlignVertical: "top",
                  borderWidth: 1,
                  borderColor: "#DBDBDB",
                  borderRadius: 5,
                }}
                placeholder="Tulis tentang momen-momen kecil yang membuat hari-harimu istimewa!"
                onChangeText={(value) => handlerChange("content", value)}
              ></TextInput>
              <Text
                style={{ color: "black", fontSize: 25, fontWeight: "bold" }}
              >
                Image
              </Text>
              <TextInput
                multiline={true}
                style={{
                  color: "black",
                  fontSize: 20,
                  borderWidth: 1,
                  borderColor: "#DBDBDB",
                  borderRadius: 1,
                }}
                placeholder="Tangkap momen terbaikmu hari ini dan bagi dengan kami! 📷✨"
                onChangeText={(value) => handlerChange("imgUrl", value)}
              />
              <Text
                style={{ color: "black", fontSize: 25, fontWeight: "bold" }}
              >
                Tags
              </Text>
              <TextInput
                multiline={true}
                numberOfLines={3}
                placeholder="Tambahkan tag yang mencerminkan momenmu, seperti '#Eksplorasi' atau '#PemandanganIndah'."
                style={{
                  color: "black",
                  fontSize: 20,
                  textAlignVertical: "top",
                  borderWidth: 1,
                  borderColor: "#DBDBDB",
                }}
                onChangeText={(value) => handlerChange("tags", value)}
              />
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </SafeAreaProvider>
    </>
  );
}

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const style = StyleSheet.create({
  screenScale: {
    height: windowHeight,
    width: windowWidth,
  },
});
