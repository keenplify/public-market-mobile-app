import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { Button, Heading, Image, VStack, Text } from "native-base";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";
import { RootStackParamList } from "../App";
import { useAuth } from "../helpers/auth";
import { useRefetchOnFocus } from "../helpers/useRefetchOnFocus";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export function HomeComponent(props: Props) {
  return (
    <SafeAreaInsetsContext.Consumer>
      {(insets) => (
        <VStack
          style={{
            paddingTop: insets.top,
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
          space={4}
        >
          <Image
            source={require("../assets/landing-1.png")}
            style={{
              height: 254,
              marginBottom: 24,
            }}
            alt="A girl purchasing things online"
          />
          <Heading>Welcome to Public Market!</Heading>
          <Text>Where you can buy and sell goods and products</Text>
          <Button onPress={() => props.navigation.push("Login")} w="50%">
            Sign In
          </Button>
        </VStack>
      )}
    </SafeAreaInsetsContext.Consumer>
  );
}
