import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { Image, View } from "react-native";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";
import { RootStackParamList } from "../App";
import { useAuth } from "../helpers/auth";

type Props = NativeStackScreenProps<RootStackParamList, "Splash">;

export function SplashComponent(props: Props) {
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
        </View>
      )}
    </SafeAreaInsetsContext.Consumer>
  );
}
