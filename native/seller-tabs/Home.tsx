import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { Button, Icon } from "native-base";
import React from "react";
import { ProductsLayout } from "../components/ProductsLayout";
import { Product } from "../helpers/types";
import { ProductViewer } from "../screens/Product";
import { AntDesign } from "@expo/vector-icons";
import { AddProduct } from "../screens/AddProduct";

const CustomerHomeStack =
  createNativeStackNavigator<SellerHomeStackParamsList>();

export function HomeSellerTab() {
  return (
    <CustomerHomeStack.Navigator initialRouteName="Your Products">
      <CustomerHomeStack.Screen
        name="Your Products"
        component={MainScreen}
        options={({ navigation }) => ({
          headerRight: (props) => (
            <Button
              leftIcon={
                <Icon color="white" as={<AntDesign name="plus" />} size="xs" />
              }
              onPress={() => navigation.navigate("Add Product")}
              {...props}
            >
              Add Product
            </Button>
          ),
        })}
      />
      <CustomerHomeStack.Screen name="Product" component={ProductViewer} />
      <CustomerHomeStack.Screen name="Add Product" component={AddProduct} />
    </CustomerHomeStack.Navigator>
  );
}

export type SellerHomeMainProps = NativeStackScreenProps<
  SellerHomeStackParamsList,
  "Your Products"
>;

function MainScreen(props: SellerHomeMainProps) {
  return <ProductsLayout {...props} />;
}

export type SellerHomeStackParamsList = {
  "Your Products": undefined;
  Product: {
    product: Product;
  };
  "Add Product": undefined;
};
