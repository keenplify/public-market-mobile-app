import useTimeAgo from "@rooks/use-time-ago";
import { Badge, Box, Flex, HStack, Text, useDisclose } from "native-base";
import React, { Fragment } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Notification } from "../helpers/types";
import { Actionsheet } from "native-base";
import { NotificationsTabProps } from "../screens/Notifications";
import { ReadNotificationQuery } from "../queries/notifications/read";

interface Props extends NotificationsTabProps {
  notification: Notification;
}

export function NotificationCard({ notification, ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclose();
  const timeAgo = useTimeAgo(notification.createdAt, {
    intervalMs: 0,
    locale: "en-US",
    relativeDate: new Date(),
  });

  return (
    <Fragment>
      <TouchableOpacity
        onPress={async () => {
          await ReadNotificationQuery(notification.id);

          if (
            notification.type === "NEW_ORDER" ||
            notification.type === "ORDER_STATUS_UPDATE"
          )
            return props.navigation.navigate("Orders");

          if (notification.type === "MESSAGE")
            return props.navigation.navigate("Messages");

          if (notification.type === "REVIEW")
            return props.navigation.navigate("Product", {
              product: { id: notification.referencedId },
            });
        }}
        onLongPress={onOpen}
      >
        <Flex>
          <Flex
            borderBottomColor="#44403c"
            borderBottomWidth={1}
            flexDirection="row"
          >
            <Flex
              w={2}
              bg={notification.read ? "trueGray.500" : "primary.500"}
            ></Flex>
            <Flex ml={2} p={2}>
              <HStack>
                <Text fontWeight="bold">{notification.title}</Text>
                <Badge ml={2} children={timeAgo} variant="solid" />
                {notification.urgent && !notification.read && (
                  <Badge ml={1} colorScheme="primary" variant="solid">
                    URGENT
                  </Badge>
                )}
              </HStack>
              <Text>{notification.description}</Text>
            </Flex>
          </Flex>
        </Flex>
      </TouchableOpacity>

      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Actionsheet.Item>Delete</Actionsheet.Item>
          <Actionsheet.Item>Share</Actionsheet.Item>
          <Actionsheet.Item>Play</Actionsheet.Item>
          <Actionsheet.Item>Favourite</Actionsheet.Item>
          <Actionsheet.Item>Cancel</Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>
    </Fragment>
  );
}
