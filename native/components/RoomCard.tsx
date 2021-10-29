import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { Avatar, Flex, HStack, Spinner, Text } from "native-base";
import randomColor from "randomcolor";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useQuery } from "react-query";
import { capitalizeFirstLetter, getFirstLetters } from "../helpers/string";
import { Message, User } from "../helpers/types";
import { useRefetchOnFocus } from "../helpers/useRefetchOnFocus";
import { GetUserQuery } from "../queries/users/get";
import { CustomerTabParamList, Grouped } from "../screens/CustomerDashboard";

interface Props extends BottomTabScreenProps<CustomerTabParamList, "Messages"> {
  userId: number;
}

export function RoomCard({ userId, navigation }: Props) {
  const { data, isSuccess, refetch } = useQuery(
    ["user", userId],
    async () => await GetUserQuery(userId)
  );
  const [colorState] = useState(randomColor({ luminosity: "light" }));

  useRefetchOnFocus(refetch);
  const sorted = data?.user
    ? [...data.user.messagesMade, ...data.user.messagesReceived].sort(function (
        a,
        b
      ) {
        return a.id + b.id;
      })
    : [];

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Conversation", { to: data.user })}
    >
      <Flex borderRadius={3} borderBottomWidth={1} borderBottomColor="black">
        {data && isSuccess ? (
          <Flex p={2} flexDirection="row">
            <Avatar
              children={capitalizeFirstLetter(
                getFirstLetters(data.user.username)
              )}
              _text={{ color: "black", fontWeight: "bold" }}
              bg={colorState}
            />
            <Flex ml={3} justify="center">
              <Text fontWeight="bold" fontSize="xl">
                {capitalizeFirstLetter(data.user.username)}
              </Text>
              <HStack>
                <Text fontSize="xs">{sorted[0].from.username}: </Text>
                <Text ml={1} noOfLines={1} ellipsizeMode="tail" fontSize="xs">
                  {sorted[0].message}
                </Text>
              </HStack>
            </Flex>
          </Flex>
        ) : (
          <Spinner />
        )}
      </Flex>
    </TouchableOpacity>
  );
}
