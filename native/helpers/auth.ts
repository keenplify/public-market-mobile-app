import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToast } from "native-base";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { io, Socket } from "socket.io-client";
import { MeQuery } from "../queries/users/me";
import { SERVER_API, SERVER_SOCKET } from "./string";
import { MessageReport, Message } from "./types";
import { useRefetchOnFocus } from "./useRefetchOnFocus";

export const useAuth = (props?: any) => {
  const query = useQuery("check", async () => await MeQuery());
  const toast = useToast();

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
      toast.show({ description: "Logging out..." });
      query
        .refetch()
        .then(() => setTimeout(() => props?.navigation.replace("Home"), 1000));
    });
  };

  return { ...query, logout, setToken };
};

export const useUserQuery = (token?: string) => {
  const query = useQuery("user", async () => await MeQuery());

  useEffect(() => {
    query.refetch();
  }, [token]);

  return query;
};

export const useSocket = () => {
  const [socket] = useState(
    io(SERVER_SOCKET, {
      reconnection: true,
      transports: ["websocket"],
      agent: false,
      upgrade: false,
      rejectUnauthorized: false,
    })
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const toast = useToast();
  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem("token");

      socket.on("connect", () => {
        console.log("authenticating...");
        socket.emit("authenticate", { token });
      });

      socket.on("authenticated", () => {
        toast.show({ description: "Authenticated successfully." });
      });

      socket.on("unauthorized", (msg) => {
        console.log(`unauthorized: ${JSON.stringify(msg.data)}`);
        throw new Error(msg.data.type);
      });

      socket.on(
        "initialMessages",
        ({ messages: CMessages }: initialMessagesContent) => {
          setMessages([...CMessages, ...messages]);
        }
      );

      socket.on("messageCreated", ({ newMessage }: messageCreatedContent) => {
        setMessages([...messages, newMessage]);
      });

      socket.on("messageDeleted", (messageId: number) => {
        setMessages(messages.filter((m) => m.id !== messageId));
      });

      socket.on("messageEdited", ({ edit }: messageEditedContent) => {
        console.log("message edited", edit);
      });

      // return () => {
      //   socket.disconnect();
      // };
    })();
  }, []);

  // const sendMessage = (message: string, imageIds: number[], toId: number) =>
  //   socket.emit("createMessage", { imageIds, message, toId });

  // const deleteMessage = (messageId: number) =>
  //   socket.emit("deleteMessage", messageId);

  // const editMessage = (messageId: number, message: string) =>
  //   socket.emit("editMessage", { messageId, message });

  // const getConversation = (toId: number) =>
  //   socket.emit("getConversation", toId);

  const authenticate = (token: string) => socket.emit("authenticate", token);

  return {
    socket,
    authenticate,
    messages,
  };
};

interface initialMessagesContent extends MessageReport {
  messages: Message[];
}

interface messageCreatedContent extends MessageReport {
  newMessage: Message;
}

interface messageEditedContent extends MessageReport {
  edit: Message;
}
