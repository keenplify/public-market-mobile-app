import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { RootStackParamList } from "../App";
import { useAuth, useSocket, useUserQuery } from "../helpers/auth";
import { HomeSellerTab } from "../seller-tabs/Home";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { ProfileTab } from "../components/Profile";
import { SafeAreaView } from "react-native-safe-area-context";
import { SellerOrders } from "../seller-tabs/SellerOrders";
import { useRefetchOnFocus } from "../helpers/useRefetchOnFocus";
import { User } from "../helpers/types";
import { MessagesMain } from "./MessagesMain";
import { MessagesRoom } from "./MessagesRoom";
import { NotificationsTab } from "./Notifications";
import { Box, Flex } from "native-base";

type Props = NativeStackScreenProps<RootStackParamList, "Customer Dashboard">;

const Tab = createBottomTabNavigator<SellerTabParamList>();

export function SellerDashboard(props: Props) {
  const [socketvals] = useState(useSocket());
  const { messages, socket } = socketvals;

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Seller Home"
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
        name="Notifications"
        options={{
          tabBarIcon: (props) => (
            <FontAwesome name="bell-o" size={24} color="black" {...props} />
          ),
        }}
        component={NotificationsTab}
      ></Tab.Screen>
      <Tab.Screen
        name="Orders"
        component={SellerOrders}
        options={{
          tabBarIcon: (props) => <Feather name="list" {...props} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileTab}
        options={{
          tabBarIcon: (props) => <Feather name="user" {...props} />,
        }}
      />

      <Tab.Screen name="Messages" options={{ tabBarButton: () => null }}>
        {(props) => <MessagesMain socket={socket} {...props} />}
      </Tab.Screen>

      <Tab.Screen name="Conversation" options={{ tabBarButton: () => null }}>
        {(props) => <MessagesRoom socket={socket} {...props} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export type SellerTabParamList = {
  "Seller Home": undefined;
  Profile: undefined;
  Orders: undefined;
  Messages: undefined;
  Notifications: undefined;
  Conversation: {
    to: User;
  };
};
