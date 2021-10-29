import { Flex, ScrollView, Text, Spinner } from "native-base";
import React, { ReactNode } from "react";
import { RefreshControl } from "react-native";
import { UseInfiniteQueryResult } from "react-query";
import { CustomerHomeMainProps } from "../customer-tabs/Home";
import { ProductCard } from "./ProductCard";
import { SellerHomeMainProps } from "../seller-tabs/Home";
import { AntDesign } from "@expo/vector-icons";

export const isCloseToBottom = ({
  layoutMeasurement,
  contentOffset,
  contentSize,
}) => {
  // const paddingToBottom = 40;
  return layoutMeasurement.height + contentOffset.y >= contentSize.height / 2;
};

interface Props {
  query: UseInfiniteQueryResult<any, any>;
  otherProps: CustomerHomeMainProps | SellerHomeMainProps;
}

export function TrueProductLayout({ query, otherProps }: Props) {
  const { isFetching, refetch, hasNextPage, fetchNextPage, isFetched, data } =
    query;

  return (
    <ScrollView
      style={{ flex: 1, flexGrow: 1 }}
      refreshControl={
        <RefreshControl refreshing={isFetching} onRefresh={refetch} />
      }
      onScroll={({ nativeEvent }) => {
        if (isCloseToBottom(nativeEvent) && hasNextPage && !isFetching) {
          fetchNextPage();
        }
      }}
    >
      <Flex flexDirection="column" flexGrow={1} mx={1}>
        <Flex flexWrap="wrap" flexDirection="row" w="100%">
          {isFetched ? (
            data.pages.map((_data, key1) =>
              _data?.count > 0 ? (
                _data.products.map((product, key2) => (
                  <ProductCard
                    product={product}
                    key={`${key1}${key2}`}
                    {...otherProps}
                  />
                ))
              ) : (
                <Flex alignItems="center" flexGrow={1} my={8} key={key1}>
                  <AntDesign name="meh" size={64} color="black" />
                  <Text mt={4}>No products found.</Text>
                </Flex>
              )
            )
          ) : (
            <Flex flexGrow={1} mt={5}>
              <Spinner />
            </Flex>
          )}
        </Flex>
      </Flex>
    </ScrollView>
  );
}
