import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";
import { SERVER_API } from "../../helpers/string";

interface DeleteCartItemResponse {
  message: string;
}

export const DeleteCartItemQuery = async (id: number) => {
  const asToken = await AsyncStorage.getItem("token");

  const response: AxiosResponse<DeleteCartItemResponse> = await axios.delete(
    SERVER_API + "/api/cartitems/" + id,
    {
      headers: {
        Authorization: "Bearer " + asToken,
      },
    }
  );

  return response;
};
