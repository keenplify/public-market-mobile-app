import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContext } from "@react-navigation/native";
import {
  Box,
  Button,
  Divider,
  Flex,
  ScrollView,
  Spinner,
  Text,
  Toast,
  VStack,
} from "native-base";
import React, { useEffect } from "react";
import { RefreshControl } from "react-native";
import { useInfiniteQuery, useQuery } from "react-query";
import { CustomerHomeMainProps } from "../customer-tabs/Home";
import { useUserQuery } from "../helpers/auth";
import { ProductsCursorPaginateQuery } from "../queries/products/cursorpaginate";
import { SellerHomeMainProps } from "../seller-tabs/Home";
import { ProductCard } from "./ProductCard";

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 40;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

export function ProductsLayout(
  props: CustomerHomeMainProps | SellerHomeMainProps
) {
  const { data, fetchNextPage, hasNextPage, isFetched, refetch, isFetching } =
    useInfiniteQuery(
      "products_layout",
      async ({ pageParam }) => await ProductsCursorPaginateQuery(pageParam),
      {
        getNextPageParam: (lastPage) => lastPage.nextId ?? false,
      }
    );

  useEffect(() => {
    props.navigation.addListener("focus", () => refetch());
  }, []);

  return (
    <ScrollView
      style={{ flex: 1, flexGrow: 1 }}
      refreshControl={
        <RefreshControl refreshing={isFetching} onRefresh={refetch} />
      }
      onScroll={({ nativeEvent }) => {
        if (isCloseToBottom(nativeEvent) && hasNextPage) {
          fetchNextPage();
        }
      }}
    >
      <Flex flexDirection="column" flexGrow={1} mx={1}>
        <Flex flexWrap="wrap" flexDirection="row" w="100%">
          {isFetched ? (
            data.pages.map((_data, key1) =>
              _data.count > 0 ? (
                _data.products.map((product, key2) => (
                  <ProductCard
                    product={product}
                    key={`${key1}${key2}`}
                    {...props}
                  />
                ))
              ) : (
                <Text key={key1}>No products found.</Text>
              )
            )
          ) : (
            <Flex flexGrow={1}>
              <Spinner />
            </Flex>
          )}
        </Flex>
      </Flex>
    </ScrollView>
  );
}
