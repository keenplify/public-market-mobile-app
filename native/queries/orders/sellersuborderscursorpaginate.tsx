import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";
import { SERVER_API } from "../../helpers/string";
import { SubOrder } from "../../helpers/types";

interface SellerSubOrdersPaginateResponse {
  message: string;
  subOrders: SubOrder[];
  token: string;
  count: number;
  nextId: number;
}

export const SellerSubOrdersCursorPaginateQuery = async (
  cursor?: number,
  token?: string
) => {
  const asToken = token || (await AsyncStorage.getItem("token"));

  if (asToken === null || !asToken) return null;

  const response: AxiosResponse<SellerSubOrdersPaginateResponse> =
    await axios.get(
      SERVER_API + "/api/orders/seller/suborders/cursorpaginate",
      {
        params: {
          cursor,
        },
        headers: {
          Authorization: "Bearer " + asToken,
        },
      }
    );

  return response.data;
};
