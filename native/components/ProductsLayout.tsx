import { Flex, ScrollView, Spinner, Text } from "native-base";
import React, { Fragment, useEffect } from "react";
import { RefreshControl } from "react-native";
import { useInfiniteQuery, useQuery } from "react-query";
import { CustomerHomeMainProps } from "../customer-tabs/Home";
import { ProductsCursorPaginateQuery } from "../queries/products/cursorpaginate";
import { SellerHomeMainProps } from "../seller-tabs/Home";
import { ProductCard } from "./ProductCard";
import { AntDesign } from "@expo/vector-icons";
import { useRefetchOnFocus } from "../helpers/useRefetchOnFocus";
import { TrueProductLayout } from "./TrueProductLayout";

export function ProductsLayout(
  props: CustomerHomeMainProps | SellerHomeMainProps
) {
  const query = useInfiniteQuery(
    "products_layout",
    async ({ pageParam }) => await ProductsCursorPaginateQuery(pageParam),
    {
      getNextPageParam: (lastPage) => lastPage.nextId ?? false,
    }
  );

  // useEffect(() => {
  //   props.navigation.addListener("focus", () => refetch());
  // }, []);
  useRefetchOnFocus(query.refetch);

  return (
    <Fragment>
      <TrueProductLayout query={query} otherProps={props} />
    </Fragment>
  );
}
