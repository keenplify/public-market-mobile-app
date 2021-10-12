import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";
import { useToast } from "native-base";
import { SERVER_API } from "../../helpers/string";
import { Product } from "../../helpers/types";

interface AddImageResponse {
  message: string;
  product: Product;
}

interface Props {
  name: string;
  description: string;
  price: string;
  images: number[];
}

export const AddProductQuery = async ({
  name,
  description,
  price,
  images,
}: Props) => {
  const asToken = await AsyncStorage.getItem("token");

  if (asToken === null || !asToken) return null;

  try {
    const response: AxiosResponse<AddImageResponse> = await axios.post(
      SERVER_API + "/api/products/add",
      { name, description, price, images },
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
