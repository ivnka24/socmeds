import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "@apollo/client";
import { FOLLOWING_FOLLOWERS_QUERY, FOLLOW_USER, SEARCH_USERNAME_QUERY } from "../query/query";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const { error, loading, data } = useQuery(SEARCH_USERNAME_QUERY, {
    variables: { username: searchTerm },
  });
  console.log(data);
  useEffect(() => {
    if (data && data.searchUsername) {
      setSearchResult(data.searchUsername);
    } else {
      setSearchResult(null);
    }
  }, [data]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={24}
          color="black"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Search username..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>
      <Text style={styles.heading}>Search Results</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text style={{ fontSize: 20, textAlign: "center" }}>
          {error.message}
        </Text>
      ) : searchResult ? (
        <UserCard username={searchResult} />
      ) : (
        <Text>No results found</Text>
      )}
    </SafeAreaView>
  );
};

const UserCard = ({ username }) => {
  const [message, setMessage] = useState("");
  const [handlerFollow, { data, loading, error }] = useMutation(FOLLOW_USER, {
    variables: {
      input: {
        followerId: username._id,
      },
    },
    onCompleted: (data) => {
      setMessage(data.followUser.message);
    },
    refetchQueries: [FOLLOWING_FOLLOWERS_QUERY]
  });
  const handleFollow = () => {
    handlerFollow();
  };
  return (
    <>
      {loading && <Text>Loading...</Text>}
      {error && <Text>Error: {error.message}</Text>}
      {message && <Text style={{textAlign: 'center', fontSize: 25}}>{message}</Text>}
      <View style={styles.card}>
        <View style={styles.userInfo}>
          <Ionicons name="person" size={24} color="black" style={styles.icon} />
          <Text>{username.username}</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleFollow}>
          <Text style={styles.buttonText}>Follow</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    padding: 20,
    marginHorizontal: 18,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    flex: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 10,
  },
  button: {
    backgroundColor: "#3897f0",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Search;
