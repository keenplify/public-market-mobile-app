import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";
import { ModesOfPayment } from "../../customer-tabs/Cart";
import { SERVER_API } from "../../helpers/string";
import { CartItem, Product } from "../../helpers/types";

interface CheckoutOrderResponse {
  message: string;
  newOrder: CartItem;
}

export const CheckoutOrderQuery = async (mop: ModesOfPayment) => {
  const asToken = await AsyncStorage.getItem("token");

  if (asToken === null || !asToken) return null;

  try {
    const response: AxiosResponse<CheckoutOrderResponse> = await axios.post(
      SERVER_API + "/api/orders/checkout",
      { mop },
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
