import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";
import { SERVER_API } from "../../helpers/string";
import { CartItem } from "../../helpers/types";

interface getAllCartItemsResponse {
  message: string;
  cartItems: CartItem[];
}

export async function getAllCartItemsQuery() {
  const asToken = await AsyncStorage.getItem("token");

  if (asToken === null || !asToken) return null;

  try {
    const response: AxiosResponse<getAllCartItemsResponse> = await axios.get(
      SERVER_API + "/api/cartitems/all",
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
}
