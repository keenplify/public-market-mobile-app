import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";
import { Address } from "cluster";
import { AddressFormValues } from "../../components/AddressFormComponent";
import { SERVER_API } from "../../helpers/string";
import { Product } from "../../helpers/types";

interface AddAddressResponse {
  message: string;
  address: Address;
}

export const AddAddressQuery = async (values: AddressFormValues) => {
  const asToken = await AsyncStorage.getItem("token");

  if (asToken === null || !asToken) return null;

  try {
    const response: AxiosResponse<AddAddressResponse> = await axios.post(
      SERVER_API + "/api/address/add",
      values,
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
