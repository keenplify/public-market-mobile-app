import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";
import { SERVER_API } from "../../helpers/string";
import { Address } from "../../helpers/types";

export interface GetCustomerAddressResponse {
  message: string;
  address: Address;
}

export const GetCustomerAddressQuery = async () => {
  try {
    const asToken = await AsyncStorage.getItem("token");

    if (asToken === null || !asToken) return null;

    const response: AxiosResponse<GetCustomerAddressResponse> = await axios.get(
      SERVER_API + "/api/address/customer",
      {
        headers: {
          Authorization: "Bearer " + asToken,
        },
      }
    );

    return response.data;
  } catch (error) {
    return { message: "Error", error };
  }
};
