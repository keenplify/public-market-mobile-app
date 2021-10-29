import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";
import { SERVER_API } from "../../helpers/string";
import { CartItem, Product } from "../../helpers/types";

interface AddCartItemResponse {
  message: string;
  cartItem: CartItem;
}

interface Props {
  product: Partial<Product>;
  quantity: number;
}

export const AddCartItemQuery = async ({ product, quantity }: Props) => {
  const asToken = await AsyncStorage.getItem("token");

  if (asToken === null || !asToken) return null;

  try {
    const response: AxiosResponse<AddCartItemResponse> = await axios.post(
      SERVER_API + "/api/cartitems/add",
      { productId: product.id, quantity },
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
