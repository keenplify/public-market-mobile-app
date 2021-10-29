import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { Fragment, useState } from "react";
import { ProductTabParamList } from "../screens/Product";
import {
  Checkbox,
  Flex,
  HStack,
  ScrollView,
  Spinner,
  Text,
  VStack,
} from "native-base";
import { useInfiniteQuery } from "react-query";
import { SellerSubOrdersCursorPaginateQuery } from "../queries/orders/sellersuborderscursorpaginate";
import { SubOrderComponent } from "../components/SubOrder";
import { AntDesign } from "@expo/vector-icons";
import { RefreshControl } from "react-native";
import { isCloseToBottom } from "../components/ProductsLayout";
import { RootStackParamList } from "../App";
import { useRefetchOnFocus } from "../helpers/useRefetchOnFocus";

export type SellerOrdersProps = NativeStackScreenProps<
  ProductTabParamList & RootStackParamList,
  "Seller Menu"
>;

export function SellerOrders(props: SellerOrdersProps) {
  const { data, fetchNextPage, hasNextPage, isFetched, refetch, isFetching } =
    useInfiniteQuery(
      "seller_suborders",
      async ({ pageParam }) =>
        await SellerSubOrdersCursorPaginateQuery(pageParam),
      {
        getNextPageParam: (lastPage) => lastPage?.nextId ?? false,
      }
    );

  useRefetchOnFocus(refetch);

  const [isShowingDelivered, setIsShowingDelivered] = useState(false);

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
            {isFetched ? (
              data?.pages.map((_data, key1) => (
                <Fragment key={key1}>
                  {_data.count > 0 ? (
                    _data?.subOrders
                      ?.filter((subOrder) =>
                        subOrder.status === "DELIVERED" ||
                        subOrder.status === "DECLINED" ||
                        subOrder.status === "CANCELLED"
                          ? isShowingDelivered
                          : true
                      )
                      .map((subOrders, key2) => (
                        <SubOrderComponent
                          subOrder={subOrders}
                          key={key2}
                          refetch={refetch}
                          {...props}
                        />
                      ))
                  ) : (
                    <Flex alignItems="center" flexGrow={1} my={8} key={key1}>
                      <AntDesign name="meh" size={64} color="black" />
                      <Text mt={4}>No suborders found.</Text>
                    </Flex>
                  )}
                </Fragment>
              ))
            ) : (
              <Flex flexGrow={1} mt={5}>
                <Spinner />
              </Flex>
            )}
          </VStack>
        </ScrollView>
      </Flex>
      <HStack bgColor="primary.800" p={4}>
        <Checkbox
          value="showDelivered"
          onChange={(isSelected) => setIsShowingDelivered(isSelected)}
          isChecked={isShowingDelivered}
          _text={{
            color: "white",
          }}
        >
          Show Hidden Orders
        </Checkbox>
      </HStack>
    </Flex>
  );
}
