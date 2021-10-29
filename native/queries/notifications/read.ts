import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";
import { SERVER_API } from "../../helpers/string";
import { Notification, Product, User } from "../../helpers/types";

interface ReadNotificationResponse {
  message: string;
  notification: Notification;
}

export const ReadNotificationQuery = async (id: number) => {
  const asToken = await AsyncStorage.getItem("token");

  if (asToken === null || !asToken) return null;

  const response: AxiosResponse<ReadNotificationResponse> = await axios.put(
    SERVER_API + "/api/notifications/" + id,
    {},
    {
      headers: {
        Authorization: "Bearer " + asToken,
      },
    }
  );

  return response.data;
};
