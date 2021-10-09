import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { Image, Text, View } from "react-native";
import { Button } from "native-base";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";
import { RootStackParamList } from "../App";
import { useAuth } from "../helpers/auth";

type Props = NativeStackScreenProps<RootStackParamList, "Splash">;

export function CustomerDashboard(props: Props) {
  const { logout } = useAuth(props);

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
          <Text>customer</Text>
          <Button onPress={() => logout()}>Logout</Button>
        </View>
      )}
    </SafeAreaInsetsContext.Consumer>
  );
}
