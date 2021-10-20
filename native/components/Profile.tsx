import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { Flex, HStack, ScrollView, Spinner, Text, VStack } from "native-base";
import React from "react";
import { useAuth, useUserQuery } from "../helpers/auth";
import { CustomerTabParamList } from "../screens/CustomerDashboard";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { UserCard } from "./UserCard";

type Props = BottomTabScreenProps<CustomerTabParamList, "Profile">;

export function ProfileTab(props: Props) {
  const { data } = useUserQuery();
  const { logout } = useAuth(props);

  return (
    <ScrollView>
      <VStack mx={2}>
        {data?.message?.includes("Success") ? (
          <Flex my={2}>
            <UserCard user={data.user} />
          </Flex>
        ) : (
          <HStack my={4} flex={1} alignItems="center" justifyContent="center">
            <Spinner size="lg" />
          </HStack>
        )}
        <ProductMenuButton
          onPress={() => logout()}
          text="Logout"
          icon={
            <MaterialCommunityIcons name="logout" size={32} color="black" />
          }
        />
      </VStack>
    </ScrollView>
  );
}

interface ProductMenuButtonProps extends TouchableOpacityProps {
  text: string;
  icon: React.ReactNode;
}

export function ProductMenuButton({
  icon,
  text,
  onPress,
}: ProductMenuButtonProps) {
  return (
    <TouchableOpacity style={style.listButtons} onPress={onPress}>
      <HStack flex={1} alignItems="center" mx={2}>
        {icon}
        <Text ml={4}>{text}</Text>
      </HStack>
    </TouchableOpacity>
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
