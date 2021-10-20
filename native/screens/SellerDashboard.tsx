import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { RootStackParamList } from "../App";
import { useAuth } from "../helpers/auth";
import { HomeSellerTab } from "../seller-tabs/Home";
import { Feather } from "@expo/vector-icons";
import { ProfileTab } from "../components/Profile";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = NativeStackScreenProps<RootStackParamList, "Customer Dashboard">;

const Tab = createBottomTabNavigator<SellerTabParamList>();

export function SellerDashboard(props: Props) {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeSellerTab}
        options={{
          headerShown: false,
          tabBarIcon: (props) => (
            <Feather name="shopping-bag" size={24} color="black" {...props} />
          ),
          tabBarLabel: "Your Products",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileTab}
        options={{
          tabBarIcon: (props) => (
            <Feather name="user" size={24} color="black" {...props} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export type SellerTabParamList = {
  Home: undefined;
  Profile: undefined;
};
