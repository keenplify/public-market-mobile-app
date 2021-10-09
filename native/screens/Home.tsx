import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { Image, Text, View } from "react-native";
import { Button } from "native-base";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";
import { RootStackParamList } from "../App";
import { useAuth } from "../helpers/auth";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export function HomeComponent(props: Props) {
  const { data, logout } = useAuth(props);
  useEffect(() => {
    if (!data || data === null) return;

    if (!data.message.includes("Success")) return logout();

    props.navigation.replace("Customer Dashboard");
  }, [data]);

  return (
    <SafeAreaInsetsContext.Consumer>
      {(insets) => (
        <View
          style={{
            paddingTop: insets.top,
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={require("../assets/icon.png")}
            style={{ width: 128, height: 128, marginBottom: 24 }}
          />
          <Text>test</Text>
          <Button onPress={() => props.navigation.push("Login")}>
            Email Address
          </Button>
        </View>
      )}
    </SafeAreaInsetsContext.Consumer>
  );
}
