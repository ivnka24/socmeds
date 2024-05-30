import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Dimensions } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Comment from "../components/Comment";
import { useRoute } from "@react-navigation/native";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_COMMENT, POSTBYID_QUERY } from "../query/query";
import { Ionicons } from "@expo/vector-icons";

export default function PostDetail() {
  const route = useRoute();
  const { _id } = route.params;
  console.log(_id, "<<<<<");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [postById, setPostById] = useState(null);

  const { loading, error, data } = useQuery(POSTBYID_QUERY, {
    variables: { id: _id },
  });
  // comments
  useEffect(() => {
    if (data && data.getPostById && data.getPostById.comments) {
      setPostById(data.getPostById);
    }
  }, [data]);

  const [commentHandler] = useMutation(CREATE_COMMENT, {
    onCompleted: async (data) => {
      setMessage(data.createComment.message);
      setContent("");
      Alert.alert("Message", message);
    },
    variables: {
      id: _id,
    },
    refetchQueries: [POSTBYID_QUERY],
  });
  // handler comment post mutation => refetch => 

  if (loading) {
    return <ActivityIndicator size="large" color="#007bff" />;
  }
  if (error) {
    return (
      <Text style={{ color: "red", fontSize: 20, textAlign: "center" }}>
        {error}
      </Text>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ backgroundColor: "#FFFFFF", flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -300}
        >
          <ScrollView>
            <Text
              style={{
                textAlign: "center",
                fontSize: 25,
                marginBottom: 20,
                marginTop: 20,
                fontWeight: "600",
                color: "#000000",
              }}
            >
              Commentar
            </Text>
            {postById &&
              postById.comments.map((el, i) => {
                return <Comment key={i} comment={el} />;
              })}
            {postById && !postById.comments.length && (
              <Text style={styles.noCommentText}>Tidak Ada Komentar</Text>
            )}
          </ScrollView>
          {/*Commentar Post  */}
          <View style={styles.commentInputContainer}>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name="person-circle-outline"
                size={45}
                color="#000000"
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Leave reply. Use @ to mention"
                style={styles.input}
                placeholderTextColor="#A0A0A0"
                value={content}
                onChangeText={(text) => setContent(text)}
              />
              {/* button post */}
              <TouchableOpacity
                style={styles.sendButton}
                underlayColor="#FFFFFF"
                onPress={() =>
                  commentHandler({
                    variables: {
                      input: {
                        content: content,
                      },
                    },
                  })
                }
              >
                <FontAwesome name="send" size={23} color="#A0A0A0" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  screenScale: {
    height: windowHeight,
    width: windowWidth,
  },
  commentInputContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    backgroundColor: "#FFFFFF",
    width: windowWidth / 1,
    height: 70,
    paddingLeft: 10,
    borderWidth: 0.5,
    borderColor: "#ECECEC",
    borderRadius: 4,
    marginHorizontal: 0,
    marginVertical: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    marginRight: 45,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F6F6F6",
    borderRadius: 15,
    borderWidth: 1,
    flex: 4,
    paddingLeft: 10,
    paddingRight: 10,
  },
  input: {
    color: "#000000",
    height: 40,
    textAlign: "left",
    flex: 4,
  },
  sendButton: {
    marginLeft: 5,
    justifyContent: "center",
    alignItems: "start",
    padding: 10,
  },
  noCommentText: {
    textAlign: "center",
    fontSize: 25,
    color: "#808080",
    marginTop: 50,
  },
});
