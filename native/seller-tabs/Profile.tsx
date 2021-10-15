import React from "react";
import { VStack, HStack, Text, ScrollView } from "native-base";
import { StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { SellerTabParamList } from "../screens/SellerDashboard";
import { useAuth } from "../helpers/auth";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = BottomTabScreenProps<SellerTabParamList, "Profile">;

export function ProfileSellerTab(props: Props) {
  const { logout } = useAuth(props);
  return (
    <SafeAreaView>
      <ScrollView>
        <VStack mx={2}>
          <TouchableOpacity style={style.listButtons} onPress={() => logout()}>
            <HStack flex={1} alignItems="center" mx={2}>
              <MaterialCommunityIcons name="logout" size={32} color="black" />
              <Text ml={4}>Logout</Text>
            </HStack>
          </TouchableOpacity>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  listButtons: {
    flex: 1,
    width: "100%",
    paddingVertical: 12,
    borderColor: "rgba(0,0,0,.5)",
    borderTopWidth: 1,
  },
});
