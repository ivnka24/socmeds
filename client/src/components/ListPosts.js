import React, { useState } from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@apollo/client";
import { CREATE_LIKE, POST_QUERY } from "../query/query";
export default function ListPosts({ post }) {
  const navigation = useNavigation();
  const [click, setClicked] = useState(false);
  const handlerDetail = () => {
    navigation.navigate("Post Detail", {
      _id: post?._id,
    });
  };
  const [likeHandler, { data, loading, error }] = useMutation(
    CREATE_LIKE,
    {
      onCompleted: () => {
        setClicked((prevClick) => !prevClick);
        console.log(data);
      },
      refetchQueries: [POST_QUERY],
    },
    console.log(data)
  );
  return (
    <View
      style={{
        backgroundColor: "#fff",
        height: "auto",
        width: 420,
        flex: 1,
        marginBottom: 3,
      }}
    >
      <Text
        style={{
          paddingLeft: 6,
          fontSize: 20,
          fontWeight: "600",
        }}
      >
        {post?.Author.username}
      </Text>
      <View style={{ justifyContent: "center" }}>
        <Image
          source={{
            uri: post?.imgUrl || "",
          }}
          style={{
            width: "100%",
            height: 250,
            objectFit: "cover",
            marginTop: 10,
          }}
        ></Image>
      </View>
      <View
        style={{
          justifyContent: "flex-start",
          alignItems: "center",
          flexDirection: "row",
          marginLeft: 6,
          marginTop: 7,
        }}
      >
        <TouchableOpacity
          onPress={() =>
            likeHandler({
              variables: {
                id: post?._id,
              },
            })
          }
        >
          {click ? (
            <FontAwesome
              name="heart"
              size={30}
              style={{ marginRight: 10, paddingLeft: 5, color: "red" }}
            />
          ) : (
            <FontAwesome
              name="heart-o"
              size={30}
              style={{ marginRight: 10, paddingLeft: 5 }}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={handlerDetail}>
          <Ionicons name="chatbubble-outline" size={30} />
          {/* comment list */}
        </TouchableOpacity>
      </View>
      <View style={{ paddingLeft: 5, marginTop: 5 }}>
        <Text style={{ fontSize: 15, fontWeight: "400" }}>
          {post?.likes.length} <Text style={{ fontWeight: "600" }}>Likes</Text>
        </Text>
      </View>
      <View style={{ paddingLeft: 5, marginTop: 4 }}>
        <View
          style={{
            justifyContent: "flex-start",
            alignItems: "flex-start",
            flexDirection: "row",
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: "500", paddingRight: 2 }}>
            {post?.Author.username}
          </Text>
          <Text style={{ fontSize: 15 }}>{post?.content}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          {post?.tags.map((tag) => {
            return (
              <Text style={{ fontSize: 15, color: "#10439F" }}>#{tag} </Text>
            );
          })}
        </View>
      </View>
    </View>
  );
}
