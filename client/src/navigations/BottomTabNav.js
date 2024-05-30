import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import PostContent from "../screens/PostContent";
import Search from "../screens/Search";
import StackNavigation from "./StackNavigation";
import Profile from "../screens/Profile";

const Tab = createBottomTabNavigator();

export default function BottomTabNav(){
    return (
        <>
        <Tab.Navigator>
          <Tab.Screen
            name="Home"
            component={StackNavigation}
            options={{
              headerShown: false,
              tabBarIcon: ({ focused, color, size }) => {
                return <Ionicons name="home" size={24} color={color} />;
              },
            }}
          />
          <Tab.Screen
            name="Add-Content"
            component={PostContent}
            options={{
              headerShown: false,
              tabBarIcon: ({ focused, color, size }) => {
                return <Ionicons name="add-circle" size={24} color={color} />;
              },
            }}
          />
          <Tab.Screen
            name="Search"
            component={Search}
            options={{
              headerShown: false,
              tabBarIcon: ({ focused, color, size }) => {
                return <Ionicons name="search-circle-outline" size={24} color={color} />;
              },
            }}
          />
          <Tab.Screen
            name="Profile"
            component={Profile}
            options={{
              headerShown: false,
              tabBarIcon: ({ focused, color, size }) => {
                return <Ionicons name="person-circle-outline" size={24} color={color} />;
              },
            }}
          />
        </Tab.Navigator>
        </>
    )
}