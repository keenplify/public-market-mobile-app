import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";
import { SERVER_API } from "../../helpers/string";
import { Product } from "../../helpers/types";

interface ProductsPaginateResponse {
  message: string;
  products: Product[];
  token: string;
  count: number;
}

export const ProductsPaginateQuery = async (
  skip: number,
  take: number,
  token?: string
) => {
  const asToken = token || (await AsyncStorage.getItem("token"));

  if (asToken === null || !asToken) return null;

  const response: AxiosResponse<ProductsPaginateResponse> = await axios.get(
    SERVER_API + "/api/products/paginate",
    {
      params: {
        skip,
        take,
      },
      headers: {
        Authorization: "Bearer " + asToken,
      },
    }
  );

  return response.data;
};
