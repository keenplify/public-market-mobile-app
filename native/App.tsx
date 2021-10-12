import "./pre-start";
import React from "react";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { HomeComponent } from "./screens/Home";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NativeBaseProvider } from "native-base";
import { SplashComponent } from "./screens/Splash";
import { LoginComponent } from "./screens/Login";
import { QueryClient, QueryClientProvider } from "react-query";
import { LogBox } from "react-native";
import { CustomerDashboard } from "./screens/CustomerDashboard";
import { CustomerHeader } from "./components/CustomerHeader";
import { Product } from "./helpers/types";
import { ProductViewer } from "./screens/Product";
import { SellerDashboard } from "./screens/SellerDashboard";
import { RegisterComponent } from "./screens/Register";

LogBox.ignoreLogs(["Setting a timer", "contrast ratio"]);

const RootStack = createNativeStackNavigator<RootStackParamList>();
const queryClient = new QueryClient();

export default function App() {
  return (
    <NativeBaseProvider>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <NavigationContainer>
            <RootStack.Navigator initialRouteName="Home">
              <RootStack.Screen
                name="Home"
                component={HomeComponent}
                options={{ headerShown: false }}
              />
              <RootStack.Screen
                name="Splash"
                component={SplashComponent}
                options={{ headerShown: false }}
              />
              <RootStack.Screen
                name="Login"
                component={LoginComponent}
                options={{ headerShown: false }}
              />
              <RootStack.Screen
                name="Register"
                component={RegisterComponent}
                options={{ headerShown: false }}
              />
              <RootStack.Screen
                name="Customer Dashboard"
                component={CustomerDashboard}
                options={{
                  header: (props) => <CustomerHeader {...props} />,
                }}
              />
              <RootStack.Screen
                name="Seller Dashboard"
                component={SellerDashboard}
                options={{
                  headerShown: false,
                }}
              />
              <RootStack.Screen name="Product" component={ProductViewer} />
            </RootStack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </QueryClientProvider>
    </NativeBaseProvider>
  );
}

export type RootStackParamList = {
  Home: undefined;
  Splash: {
    method: "logout";
  };
  Login: undefined;
  Register: undefined;
  "Customer Dashboard": undefined;
  "Seller Dashboard": undefined;
  Cart: undefined;
  Product: {
    product: Product;
  };
};
