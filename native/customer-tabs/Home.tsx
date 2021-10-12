import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { Box, Button, Flex, ScrollView, Text } from "native-base";
import React from "react";
import { ProductsLayout } from "../components/ProductsLayout";
import { useAuth } from "../helpers/auth";
import { Product } from "../helpers/types";
import { CustomerTabParamList } from "../screens/CustomerDashboard";
import { ProductViewer } from "../screens/Product";

const CustomerHomeStack =
  createNativeStackNavigator<CustomerHomeStackParamsList>();

export function HomeCustomerTab() {
  return (
    <CustomerHomeStack.Navigator initialRouteName="Main">
      <CustomerHomeStack.Screen
        name="Main"
        component={MainScreen}
        options={{ headerShown: false }}
      />
      <CustomerHomeStack.Screen
        name="Product"
        component={ProductViewer}
        options={{ headerShown: false }}
      />
    </CustomerHomeStack.Navigator>
  );
}

export type CustomerHomeMainProps = NativeStackScreenProps<
  CustomerHomeStackParamsList,
  "Main"
>;

function MainScreen(props: CustomerHomeMainProps) {
  return (
    <ScrollView>
      <Flex alignItems="center" mt={1} mb={2}>
        <ProductsLayout {...props} />
      </Flex>
    </ScrollView>
  );
}

export type CustomerHomeStackParamsList = {
  Main: undefined;
  Product: {
    product: Product;
  };
};
