import axios, { AxiosResponse } from "axios";
import { SERVER_API } from "../../helpers/string";
import { User } from "../../helpers/types";

interface LoginResponse {
  message: string;
  user: User;
  token: string;
  error?: any;
}

export const RegisterQuery = async (
  email: string,
  number: string,
  username: string,
  password: string,
  gender: string,
  type: string
) => {
  const response: AxiosResponse<LoginResponse> = await axios.post(
    SERVER_API + "/api/users/add",
    {
      email,
      number,
      username,
      password,
      gender,
      type,
    }
  );

  return response.data;
};
