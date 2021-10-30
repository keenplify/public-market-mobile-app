import React, { Fragment, useRef, useState } from "react";
import {
  Actionsheet,
  AlertDialog,
  Badge,
  Box,
  Button,
  Flex,
  Image,
  Text,
  useDisclose,
  useToast,
} from "native-base";
import { SubOrder } from "../helpers/types";
import { moneySign, serveImageURI } from "../helpers/string";
import Feather from "@expo/vector-icons/build/Feather";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { CustomerOrdersComponentProps } from "../customer-tabs/CustomerOrders";
import { AntDesign } from "@expo/vector-icons";
import { CancelOrderQuery } from "../queries/orders/cancelorder";

interface Props extends CustomerOrdersComponentProps {
  subOrder: SubOrder;
  color: string;
  refetch: () => void;
}
export function CustomerSubOrderComponent({
  subOrder,
  color,
  refetch,
  ...props
}: Props) {
  const [isCancelSubOrderOpen, setIsCancelSubOrderOpen] = useState(false);
  const onCancelSubOrderClose = () => setIsCancelSubOrderOpen(false);
  const cancelRef = useRef();

  const { isOpen, onOpen, onClose } = useDisclose();
  const toast = useToast();
  return (
    <Fragment>
      <TouchableOpacity onPress={onOpen}>
        <Flex
          flexDirection="row"
          borderBottomColor="#57534e"
          borderBottomWidth={1}
        >
          <Flex mr={2} justifyContent="center" my={1}>
            {subOrder.product?.images && subOrder.product.images[0] ? (
              <Image
                source={serveImageURI(subOrder.product.images[0].id)}
                alt="Preview"
                style={{ aspectRatio: 1, width: 62 }}
                borderRadius="md"
              />
            ) : (
              <Box
                style={{ aspectRatio: 1, width: 52 }}
                bgColor="gray.500"
                borderRadius="md"
              />
            )}
          </Flex>
          <Flex justifyContent="center">
            <Flex flexDirection="row">
              <Badge
                bgColor={color}
                _text={{
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                {subOrder.product.seller.username}
              </Badge>
              <Text
                fontWeight="bold"
                ml={2}
                noOfLines={1}
                ellipsizeMode="tail"
                w="70%"
              >
                {subOrder.product.name}
              </Text>
            </Flex>
            <Flex flexDirection="row">
              <Badge
                colorScheme={
                  subOrder.status === "DELIVERED"
                    ? "success"
                    : subOrder.status === "CANCELLED" ||
                      subOrder.status === "DECLINED"
                    ? "danger"
                    : "info"
                }
                variant="solid"
              >
                {subOrder.status}
              </Badge>
              <Text ml={1}>x{subOrder.quantity} -</Text>
              <Text fontWeight="bold" ml={1}>
                {moneySign}
                {subOrder.product.price * subOrder.quantity}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </TouchableOpacity>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Actionsheet.Item
            leftIcon={<MaterialIcons name="preview" size={24} color="black" />}
            onPress={() =>
              //@ts-ignore
              props.navigation.navigate("Product", {
                product: subOrder.product,
              })
            }
          >
            View Product
          </Actionsheet.Item>
          {subOrder.status === "DELIVERED" && (
            <Actionsheet.Item
              leftIcon={<AntDesign name="staro" size={24} color="black" />}
              onPress={() => {
                onClose();
                props.navigation.navigate("Add Rating", {
                  product: subOrder.product,
                });
              }}
            >
              Add Rating
            </Actionsheet.Item>
          )}
          {subOrder.status === "PREPAIRING" && (
            <Actionsheet.Item
              leftIcon={<Feather name="x" size={24} color="#e11d48" />}
              _text={{
                color: "#e11d48",
              }}
              onPress={() => setIsCancelSubOrderOpen(true)}
            >
              Cancel Order
            </Actionsheet.Item>
          )}
        </Actionsheet.Content>
      </Actionsheet>

      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isCancelSubOrderOpen}
        onClose={onCancelSubOrderClose}
      >
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Cancel Sub Order</AlertDialog.Header>
          <AlertDialog.Body>
            This action will cancel the sub order with the product
            <Badge variant="outline">
              <Text noOfLines={1} ellipsizeMode="tail">
                {subOrder.product.name}
              </Text>
            </Badge>
            This action cannot be reversed.
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={onCancelSubOrderClose}
                ref={cancelRef}
              >
                Close
              </Button>
              <Button
                colorScheme="danger"
                onPress={async () => {
                  try {
                    const query = await CancelOrderQuery(subOrder.id);

                    if (!query.message.includes("Success"))
                      return toast.show({ description: query.message });

                    toast.show({
                      description: "Sub Order cancelled successfully!",
                    });
                  } catch (error) {
                    toast.show({ description: error.message });
                  } finally {
                    onCancelSubOrderClose();
                    onClose();
                    refetch();
                  }
                }}
              >
                Cancel Sub Order
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </Fragment>
  );
}
