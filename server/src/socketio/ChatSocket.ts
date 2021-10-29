import { createJWT } from "@shared/functions";
import logger from "@shared/Logger";
import { Socket } from "socket.io";
import jwt, { JwtPayload } from "jsonwebtoken";
import { PrismaClient, User } from ".prisma/client";

const authenticatedClients: ClientsObject = {};

interface ClientsObject {
  [userId: string]: Socket;
}

// var socket = new RealtimeClient(
//   process.env.REALTIME_URL || "ws://localhost:4000/socket"
// );
// socket.connect();

const prisma = new PrismaClient();

interface MessageContents {
  message: string;
  imageIds: number[];
  toId: number;
}

interface EditMessageContents {
  message: string;
  messageId: number;
}

interface AuthenticateContent {
  token: string;
  toId: number;
}

export function onNewWebSocketConnection(socket: Socket) {
  let user: User;

  socket.on("authenticate", async ({ token }: AuthenticateContent) => {
    const payload = jwt.decode(token);

    if (typeof payload === "object" && typeof payload?.id !== "number") return;
    const _user = payload as User;

    const query = await prisma.user.findFirst({
      where: {
        id: _user.id,
      },
    });
    console.log(payload);
    if (query) {
      user = query;
      authenticatedClients[user.id] = socket;

      const messages = await prisma.message.findMany({
        where: {
          OR: [
            {
              fromId: user.id,
            },
            {
              toId: user.id,
            },
          ],
        },
        orderBy: {
          id: "desc",
        },
      });
      socket.emit("initialMessages", { message: "Success", messages });

      socket.emit("authenticated");
    }
  });

  socket.on("getConversation", async (toID) => {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            fromId: user.id,
            toId: toID,
          },
          {
            fromId: toID,
            toId: user.id,
          },
        ],
      },
      orderBy: {
        id: "desc",
      },
    });
    console.log("messages", messages);
    socket.emit("initialMessages", { message: "Success", messages });
  });

  socket.on("createMessage", async () =>
    // { imageIds, message, toId }: MessageContents
    {
      // console.log({ imageIds, message, toId, user }, "new message");
      // const newMessage = await prisma.message.create({
      //   data: {
      //     message: message,
      //     toId: toId,
      //     fromId: user.id,
      //   },
      // });

      // imageIds?.length > 0 &&
      //   (await prisma.image.updateMany({
      //     where: {
      //       OR: imageIds.map((id: number) => ({ id })),
      //     },
      //     data: {
      //       messageId: newMessage.id,
      //     },
      //   }));

      // if (authenticatedClients[newMessage.toId])
      //   authenticatedClients[newMessage.toId].emit("messageCreated", {
      //     message: "Success",
      //     newMessage,
      //   });
      socket.emit("messageCreated", {
        message: "Success",
        //  newMessage
      });
    }
  );

  socket.on("deleteMessage", async (messageId: number) => {
    const del = await prisma.message.delete({
      where: {
        id: messageId,
      },
    });

    if (!del)
      return socket.emit("error", { message: "Message cannot be deleted." });

    if (authenticatedClients[del.toId])
      authenticatedClients[del.toId].emit("messageDeleted", {
        message: "Success",
        del,
      });
    return socket.emit("messageDeleted", { message: "Success", messageId });
  });

  socket.on(
    "editMessage",
    async ({ message, messageId }: EditMessageContents) => {
      const edit = await prisma.message.update({
        where: {
          id: messageId,
        },
        data: {
          message: message,
        },
      });

      socket.emit("messageEdited", { message: "Success", edit });
      if (authenticatedClients[edit.toId])
        authenticatedClients[edit.toId].emit("messageEdited", {
          message: "Success",
          edit,
        });
    }
  );

  socket.on("disconnect", () => {
    if (user?.id) delete authenticatedClients[user.id];

    logger.info(`${socket.id} has disconnected.`);
  });
}

export function getAuthenticatedClients() {
  return authenticatedClients;
}
