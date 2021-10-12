import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  Avatar,
  Badge,
  Box,
  Button,
  HStack,
  ScrollView,
  Spinner,
  Text,
  VStack,
} from "native-base";
import React, { useState } from "react";
import { useAuth, useUserQuery } from "../helpers/auth";
import { CustomerTabParamList } from "../screens/CustomerDashboard";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";
import { capitalizeFirstLetter, getFirstLetters } from "../helpers/string";
import randomColor from "randomcolor";
import { Feather } from "@expo/vector-icons";

type Props = BottomTabScreenProps<CustomerTabParamList, "Profile">;

export function ProfileTab(props: Props) {
  const { data, isSuccess } = useUserQuery();
  const { logout } = useAuth(props);
  const [color] = useState(randomColor());

  return (
    <ScrollView>
      <VStack mx={2}>
        {data?.message?.includes("Success") ? (
          <HStack my={4} mx={2}>
            <Avatar
              children={capitalizeFirstLetter(
                getFirstLetters(data.user.username)
              )}
              _text={{ color: "white", fontWeight: "bold" }}
              bg={color}
            />
            <VStack ml={3} justifyContent="center">
              <HStack mb={1}>
                <Text fontWeight="bold">
                  @{capitalizeFirstLetter(data.user.username)}
                </Text>
              </HStack>
              <HStack>
                <Badge
                  maxHeight={6}
                  mr={2}
                  variant="outline"
                  colorScheme="success"
                >
                  {data.user.type}
                </Badge>
                <Badge
                  maxHeight={6}
                  mr={2}
                  variant="outline"
                  colorScheme="info"
                >
                  {data.user.gender}
                </Badge>
              </HStack>
            </VStack>
          </HStack>
        ) : (
          <HStack my={4} flex={1} alignItems="center" justifyContent="center">
            <Spinner size="lg" />
          </HStack>
        )}
        <TouchableOpacity
          style={style.listButtons}
          onPress={() => console.log("Profile")}
        >
          <HStack flex={1} alignItems="center" mx={2}>
            <Feather name="user" size={32} color="black" />
            <Text ml={4}>Profile</Text>
          </HStack>
        </TouchableOpacity>
        <TouchableOpacity style={style.listButtons} onPress={() => logout()}>
          <HStack flex={1} alignItems="center" mx={2}>
            <MaterialCommunityIcons name="logout" size={32} color="black" />
            <Text ml={4}>Logout</Text>
          </HStack>
        </TouchableOpacity>
      </VStack>
    </ScrollView>
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
