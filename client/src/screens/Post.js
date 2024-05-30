import React, { useContext, useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import ListPosts from "../components/ListPosts";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { AuthContext } from "../AuthStore/AuthContext";
import * as SecureStore from "expo-secure-store";
import { useQuery } from "@apollo/client";
import { POST_QUERY } from "../query/query";

export default function Post() {
  const auth = useContext(AuthContext);
  const [post, setPost] = useState([]);
  const handlerLogout = async () => {
    await SecureStore.deleteItemAsync("access_token");
    auth.setIsSignedIn(false);
  };

  const { loading, error, data } = useQuery(POST_QUERY);
  // console.log(post, '<<<<');
  useEffect(() => {
    if (data && data.getPost) {
      setPost(data.getPost);
    }
  }, [data]);
  if (loading) {
    return <ActivityIndicator size="large" color="#007bff" />;
  }
  if (error) {
    return (
      <Text style={{ color: "red", fontSize: 20, textAlign: "center" }}>
        {error.message}
      </Text>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.container, { backgroundColor: "#fff" }]}>
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.headerText}>InstaLaugh</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handlerLogout}>
            <View>
              <Text style={styles.logoutText}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
        <FlatList
          data={post}
          renderItem={({ item }) => <ListPosts key={item?._id} post={item} />}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 2,
    marginTop: 10,
  },
  headerText: {
    fontSize: 25,
    textAlign: "left",
    fontWeight: "bold",
    paddingLeft: 4,
  },
  logoutButton: {
    backgroundColor: "#E72929",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
