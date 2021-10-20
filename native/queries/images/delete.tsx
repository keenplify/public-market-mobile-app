import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";
import { SERVER_API } from "../../helpers/string";

interface DeleteImageResponse {
  message: string;
}

export const DeleteImageQuery = async (id: number) => {
  const asToken = await AsyncStorage.getItem("token");

  const response: AxiosResponse<DeleteImageResponse> = await axios.delete(
    SERVER_API + "/api/images/" + id,
    {
      headers: {
        Authorization: "Bearer " + asToken,
      },
    }
  );

  return response;
};
