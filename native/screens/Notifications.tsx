import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { Box, Flex, ScrollView, Spinner, Text } from "native-base";
import React, { Fragment } from "react";
import { RefreshControl } from "react-native";
import { useInfiniteQuery } from "react-query";
import { RootStackParamList } from "../App";
import { NotificationCard } from "../components/NotificationCard";
import { isCloseToBottom } from "../components/TrueProductLayout";
import { useRefetchOnFocus } from "../helpers/useRefetchOnFocus";
import { NotificationsPaginateQuery } from "../queries/notifications/cursorpagination";
import { CustomerTabParamList } from "./CustomerDashboard";

export type NotificationsTabProps = BottomTabScreenProps<
  CustomerTabParamList & RootStackParamList,
  "Notifications"
>;

export function NotificationsTab(props: NotificationsTabProps) {
  const { data, fetchNextPage, hasNextPage, isFetched, refetch, isFetching } =
    useInfiniteQuery(
      "seller_suborders",
      async ({ pageParam }) => await NotificationsPaginateQuery(pageParam),
      {
        getNextPageParam: (lastPage) => lastPage?.nextId ?? false,
      }
    );

  useRefetchOnFocus(refetch);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isFetching} onRefresh={refetch} />
      }
      onScroll={({ nativeEvent }) => {
        if (isCloseToBottom(nativeEvent) && hasNextPage && !isFetching) {
          fetchNextPage();
        }
      }}
    >
      <Flex>
        {isFetched ? (
          data?.pages[0]?.notifications?.length === 0 ? (
            <Flex mt={8} align="center">
              <Text>You have no notifications.</Text>
            </Flex>
          ) : (
            data.pages.map((_data, key1) => (
              <Fragment key={key1}>
                {_data?.notifications?.map((notification, key2) => (
                  <NotificationCard
                    notification={notification}
                    key={key2}
                    {...props}
                  />
                ))}
              </Fragment>
            ))
          )
        ) : (
          <Flex flexGrow={1} mt={5}>
            <Spinner />
          </Flex>
        )}
      </Flex>
    </ScrollView>
  );
}
