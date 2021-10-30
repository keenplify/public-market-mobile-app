import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  Box,
  Checkbox,
  Flex,
  Heading,
  HStack,
  ScrollView,
  Spinner,
  Text,
  VStack,
} from "native-base";
import React, { Fragment } from "react";
import { RefreshControl } from "react-native";
import { useInfiniteQuery } from "react-query";
import { SubOrderComponent } from "../components/SubOrder";
import { CustomerOrdersCursorPaginateQuery } from "../queries/orders/customerorderscursorpaginate";
import { CustomerTabParamList } from "../screens/CustomerDashboard";
import { AntDesign, Feather } from "@expo/vector-icons";
import { CustomerOrderComponent } from "../components/CustomerOrder";
import { PRIMARY_COLOR } from "../helpers/string";
import { useRefetchOnFocus } from "../helpers/useRefetchOnFocus";
import { RootStackParamList } from "../App";
import { isCloseToBottom } from "../components/TrueProductLayout";

export type CustomerOrdersComponentProps = BottomTabScreenProps<
  CustomerTabParamList & RootStackParamList,
  "Orders"
>;

export function CustomerOrdersComponent(props: CustomerOrdersComponentProps) {
  const { data, fetchNextPage, hasNextPage, isFetched, refetch, isFetching } =
    useInfiniteQuery(
      "seller_suborders",
      async ({ pageParam }) =>
        await CustomerOrdersCursorPaginateQuery(pageParam),
      {
        getNextPageParam: (lastPage) => lastPage?.nextId ?? false,
      }
    );

  useRefetchOnFocus(refetch);

  return (
    <Flex flexGrow={1}>
      <Flex flexGrow={1}>
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
          <VStack>
            <Flex
              p={4}
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
              bgColor={PRIMARY_COLOR}
              shadow={2}
            >
              <Feather name="list" size={24} color="white" />
              <Heading ml={4} color="white">
                Your Orders
              </Heading>
            </Flex>
            {isFetched ? (
              data.pages.map((_data, key1) => (
                <Fragment key={key1}>
                  {_data?.count > 0 && _data.orders
                    ? _data.orders.map((order, key2) => (
                        <CustomerOrderComponent
                          order={order}
                          key={key2}
                          refetch={refetch}
                          {...props}
                        />
                      ))
                    : key1 === 0 && (
                        <Flex
                          alignItems="center"
                          flexGrow={1}
                          my={8}
                          key={key1}
                        >
                          <AntDesign name="meh" size={64} color="black" />
                          <Text mt={4}>No orders found.</Text>
                        </Flex>
                      )}
                </Fragment>
              ))
            ) : (
              <Flex flexGrow={1} mt={6}>
                <Spinner />
              </Flex>
            )}
          </VStack>
        </ScrollView>
      </Flex>
    </Flex>
  );
}
