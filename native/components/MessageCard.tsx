import React from "react";
import { Badge, Box, Flex, HStack, Text } from "native-base";
import { Message } from "../helpers/types";
import { Socket } from "socket.io-client";
import { useUserQuery } from "../helpers/auth";
import useTimeAgo from "@rooks/use-time-ago";

interface Props {
  message: Message;
  socket: Socket;
}

export function MessageCard({ message, socket }: Props) {
  const { data: user } = useUserQuery();
  const fromMe = user?.user?.id === message.fromId;

  return (
    <Flex p={2} alignItems={fromMe ? "flex-end" : "flex-start"}>
      <Box bg={fromMe ? "primary.200" : "white"} p={2}>
        <Flex flexDirection={fromMe ? "row-reverse" : "row"}>
          <Text fontWeight="bold" mx={1}>
            {fromMe ? "You" : message.from.username}
          </Text>
          <Badge variant="solid">
            {new Date(message.createdAt).toLocaleDateString()}
          </Badge>
        </Flex>
        <Text>{message.message}</Text>
      </Box>
    </Flex>
  );
}
