import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import React from "react";
import { ProductsLayout } from "../components/ProductsLayout";
import { useSearchContext } from "../helpers/SearchContext";
import { Product } from "../helpers/types";
import { ProductViewer } from "../screens/Product";

const CustomerHomeStack =
  createNativeStackNavigator<CustomerHomeStackParamsList>();

export function HomeCustomerTab() {
  return (
    <CustomerHomeStack.Navigator initialRouteName="Main">
      <CustomerHomeStack.Screen
        name="Main"
        component={ProductsLayout}
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

export type CustomerHomeStackParamsList = {
  Main: undefined;
  Product: {
    product: Product;
  };
};
