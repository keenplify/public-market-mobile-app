import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";
import { SERVER_API } from "../../helpers/string";
import { Product } from "../../helpers/types";

interface DeleteProductResponse {
  message: string;
}

export const DeleteProductQuery = async (id: number) => {
  const asToken = await AsyncStorage.getItem("token");

  const response: AxiosResponse<DeleteProductResponse> = await axios.delete(
    SERVER_API + "/api/products/" + id,
    {
      headers: {
        Authorization: "Bearer " + asToken,
      },
    }
  );

  return response;
};
