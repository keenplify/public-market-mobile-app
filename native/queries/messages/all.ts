import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";
import { SERVER_API } from "../../helpers/string";
import { Message } from "../../helpers/types";

interface GetAllMessagesResponse {
  message: string;
  messages: Message[];
}

export const getAllMessagesQuery = async () => {
  const asToken = await AsyncStorage.getItem("token");

  if (asToken === null || !asToken) return null;
  const response: AxiosResponse<GetAllMessagesResponse> = await axios.get(
    SERVER_API + "/api/messages/all",
    {
      headers: {
        Authorization: "Bearer " + asToken,
      },
    }
  );

  return response.data;
};
