import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";
import { SERVER_API } from "../../helpers/string";
import { Order } from "../../helpers/types";

interface CustomerOrdersPaginateResponse {
  message: string;
  orders: Order[];
  token: string;
  count: number;
  nextId: number;
}

export const CustomerOrdersCursorPaginateQuery = async (
  cursor?: number,
  token?: string
) => {
  const asToken = token || (await AsyncStorage.getItem("token"));

  if (asToken === null || !asToken) return null;

  const response: AxiosResponse<CustomerOrdersPaginateResponse> =
    await axios.get(SERVER_API + "/api/orders/customer/cursorpaginate", {
      params: {
        cursor,
      },
      headers: {
        Authorization: "Bearer " + asToken,
      },
    });

  return response.data;
};
