import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@apollo/client";
import { FOLLOWING_FOLLOWERS_QUERY } from "../query/query";

const Profile = () => {
  const { data, loading, error } = useQuery(FOLLOWING_FOLLOWERS_QUERY);
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
      </SafeAreaView>
    );
  }
  console.log(error);
  const {Followers, Followings, username} = data.userById
  console.log(data);
  if(loading){
    return <Text style={{fontSize: 25, textAlign: 'center'}}>Loading....</Text>
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          ...styles.profileContainer,
          marginHorizontal: 15,
          marginTop: 5,
        }}
      >
        <View style={styles.header}>
          <Ionicons
            name="person-circle-outline"
            size={100}
            color="black"
            style={styles.profileIcon}
          />
          <Text style={styles.username}>{username}</Text>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.followersContainer}>
            <Ionicons
              name="people"
              size={24}
              color="black"
              style={styles.icon}
            />
            <Text style={styles.followersText}>
              Followers: {Followers?.length}
            </Text>
          </View>
          <View style={styles.followingsContainer}>
            <Ionicons
              name="people"
              size={24}
              color="black"
              style={styles.icon}
            />
            <Text style={styles.followingsText}>
              Following: {Followings?.length}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  profileContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileIcon: {
    marginRight: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    textShadowColor: "#ccc",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  followersContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    padding: 10,
  },
  followersText: {
    marginLeft: 5,
    fontSize: 16,
  },
  followingsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    padding: 10,
  },
  followingsText: {
    marginLeft: 5,
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
  },
});

export default Profile;
