import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";
import { SERVER_API } from "../../helpers/string";
import { User } from "../../helpers/types";

interface MeResponse {
  message: string;
  user: User;
  token: string;
}

export const MeQuery = async (token?: string) => {
  const asToken = token || (await AsyncStorage.getItem("token"));
  if (asToken === null || !asToken) return null;

  try {
    const response = await axios.get<MeResponse>(SERVER_API + "/api/users/me", {
      headers: {
        Authorization: "Bearer " + asToken,
      },
    });

    return response.data;
  } catch (err) {
    await AsyncStorage.removeItem("token");
  }

  return null;
};
