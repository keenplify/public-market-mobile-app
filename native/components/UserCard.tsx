import { Avatar, Badge, Button, HStack, Text, VStack } from "native-base";
import randomColor from "randomcolor";
import React, { useState } from "react";
import { capitalizeFirstLetter, getFirstLetters } from "../helpers/string";
import { User } from "../helpers/types";
import useTimeAgo from "@rooks/use-time-ago";
import { useUserQuery } from "../helpers/auth";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CustomerTabParamList } from "../screens/CustomerDashboard";

interface Props {
  user: User;
  color?: string;
}

export function UserCard({ user, color, ...props }: Props) {
  const _user = useUserQuery();
  const [colorState] = useState(color || randomColor({ luminosity: "light" }));
  const timeAgo = useTimeAgo(user.createdAt, {
    intervalMs: 0,
    locale: "en-US",
    relativeDate: new Date(),
  });

  return (
    <VStack>
      <HStack m={2}>
        <Avatar
          children={capitalizeFirstLetter(getFirstLetters(user.username))}
          _text={{ color: "black", fontWeight: "bold" }}
          bg={colorState}
        />
        <VStack ml={3} justifyContent="center">
          <HStack mb={1}>
            <Text fontWeight="bold">
              @{capitalizeFirstLetter(user.username)}
            </Text>
          </HStack>
          <HStack>
            <Badge maxHeight={6} mr={2} variant="subtle" colorScheme="success">
              {user.type}
            </Badge>
            <Badge maxHeight={6} mr={2} variant="outline" colorScheme="fuchsia">
              {`Joined ${timeAgo}`.toUpperCase()}
            </Badge>
          </HStack>
        </VStack>
      </HStack>
      {user?.id !== _user.data?.user?.id && (
        <Button
          onPress={() =>
            //@ts-ignore
            props.navigation.navigate("Conversation", { to: user })
          }
        >
          Chat Seller
        </Button>
      )}
    </VStack>
  );
}
