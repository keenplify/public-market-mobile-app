import { Flex, Heading, ScrollView, Spinner, Text, VStack } from "native-base";
import React, { Fragment } from "react";
import { RefreshControl } from "react-native";
import { useInfiniteQuery } from "react-query";
import { isCloseToBottom } from "../components/ProductsLayout";
import { RatingCard } from "../components/RatingCard";
import { useProduct } from "../helpers/ProductContext";
import { PRIMARY_COLOR } from "../helpers/string";
import { useRefetchOnFocus } from "../helpers/useRefetchOnFocus";
import { RatingsCursorPaginateQuery } from "../queries/ratings/cursorpaginate";
import { AntDesign, Feather } from "@expo/vector-icons";

export function ProductRatings(props: any) {
  const { product } = useProduct();

  const { data, fetchNextPage, hasNextPage, isFetched, refetch, isFetching } =
    useInfiniteQuery(
      "seller_suborders",
      async ({ pageParam }) =>
        await RatingsCursorPaginateQuery(product.id, pageParam),
      {
        getNextPageParam: (lastPage) => lastPage?.nextId ?? false,
      }
    );

  useRefetchOnFocus(refetch);

  return (
    <Flex>
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
            <Heading ml={4} color="white">
              <Heading color="secondary.200">{product.name}</Heading> Ratings
            </Heading>
          </Flex>
          {isFetched ? (
            data.pages.map((_data, key1) => (
              <Fragment key={key1}>
                {_data?.count > 0 && _data.ratings ? (
                  _data.ratings.map((rating, key2) => (
                    <RatingCard rating={rating} refetch={refetch} key={key2} />
                  ))
                ) : (
                  <Flex alignItems="center" flexGrow={1} my={8} key={key1}>
                    <AntDesign name="meh" size={64} color="black" />
                    <Text mt={4}>No ratings found for this product.</Text>
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
  );
}
