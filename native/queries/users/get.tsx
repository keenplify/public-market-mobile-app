import axios, { AxiosResponse } from "axios";
import { SERVER_API } from "../../helpers/string";
import { Product, User } from "../../helpers/types";

interface GetUserResponse {
  message: string;
  user: User;
}

export const GetUserQuery = async (id: number) => {
  const response: AxiosResponse<GetUserResponse> = await axios.get(
    SERVER_API + "/api/users/" + id
  );

  return response.data;
};
