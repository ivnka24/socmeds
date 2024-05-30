import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Login";
import Register from "../screens/Register";
import { AuthContext } from "../AuthStore/AuthContext";
import { useContext } from "react";
import BottomTabNav from "./BottomTabNav";
const Stack = createNativeStackNavigator();

export default function LoginRegisterNav() {
  const auth = useContext(AuthContext);
  console.log(auth, "<<<<<<");
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {auth.isSignedIn ? (
        <>
          <Stack.Screen name="BottomTab" component={BottomTabNav} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
        </>
      )}
    </Stack.Navigator>
  );
}
