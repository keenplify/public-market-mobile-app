import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { Image, View } from "react-native";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";
import { RootStackParamList } from "../App";
import { useAuth } from "../helpers/auth";
import { useRefetchOnFocus } from "../helpers/useRefetchOnFocus";
import { MeQuery } from "../queries/users/me";

type Props = NativeStackScreenProps<RootStackParamList, "Splash">;

export function SplashComponent(props: Props) {
  const { logout } = useAuth();

  const logic = () => {
    const fn = async () => {
      const query = await MeQuery();

      if (query === null) return props.navigation.replace("Home");

      if (!query.message.includes("Success")) return logout();

      if (query.user.type === "CUSTOMER")
        return props.navigation.replace("Customer Dashboard");
      else if (query.user.type === "SELLER")
        return props.navigation.replace("Seller Dashboard");
    };

    return fn().then();
  };

  useRefetchOnFocus(logic);

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
            source={require("../assets/adaptive-icon.png")}
            style={{ width: 128, height: 128, marginBottom: 24 }}
          />
        </View>
      )}
    </SafeAreaInsetsContext.Consumer>
  );
}
