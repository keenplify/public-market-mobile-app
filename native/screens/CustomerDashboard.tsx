import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { Fragment, useEffect, useState } from "react";
import { RootStackParamList } from "../App";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { HomeCustomerTab } from "../customer-tabs/Home";
import { NotificationsTab } from "./Notifications";
import { CustomerOrdersComponent } from "../customer-tabs/CustomerOrders";
import { ProfileTab } from "../components/Profile";
import { Cart } from "../customer-tabs/Cart";
import { useSocket, useUserQuery } from "../helpers/auth";
import { Button, Flex, Heading, Text } from "native-base";
import { useRefetchOnFocus } from "../helpers/useRefetchOnFocus";
import { Message, Product, Rating, User } from "../helpers/types";
import { AddRating } from "./AddRating";
import { MessagesMain } from "./MessagesMain";
import { MessagesRoom } from "./MessagesRoom";
import { SearchScreen } from "./Search";
import { SearchContext } from "../helpers/SearchContext";

const Tab = createBottomTabNavigator<CustomerTabParamList>();

interface Props
  extends NativeStackScreenProps<RootStackParamList, "Customer Dashboard"> {
  keyword: string;
}

export function CustomerDashboard({ keyword, navigation }: Props) {
  const { data, isSuccess, refetch, ...query } = useUserQuery();
  const [socketvals] = useState(useSocket());
  const { messages, socket } = socketvals;

  useRefetchOnFocus(refetch);

  const notice = (
    <Flex bgColor="primary.200" p={3} shadow={3}>
      <Heading>Notice</Heading>
      <Text>
        You need to add a delivery address before you can checkout. Please click
        the button below to add a delivery address.
      </Text>
      <Button mt={2} onPress={() => navigation.navigate("Address Form")}>
        Add Delivery Address
      </Button>
    </Flex>
  );

  return (
    <Fragment>
      {data && !data.user.address && notice}
      <Tab.Navigator>
        <Tab.Screen
          name="Customer Home"
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
          name="Orders"
          component={CustomerOrdersComponent}
          options={{
            headerShown: false,
            tabBarIcon: (props) => <Feather name="list" {...props} />,
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

        <Tab.Screen
          name="Cart"
          component={Cart}
          options={{
            headerShown: false,
            tabBarButton: () => null,
          }}
        />

        <Tab.Screen
          name="Add Rating"
          component={AddRating}
          options={{
            tabBarButton: () => null,
          }}
        />

        <Tab.Screen name="Messages" options={{ tabBarButton: () => null }}>
          {(props) => <MessagesMain socket={socket} {...props} />}
        </Tab.Screen>

        <Tab.Screen
          name="Conversation"
          options={{ tabBarButton: () => null, headerShown: false }}
        >
          {(props) => <MessagesRoom socket={socket} {...props} />}
        </Tab.Screen>
        <Tab.Screen
          name="Search"
          options={{ tabBarButton: () => null, headerShown: false }}
          children={(props) => <SearchScreen keyword={keyword} {...props} />}
        />
      </Tab.Navigator>
    </Fragment>
  );
}

export type CustomerTabParamList = {
  "Customer Home": undefined;
  Notifications: undefined;
  Orders: undefined;
  Profile: undefined;
  Cart: undefined;
  "Add Rating": {
    product: Product;
    rating?: Rating;
  };
  "Edit Rating": {
    product: Product;
    rating: Rating;
  };
  Messages: undefined;
  Conversation: {
    to: User;
  };
  Search: {
    keyword?: string;
  };
};

type GroupBy<T> = (xs: T[], key: keyof T) => Grouped<T>;

export type Grouped<T> = {
  [key: string]: T[];
};

const groupBy: GroupBy<Message> = function (xs, key) {
  return xs.reduce(function (rv, x) {
    //@ts-ignore
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};
