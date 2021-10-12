import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { RootStackParamList } from "../App";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { HomeCustomerTab } from "../customer-tabs/Home";
import { NotificationsTab } from "../customer-tabs/Notifications";
import { NewsTab } from "../customer-tabs/News";
import { FontAwesome5 } from "@expo/vector-icons";
import { ProfileTab } from "../customer-tabs/Profile";

type Props = NativeStackScreenProps<RootStackParamList, "Customer Dashboard">;

const Tab = createBottomTabNavigator<CustomerTabParamList>();

export function CustomerDashboard(props: Props) {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeCustomerTab}
        options={{
          headerShown: false,
          tabBarIcon: (props) => (
            <Feather name="home" size={24} color="black" {...props} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsTab}
        options={{
          headerShown: false,
          tabBarIcon: (props) => (
            <FontAwesome name="bell-o" size={24} color="black" {...props} />
          ),
        }}
      />

      <Tab.Screen
        name="News"
        component={NewsTab}
        options={{
          headerShown: false,
          tabBarIcon: (props) => (
            <FontAwesome5 name="newspaper" size={24} color="black" {...props} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileTab}
        options={{
          headerShown: false,
          tabBarIcon: (props) => (
            <Feather name="user" size={24} color="black" {...props} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export type CustomerTabParamList = {
  Home: undefined;
  Notifications: undefined;
  News: undefined;
  Profile: undefined;
};
