import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";
import { SERVER_API } from "../../helpers/string";
import { SubOrder } from "../../helpers/types";

interface SellerSubOrderChangeStatusResponse {
  message: string;
  subOrder: SubOrder;
}

export const SellerSubOrderChangeStatusQuery = async (
  id: number,
  status: string,
  token?: string
) => {
  const asToken = token || (await AsyncStorage.getItem("token"));

  if (asToken === null || !asToken) return null;

  const response: AxiosResponse<SellerSubOrderChangeStatusResponse> =
    await axios.post(
      SERVER_API + "/api/orders/seller/suborders/changestatus/" + id,
      {
        status,
      },
      {
        headers: {
          Authorization: "Bearer " + asToken,
        },
      }
    );

  return response.data;
};
