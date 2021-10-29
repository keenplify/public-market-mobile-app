import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";
import { useToast } from "native-base";
import { SERVER_API } from "../../helpers/string";
import { Message, Product } from "../../helpers/types";

interface AddMessageResponse {
  message: string;
  newMessage: Message;
}

interface Props {
  message: string;
  toId: number;
  images: number[];
}

export const AddMessageQuery = async ({ message, toId, images }: Props) => {
  const asToken = await AsyncStorage.getItem("token");

  if (asToken === null || !asToken) return null;

  try {
    const response: AxiosResponse<AddMessageResponse> = await axios.post(
      SERVER_API + "/api/messages/add",
      { message, images, toId },
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
