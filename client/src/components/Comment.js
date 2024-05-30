import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";


export default function Comment({comment}) {
  return (
    <View style={styles.commentContainer}>
      <View style={styles.header}>
        <Text style={styles.username}>{comment?.username}</Text>
        <Ionicons name="list-outline" size={20} style={styles.icon} />
      </View>
      <View style={styles.commentContent}>
        <Text style={styles.commentText}>
          {comment?.content}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  commentContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 10,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  username: {
    fontSize: 17,
    fontWeight: "600",
    color: "#333333",
  },
  icon: {
    paddingRight: 5,
    color: "#333333",
  },
  commentContent: {},
  commentText: {
    fontSize: 15,
    color: "#333333",
  },
});
