import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import {
  Box,
  Button,
  Flex,
  Heading,
  ScrollView,
  Text,
  VStack,
  Fab,
  Icon,
} from "native-base";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
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
      <CustomerHomeStack.Screen
        name="Product"
        component={ProductViewer}
        options={{ headerShown: false }}
      />
      <CustomerHomeStack.Screen name="Add Product" component={AddProduct} />
    </CustomerHomeStack.Navigator>
  );
}

export type SellerHomeMainProps = NativeStackScreenProps<
  SellerHomeStackParamsList,
  "Your Products"
>;

function MainScreen(props: SellerHomeMainProps) {
  return (
    <SafeAreaView>
      <ScrollView>
        <VStack>
          <Flex alignItems="center" mt={1} mb={2}>
            <ProductsLayout {...props} />
          </Flex>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}

export type SellerHomeStackParamsList = {
  "Your Products": undefined;
  Product: {
    product: Product;
  };
  "Add Product": undefined;
};
