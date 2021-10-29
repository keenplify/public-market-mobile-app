import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";
import { SERVER_API } from "../../helpers/string";
import { Message, Order } from "../../helpers/types";

interface MessagesPaginateResponse {
  message: string;
  messages: Message[];
  token: string;
  count: number;
  nextId: number;
}

export const MessagesCursorPaginateQuery = async (
  toId: number,
  cursor?: number
) => {
  const asToken = await AsyncStorage.getItem("token");

  if (asToken === null || !asToken) return null;

  const response: AxiosResponse<MessagesPaginateResponse> = await axios.get(
    SERVER_API + "/api/messages/cursorpaginate",
    {
      params: {
        cursor,
        toId,
      },
      headers: {
        Authorization: "Bearer " + asToken,
      },
    }
  );

  return response.data;
};
