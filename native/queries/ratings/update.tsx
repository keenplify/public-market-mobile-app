import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";
import { useToast } from "native-base";
import { SERVER_API } from "../../helpers/string";
import { Product } from "../../helpers/types";

interface UpdateRatingResponse {
  message: string;
  rating: Product;
}

interface Props {
  text: string;
  ratingId: number;
  images: number[];
}

export const UpdateRatingQuery = async ({ text, ratingId, images }: Props) => {
  const asToken = await AsyncStorage.getItem("token");

  if (asToken === null || !asToken) return null;

  try {
    const response: AxiosResponse<UpdateRatingResponse> = await axios.put(
      SERVER_API + "/api/ratings/" + ratingId,
      { text, images },
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
