import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";
import { ModesOfPayment } from "../../customer-tabs/Cart";
import { SERVER_API } from "../../helpers/string";
import { CartItem, Product } from "../../helpers/types";

interface CancelOrderResponse {
  message: string;
  suborders: any;
}

export const CancelOrderQuery = async (id: number) => {
  const asToken = await AsyncStorage.getItem("token");

  if (asToken === null || !asToken) return null;

  try {
    const response: AxiosResponse<CancelOrderResponse> = await axios.post(
      SERVER_API + "/api/orders/customer/cancel/" + id,
      {},
      {
        headers: {
          Authorization: "Bearer " + asToken,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log(error);
  }
};
