import React, { useContext, useEffect, useState } from "react";
import { Flex, ScrollView, Text } from "native-base";
import { CustomerTabParamList } from "./CustomerDashboard";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { RoomCard } from "../components/RoomCard";
import { useInfiniteQuery, useQuery } from "react-query";
import { getAllMessagesQuery } from "../queries/messages/all";
import { RefreshControl } from "react-native";
import { useUserQuery } from "../helpers/auth";

export function MessagesMain(
  props: BottomTabScreenProps<CustomerTabParamList, "Messages">
) {
  const { data: user } = useUserQuery();
  const { data, isFetching, refetch } = useQuery(
    "messages_main",
    async () => await getAllMessagesQuery()
  );
  const [rooms, setRooms] = useState<number[]>([]);

  useEffect(() => {
    if (!data?.messages || typeof data?.messages !== "object") return;

    const newRoomsUserId: number[] = [];
    data.messages.forEach((m) => {
      if (m.fromId === user?.user.id && !newRoomsUserId.includes(m.toId))
        newRoomsUserId.push(m.toId);
      else if (m.toId === user?.user.id && !newRoomsUserId.includes(m.fromId))
        newRoomsUserId.push(m.fromId);
    });
    setRooms(newRoomsUserId);
  }, [data]);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isFetching} onRefresh={refetch} />
      }
    >
      <Flex>
        {rooms?.map((userId, key) => (
          <RoomCard userId={userId} key={key} {...props} />
        ))}
      </Flex>
    </ScrollView>
  );
}

// type GroupBy<T> = (xs: T[], key: keyof T) => Grouped<T>;

// type Grouped<T> = {
//   [key: string]: T[];
// };

// const groupBy: GroupBy<Message> = function (xs, key) {
//   return xs.reduce(function (rv, x) {
//     //@ts-ignore
//     (rv[x[key]] = rv[x[key]] || []).push(x);
//     return rv;
//   }, {});
// };
