import axios, { AxiosResponse } from "axios";
import { SERVER_API } from "../../helpers/string";
import { User } from "../../helpers/types";

interface LoginResponse {
  message: string;
  user: User;
  token: string;
}

export const LoginQuery = async (email: string, password: string) => {
  try {
    const response: AxiosResponse<LoginResponse> = await axios.post(
      SERVER_API + "/api/users/login",
      {
        email,
        password,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return { message: "Cannot connect to the server", error };
  }
};
