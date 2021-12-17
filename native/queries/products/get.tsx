import axios, { AxiosResponse } from "axios";
import { SERVER_API } from "../../helpers/string";
import { Product } from "../../helpers/types";

interface GetProductResponse {
  message: string;
  product: Product;
  ratingsAverage: number;
  reccommendedProducts: Product[];
}

export const GetProductQuery = async (id: number) => {
  const response: AxiosResponse<GetProductResponse> = await axios.get(
    SERVER_API + "/api/products/" + id
  );

  return response;
};
