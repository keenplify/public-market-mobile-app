import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { ScrollView, Text } from "native-base";
import React, { Fragment, useEffect } from "react";
import { useInfiniteQuery } from "react-query";
import { useDebounce } from "rooks";
import { TrueProductLayout } from "../components/TrueProductLayout";
import { useSearchContext } from "../helpers/SearchContext";
import { useRefetchOnFocus } from "../helpers/useRefetchOnFocus";
import { ProductsSearchCursorPaginateQuery } from "../queries/products/searchpaginate";
import { CustomerTabParamList } from "./CustomerDashboard";

interface Props extends BottomTabScreenProps<CustomerTabParamList, "Search"> {
  keyword: string;
}

export function SearchScreen({ keyword, ...props }: Props) {
  const query = useInfiniteQuery(
    "search",
    async ({ pageParam }) => {
      if (keyword.length > 0)
        return await ProductsSearchCursorPaginateQuery(keyword, pageParam);
    },
    {
      getNextPageParam: (lastPage) => lastPage?.nextId ?? false,
    }
  );

  useEffect(() => {
    if (keyword.length > 0) query.refetch();
    else props.navigation.goBack();
  }, [keyword]);

  useRefetchOnFocus(query.refetch);

  return (
    <Fragment>
      {/* @ts-ignore */}
      <TrueProductLayout query={query} otherProps={props} />
    </Fragment>
  );
}
