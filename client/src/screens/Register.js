import React, { useState } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@apollo/client";
import { REGISTER_MUTATION } from "../query/query";
export default function Register() {
  const navigation = useNavigation();
  const [inputRegister, setInputRegister] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
  });
  // console.log(inputRegister, "<<<<<");
  const handlerChange = (name, value) => {
    setInputRegister({ ...inputRegister, [name]: value });
  };
  const [registerHandler, { data, loading, error }] = useMutation(
    REGISTER_MUTATION,
    {
      onCompleted: async (data) => {
        try {
          navigation.navigate("Login");
        } catch (error) {
          console.log(error);
        }
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );

  const handlerRegister = () => {};
  const navigateLogin = () => {
    navigation.navigate("Login");
  };
  return (
    // <Register />
    <View style={style.container}>
      <Text style={style.title}>InstaLaugh</Text>
      {loading && <ActivityIndicator size="large" color="#007bff" />}
      {error && <Text style={style.errorText}>{error.message}</Text>}
      <TextInput
        style={style.input}
        placeholder="Fullname"
        placeholderTextColor="#A0A0A0"
        onChangeText={(text) => {
          handlerChange("name", text);
        }}
      ></TextInput>
      <TextInput
        style={style.input}
        placeholder="Username"
        placeholderTextColor="#A0A0A0"
        onChangeText={(text) => handlerChange("username", text)}
      ></TextInput>
      <TextInput
        style={style.input}
        placeholder="Email"
        placeholderTextColor="#A0A0A0"
        onChangeText={(text) => handlerChange("email", text)}
      ></TextInput>
      <TextInput
        style={style.input}
        placeholder="Password"
        placeholderTextColor="#A0A0A0"
        secureTextEntry={true}
        onChangeText={(text) => handlerChange("password", text)}
      ></TextInput>
      <TouchableOpacity
        style={style.loginButton}
        onPress={() =>
          registerHandler({
            variables: {
              input: {
                username: inputRegister.username,
                password: inputRegister.password,
                name: inputRegister.name,
                email: inputRegister.email,
              },
            },
          })
        }
      >
        <Text style={style.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={navigateLogin}>
        <Text style={style.registerText}>Sudah punya akun? segera Login!</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}
const style = StyleSheet.create({
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
