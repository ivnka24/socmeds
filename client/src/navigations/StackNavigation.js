import Post from "../screens/Post";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PostDetail from "../screens/PostDetail";
const Stack = createNativeStackNavigator();

export default function StackNavigation() {
  return (
    <Stack.Navigator screenOptions={{
        headerShown: false
    }}>
      <Stack.Screen name="Home" component={Post} />
      <Stack.Screen name="Post Detail" component={PostDetail} />
    </Stack.Navigator>
  );
}
