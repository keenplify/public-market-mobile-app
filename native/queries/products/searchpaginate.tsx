import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";
import { SERVER_API } from "../../helpers/string";
import { Product } from "../../helpers/types";
import { ProductsPaginateResponse } from "./cursorpaginate";

export const ProductsSearchCursorPaginateQuery = async (
  keyword: string,
  cursor?: number
) => {
  const asToken = await AsyncStorage.getItem("token");

  if (asToken === null || !asToken) return null;

  const response: AxiosResponse<ProductsPaginateResponse> = await axios.get(
    SERVER_API + "/api/products/customer/searchpaginate",
    {
      params: {
        cursor,
        keyword,
      },
      headers: {
        Authorization: "Bearer " + asToken,
      },
    }
  );

  return response.data;
};
