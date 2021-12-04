import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToast } from "native-base";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { io, Socket } from "socket.io-client";
import { MeQuery } from "../queries/users/me";
import { SERVER_API, SERVER_SOCKET } from "./string";
import { MessageReport, Message } from "./types";
import { useRefetchOnFocus } from "./useRefetchOnFocus";

export const useAuth = (props?: any) => {
  const queryClient = useQueryClient();
  const query = useQuery("check", async () => await MeQuery());

  useEffect(() => {
    if (query.data?.token)
      AsyncStorage.setItem("token", query.data?.token).then();
  }, [query.data]);

  const setToken = async (token: string) => {
    await AsyncStorage.setItem("token", token);
    query.refetch();
  };

  const logout = () => {
    AsyncStorage.removeItem("token").then(() => {
      queryClient.clear();
      props?.navigation.replace("Splash");
    });
  };

  return { ...query, logout, setToken };
};

export const useUserQuery = (token?: string) => {
  const query = useQuery("user", async () => await MeQuery());

  useRefetchOnFocus(query.refetch);
  useEffect(() => {
    query.refetch();
  }, [token]);

  return query;
};
