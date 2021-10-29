import React, { Fragment, useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  ScrollView,
  Spinner,
  Text,
  VStack,
} from "native-base";
import { Socket } from "socket.io-client";
import { Message } from "../helpers/types";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CustomerTabParamList, Grouped } from "./CustomerDashboard";
import { useInfiniteQuery, useQuery } from "react-query";
import { Formik } from "formik";
import { FormikInput } from "../components/FormikInput";
import { MessageCard } from "../components/MessageCard";
import { useRefetchOnFocus } from "../helpers/useRefetchOnFocus";
import { MessagesCursorPaginateQuery } from "../queries/messages/cursorpagination";
import { RefreshControl } from "react-native";
import { isCloseToBottom } from "../components/ProductsLayout";
import { Feather, AntDesign } from "@expo/vector-icons";
import { AddMessageQuery } from "../queries/messages/add";

interface Props
  extends BottomTabScreenProps<CustomerTabParamList, "Conversation"> {
  socket: Socket;
}

// export const isCloseToTop = ({
//   layoutMeasurement,
//   contentOffset,
//   contentSize,
// }) => {
//   // const paddingToBottom = 40;
//   return layoutMeasurement.height + contentOffset.y >= contentSize.height / 2;
// };

export function MessagesRoom({ socket, navigation, route }: Props) {
  const { data, isFetching, refetch, isFetched, hasNextPage, fetchNextPage } =
    useInfiniteQuery(
      ["room", route.params.to.id],
      async () => await MessagesCursorPaginateQuery(route.params.to.id),
      {
        getNextPageParam: (lastPage) => lastPage.nextId ?? false,
        refetchInterval: 5000,
      }
    );
  const [images] = useState([]);
  const to = route.params.to;

  // useRefetchOnFocus(() => {
  //   socket.emit("getConversation", to.id);
  // });

  useRefetchOnFocus(refetch);

  useEffect(() => {
    socket.on("messageCreated", () => {
      console.log("message received!");
      refetch();
    });
    socket.on("messageDeleted", refetch);
    socket.on("messageEdited", refetch);
  }, []);

  return (
    <Flex flexGrow={1} flex={1}>
      <ScrollView
        // refreshControl={
        //   <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        // }
        // onScroll={({ nativeEvent }) => {
        //   if (isCloseToBottom(nativeEvent) && hasNextPage && !isFetching) {
        //     fetchNextPage();
        //   }
        // }}
        // flex={1}
        _contentContainerStyle={{
          flexGrow: 1,
        }}
        // flexDirection="column-reverse"
      >
        <Flex flexDirection="column-reverse" flexGrow={1}>
          {isFetched ? (
            data.pages.map((_data, key1) => (
              <Fragment key={key1}>
                {_data.count > 0 &&
                  _data.messages.map((message, key2) => (
                    <MessageCard message={message} key={key2} socket={socket} />
                  ))}
              </Fragment>
            ))
          ) : (
            <Flex flexGrow={1} mt={5}>
              <Spinner />
            </Flex>
          )}
        </Flex>
      </ScrollView>
      <HStack bg="white">
        <Formik
          onSubmit={async ({ message }, actions) => {
            // socket.emit(
            //   "createMessage"
            //   // {
            //   //   message,
            //   //   toId: to.id,
            //   //   imageIds: [],
            //   // }
            // );
            const query = await AddMessageQuery({
              message,
              toId: to.id,
              images: [],
            });

            console.log(query);

            refetch();
            actions.resetForm();
          }}
          initialValues={{
            message: "",
          }}
        >
          {(formik) => (
            <Flex flexGrow={1} flexDirection="row">
              <Flex flexGrow={1} mb={1} mx={2}>
                <FormikInput
                  type="textarea"
                  name="message"
                  formik={formik}
                  hideLabel
                />
              </Flex>
              <Flex p={2} align="center" justify="center">
                <Button
                  isDisabled={formik.isSubmitting}
                  isLoading={formik.isSubmitting}
                  onPress={formik.submitForm}
                >
                  Send
                </Button>
              </Flex>
            </Flex>
          )}
        </Formik>
      </HStack>
    </Flex>
  );
}
