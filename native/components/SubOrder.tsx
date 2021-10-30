import {
  Box,
  Flex,
  Text,
  Image,
  useDisclose,
  HStack,
  FlatList,
  Divider,
  Modal,
  Button,
  useToast,
  Badge,
} from "native-base";
import React, { Fragment, useState } from "react";
import { TouchableOpacity } from "react-native";
import { serveImageURI } from "../helpers/string";
import { Order, SubOrder } from "../helpers/types";
import { Actionsheet } from "native-base";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Formik } from "formik";
import { FormikSelect } from "./FormikSelect";
import { SellerSubOrderChangeStatusQuery } from "../queries/orders/sellersuboderChangeStatus";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { ProductTabParamList } from "../screens/Product";
import useTimeAgo from "@rooks/use-time-ago";

interface Props
  extends NativeStackScreenProps<
    ProductTabParamList & RootStackParamList,
    any
  > {
  subOrder: SubOrder;
  refetch: () => void;
}

export function SubOrderComponent({ subOrder, refetch, ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclose();
  const [showChangeStatus, setShowChangeStatus] = useState(false);
  const toast = useToast();
  const timeago = useTimeAgo(subOrder.createdAt, {
    intervalMs: 0,
    locale: "en-US",
    relativeDate: new Date(),
  });
  return (
    <Fragment>
      <TouchableOpacity onPress={onOpen}>
        <Flex
          borderBottomColor="#a8a29e"
          borderBottomWidth={1}
          py={2}
          px={2}
          flexDirection="row"
        >
          <Flex mr={2} justifyContent="center">
            {subOrder.product?.images && subOrder.product.images[0] ? (
              <Flex>
                <Image
                  key={`${subOrder.product.id}-preview`}
                  source={serveImageURI(subOrder.product.images[0].id)}
                  alt="Preview"
                  style={{ aspectRatio: 1, width: 52 }}
                  borderRadius="md"
                />
              </Flex>
            ) : (
              <Box
                style={{ aspectRatio: 1, width: 52 }}
                bgColor="gray.500"
                borderRadius="md"
              />
            )}
          </Flex>
          <Flex justifyContent="center">
            <Text fontWeight="bold">{subOrder.product.name}</Text>
            <Text fontSize="xs">
              {subOrder.order.customer.address.province}
              {", "}
              {subOrder.order.customer.address.region}
            </Text>
            <Text fontSize="xs">
              x{subOrder.quantity} - {subOrder.status}
            </Text>
          </Flex>
          <Flex ml="auto" flexDirection="column-reverse">
            <Badge variant="solid">{`created ${timeago}`}</Badge>
          </Flex>
        </Flex>
      </TouchableOpacity>

      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Box w="100%" px={4}>
            <Text fontWeight="bold" textAlign="center">
              Order Details:
            </Text>
            <HStack>
              <Text minW={60} fontWeight="bold">
                Name:
              </Text>
              <Text ml={2}>{subOrder.order.customer.address.name}</Text>
            </HStack>
            <HStack>
              <Text minW={60} fontWeight="bold">
                Address:
              </Text>
              <Text
                ml={2}
                noOfLines={3}
                w={250}
              >{`${subOrder.order.customer.address.house}, ${subOrder.order.customer.address.barangay}, ${subOrder.order.customer.address.province}, ${subOrder.order.customer.address.region}`}</Text>
            </HStack>
            <HStack>
              <Text minW={60} fontWeight="bold">
                Product:
              </Text>
              <Text ml={2} noOfLines={3} w={250}>
                {subOrder.product.name}
              </Text>
            </HStack>
            <HStack>
              <Text minW={60} fontWeight="bold">
                Quantity:
              </Text>
              <Text ml={2} noOfLines={3} w={250}>
                x{subOrder.quantity}
              </Text>
            </HStack>
            <HStack>
              <Text minW={60} fontWeight="bold">
                Status:
              </Text>
              <Text ml={2} noOfLines={3} w={250}>
                {subOrder.status}
              </Text>
            </HStack>
          </Box>
          <Divider mt={2} />
          <Actionsheet.Item
            onPress={() => {
              onClose();
              setShowChangeStatus(true);
            }}
            leftIcon={
              <MaterialCommunityIcons
                name="truck-delivery-outline"
                size={28}
                color="black"
              />
            }
          >
            Change Delivery Status
          </Actionsheet.Item>
          <Actionsheet.Item
            onPress={() =>
              props.navigation.navigate("Product", {
                product: subOrder.product,
              })
            }
            leftIcon={<MaterialIcons name="preview" size={28} color="black" />}
          >
            View Product
          </Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>

      <Modal
        isOpen={showChangeStatus}
        onClose={() => setShowChangeStatus(false)}
      >
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Set Delivery Status</Modal.Header>
          <Formik
            initialValues={{ status: subOrder.status }}
            onSubmit={async ({ status }) => {
              const query = await SellerSubOrderChangeStatusQuery(
                subOrder.id,
                status
              );

              toast.show({ description: query.message });
              setShowChangeStatus(false);
              refetch();
            }}
          >
            {(formik) => (
              <Fragment>
                <Modal.Body>
                  <FormikSelect
                    name="status"
                    formik={formik}
                    options={[
                      "PREPAIRING",
                      "TO_DELIVER",
                      "DELIVERING",
                      "DELIVERED",
                      "DECLINED",
                    ].map((str) => {
                      return {
                        label: str.replace(/_/g, " "),
                        value: str,
                      };
                    })}
                  />
                </Modal.Body>
                <Modal.Footer>
                  <Button.Group space={2}>
                    <Button
                      variant="ghost"
                      colorScheme="blueGray"
                      onPress={() => {
                        setShowChangeStatus(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onPress={() => formik.submitForm()}>Save</Button>
                  </Button.Group>
                </Modal.Footer>
              </Fragment>
            )}
          </Formik>
        </Modal.Content>
      </Modal>
    </Fragment>
  );
}
