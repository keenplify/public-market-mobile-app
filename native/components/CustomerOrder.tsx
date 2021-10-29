import React, { Fragment, useState } from "react";
import { Flex, Text, Actionsheet, useDisclose, Box } from "native-base";
import { Order } from "../helpers/types";
import { TouchableOpacity } from "react-native";
import { SubOrderComponent } from "./SubOrder";
import { CustomerSubOrderComponent } from "./CustomerSubOrder";
import { Feather } from "@expo/vector-icons";
import randomColor from "randomcolor";
import { CustomerOrdersComponentProps } from "../customer-tabs/CustomerOrders";

interface Props extends CustomerOrdersComponentProps {
  order: Order;
  refetch: () => void;
}

export function CustomerOrderComponent({ order, refetch, ...props }: Props) {
  const [color] = useState(randomColor({ luminosity: "dark", alpha: 50 }));
  return (
    <Fragment>
      <Flex
        borderWidth={5}
        m={1}
        borderRadius={4}
        flexDirection="row"
        shadow={2}
        borderColor={color}
        bgColor="white"
      >
        <Flex width="100%">
          <Flex bgColor={color} px={2} w="100%">
            <Flex flexDirection="row">
              <Text fontWeight="bold" color="white">
                Date Ordered:
              </Text>
              <Text ml={2} color="white">
                {new Date(order.createdAt).toLocaleDateString()}
              </Text>
            </Flex>
            <Flex flexDirection="row">
              <Text fontWeight="bold" color="white">
                Mode of Payment:
              </Text>
              <Text ml={2} color="white">
                {order.modeOfPayment}
              </Text>
            </Flex>
          </Flex>

          <Flex bgColor={`${color}22`} px={2}>
            <Text fontWeight="bold" color="black">
              Suborders:
            </Text>
          </Flex>
          <Flex p={1}>
            {order.subOrders.map((subOrder, key) => (
              <CustomerSubOrderComponent
                subOrder={subOrder}
                key={key}
                color={color}
                refetch={refetch}
                {...props}
              />
            ))}
          </Flex>
        </Flex>
      </Flex>
    </Fragment>
  );
}
