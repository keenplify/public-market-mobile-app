import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";
import { SERVER_API } from "../../helpers/string";
import { Message, Notification, Order } from "../../helpers/types";

interface NotificationsPaginateResponse {
  message: string;
  notifications: Notification[];
  count: number;
  nextId: number;
}

export const NotificationsPaginateQuery = async (cursor?: number) => {
  const asToken = await AsyncStorage.getItem("token");

  if (asToken === null || !asToken) return null;

  const response: AxiosResponse<NotificationsPaginateResponse> =
    await axios.get(SERVER_API + "/api/notifications/cursorpaginate", {
      params: {
        cursor,
      },
      headers: {
        Authorization: "Bearer " + asToken,
      },
    });

  return response.data;
};
