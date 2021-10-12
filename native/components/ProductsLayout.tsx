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
import { useInfiniteQuery, useQuery } from "react-query";
import { CustomerHomeMainProps } from "../customer-tabs/Home";
import { useUserQuery } from "../helpers/auth";
import { ProductsCursorPaginateQuery } from "../queries/products/cursorpaginate";
import { SellerHomeMainProps } from "../seller-tabs/Home";
import { ProductCard } from "./ProductCard";

export function ProductsLayout(
  props: CustomerHomeMainProps | SellerHomeMainProps
) {
  const { data, fetchNextPage, hasNextPage, isFetched, error } =
    useInfiniteQuery(
      "products_layout",
      async ({ pageParam }) => await ProductsCursorPaginateQuery(pageParam),
      {
        getNextPageParam: (lastPage) => lastPage.nextId ?? false,
      }
    );

  return (
    <Flex flexDirection="column" flexGrow={1} mx={1}>
      <Flex alignItems="flex-start" flexWrap="wrap" flexDirection="row">
        {isFetched ? (
          data.pages.map((_data, key) =>
            _data.count > 0 ? (
              _data.products.map((product, key) => (
                <ProductCard product={product} key={key} {...props} />
              ))
            ) : (
              <Text key={key}>No products found.</Text>
            )
          )
        ) : (
          <Flex flexGrow={1}>
            <Spinner />
          </Flex>
        )}
      </Flex>
      {hasNextPage && (
        <Flex mt={2} mx={2}>
          <Button onPress={() => fetchNextPage()}>
            {hasNextPage ? "Load More..." : "No more products to show."}
          </Button>
        </Flex>
      )}
    </Flex>
  );
}
