import React, { createContext, useContext } from "react";
import { Socket } from "socket.io-client";
import { Message } from "./types";

export const SocketContext = createContext<{
  socket: Partial<Socket<any, any>>;
  messages: Message[];
}>({
  socket: {},
  messages: [],
});

export const useSocketContext = useContext(SocketContext);
