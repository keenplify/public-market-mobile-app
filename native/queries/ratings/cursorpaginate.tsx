import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";
import { SERVER_API } from "../../helpers/string";
import { Rating } from "../../helpers/types";

interface RatingsPaginateResponse {
  message: string;
  ratings: Rating[];
  count: number;
  nextId: number;
}

export const RatingsCursorPaginateQuery = async (
  productId: number,
  cursor?: number,
  token?: string
) => {
  const asToken = token || (await AsyncStorage.getItem("token"));

  if (asToken === null || !asToken) return null;

  const response: AxiosResponse<RatingsPaginateResponse> = await axios.get(
    SERVER_API + "/api/ratings/cursorpaginate",
    {
      params: {
        cursor,
        productId,
      },
      headers: {
        Authorization: "Bearer " + asToken,
      },
    }
  );

  return response.data;
};
