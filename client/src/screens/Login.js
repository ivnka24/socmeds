import React, { useContext, useState } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { AuthContext } from "../AuthStore/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@apollo/client";
import { FOLLOWING_FOLLOWERS_QUERY, LOGIN_MUTATION } from "../query/query";

export default function Login() {
  const auth = useContext(AuthContext);
  const navigation = useNavigation();
  // login mutation
  const [loginHandler, { data, loading, error }] = useMutation(LOGIN_MUTATION, {
    onCompleted: async (data) => {
      await SecureStore.setItemAsync(
        "access_token",
        data.userLogin.access_token
      );
      auth.setIsSignedIn(true);
    },
    onError: (error) => {
      console.log(error);
    },
    refetchQueries: [FOLLOWING_FOLLOWERS_QUERY]
  });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigateToRegister = () => {
    navigation.navigate("Register");
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>InstaLaugh</Text>
      {loading && <ActivityIndicator size="large" color="#007bff"/>}
      {error && <Text style={styles.errorText}>{error.message}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#A0A0A0"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#A0A0A0"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() =>
          loginHandler({
            variables: {
              input: {
                username: username,
                password: password,
              },
            },
          })
        }
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={navigateToRegister}>
        <Text style={styles.registerText}>
          Belum punya akun? Daftar sekarang!
        </Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "black",
    fontSize: 50,
  },
  input: {
    width: "90%",
    height: 50,
    borderWidth: 1,
    borderColor: "#DBDBDB",
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
  },
  loginButton: {
    width: "90%",
    height: 50,
    backgroundColor: "#007bff",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerButton: {
    marginTop: 13,
  },
  registerText: {
    color: "#007bff",
    fontSize: 18,
    textDecorationLine: "none",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 8,
  },
});
