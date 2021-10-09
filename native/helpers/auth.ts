import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { RootStackParamList } from "../App";
import { MeQuery } from "../queries/users/me";

export const useAuth = (
  props?: NativeStackScreenProps<RootStackParamList, any>
) => {
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
    AsyncStorage.removeItem("token").then();
    query.refetch().then(() => {
      props?.navigation.replace("Home");
    });
  };

  return { ...query, logout, setToken };
};

export const useUserQuery = (token: string) => {
  const query = useQuery(
    "user",
    async () => await MeQuery().then((res) => res?.user)
  );

  useEffect(() => {
    query.refetch();
  }, [token]);

  return query;
};
