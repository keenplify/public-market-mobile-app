import { Avatar, Badge, HStack, Text, VStack } from "native-base";
import randomColor from "randomcolor";
import React, { useState } from "react";
import { capitalizeFirstLetter, getFirstLetters } from "../helpers/string";
import { User } from "../helpers/types";
import useTimeAgo from "@rooks/use-time-ago";

interface Props {
  user: User;
}

export function UserCard({ user }: Props) {
  const [color] = useState(randomColor({ luminosity: "light" }));
  const timeAgo = useTimeAgo(user.createdAt, {
    intervalMs: 0,
    locale: "en-US",
    relativeDate: new Date(),
  });

  return (
    <HStack m={2}>
      <Avatar
        children={capitalizeFirstLetter(getFirstLetters(user.username))}
        _text={{ color: "black", fontWeight: "bold" }}
        bg={color}
      />
      <VStack ml={3} justifyContent="center">
        <HStack mb={1}>
          <Text fontWeight="bold">@{capitalizeFirstLetter(user.username)}</Text>
        </HStack>
        <HStack>
          <Badge maxHeight={6} mr={2} variant="subtle" colorScheme="success">
            {user.type}
          </Badge>
          <Badge maxHeight={6} mr={2} variant="outline" colorScheme="info">
            {user.gender}
          </Badge>
          <Badge maxHeight={6} mr={2} variant="outline" colorScheme="fuchsia">
            {`Joined ${timeAgo}`.toUpperCase()}
          </Badge>
        </HStack>
      </VStack>
    </HStack>
  );
}
