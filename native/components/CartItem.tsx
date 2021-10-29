import {
  AlertDialog,
  Box,
  Button,
  Flex,
  Image,
  Text,
  useDisclose,
  useToast,
} from "native-base";
import React, { Fragment, useRef, useState } from "react";
import { TouchableOpacity } from "react-native";
import { useQuery } from "react-query";
import { capitalizeFirstLetter, serveImageURI } from "../helpers/string";
import { CartItem as ICartItem } from "../helpers/types";
import { GetProductQuery } from "../queries/products/get";
import { Actionsheet } from "native-base";
import { AntDesign } from "@expo/vector-icons";
import { DeleteCartItemQuery } from "../queries/cartItems/delete";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CustomerTabParamList } from "../screens/CustomerDashboard";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

interface Props extends BottomTabScreenProps<any, any> {
  item: ICartItem;
  refetchList: any;
}

export function CartItem({ item, refetchList, ...props }: Props) {
  const { isOpen, onToggle, onClose } = useDisclose();
  const cancelDeleteRef = useRef(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const onDeleteClose = () => setIsDeleteOpen(false);
  const toast = useToast();

  const { data: productData, refetch } = useQuery(
    ["product", item.productId],
    async () => await GetProductQuery(item.productId)
  );

  const handleDeleteCartItem = async () => {
    const query = await DeleteCartItemQuery(item.id);

    if (query?.data?.message?.includes("success")) {
      toast.show({ description: "Cart item deleted successfully." });
      refetchList();
    } else {
      toast.show({ description: "Unable to delete cart item." });
    }

    setIsDeleteOpen(false);
  };

  if (!productData)
    return (
      <Flex
        flex={1}
        flexDirection="row"
        mx={2}
        borderBottomWidth={1}
        p={2}
        borderBottomColor="gray.500"
      >
        <Flex
          w="100%"
          flex={0.2}
          style={{ aspectRatio: 1 }}
          bgColor="gray.300"
          borderRadius="md"
        />
        <Flex
          ml={2}
          flexGrow={1}
          flexDirection="column"
          justifyContent="center"
        >
          <Box w="70%" bgColor="gray.300" h={6} borderRadius="md" my={1} />
          <Box w="40%" bgColor="gray.300" h={4} borderRadius="md" my={1} />
        </Flex>
      </Flex>
    );

  return (
    <Fragment>
      <TouchableOpacity onPress={onToggle}>
        <Flex
          flex={1}
          flexDirection="row"
          mx={2}
          borderBottomWidth={1}
          p={2}
          borderBottomColor="gray.400"
        >
          {productData?.data?.product?.images &&
          productData.data.product.images[0] ? (
            <Flex>
              <Image
                source={serveImageURI(productData.data.product.images[0].url)}
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
          <Flex flexDirection="column" ml={2} maxW="80%">
            <Text
              fontSize={18}
              fontWeight="bold"
              lineBreakMode="tail"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {capitalizeFirstLetter(productData.data.product.name)}
            </Text>
            <Text fontSize={14} color="gray.800">
              x{item.quantity} -{" "}
              <Text fontSize={14} fontWeight="bold">
                ₱{item.quantity * productData.data.product.price}
              </Text>
            </Text>
          </Flex>
        </Flex>
      </TouchableOpacity>

      <Actionsheet isOpen={isOpen} onClose={onClose} hideDragIndicator>
        <Actionsheet.Content borderTopRadius="0">
          <Box w="100%" h={60} px={4} justifyContent="center">
            <Text
              fontSize="16"
              color="gray.500"
              _dark={{
                color: "gray.300",
              }}
            >
              Options for{" "}
              {productData?.data?.product?.name &&
                capitalizeFirstLetter(productData?.data?.product?.name)}
            </Text>
          </Box>
          <Actionsheet.Item
            leftIcon={<AntDesign name="eyeo" size={24} color="black" />}
            onPress={() =>
              props.navigation.navigate("Product", {
                product: productData.data.product,
              })
            }
          >
            View Product
          </Actionsheet.Item>
          <Actionsheet.Item
            leftIcon={<AntDesign name="delete" size={24} color="black" />}
            onPress={() => {
              onClose();
              setIsDeleteOpen(true);
            }}
          >
            Delete
          </Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>

      <AlertDialog
        leastDestructiveRef={cancelDeleteRef}
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
      >
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Delete Cart Item</AlertDialog.Header>
          <AlertDialog.Body>
            {`This will remove ${productData.data?.product?.name} from your cart. Are you sure to delete this cart item?`}
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button
              variant="unstyled"
              colorScheme="coolGray"
              onPress={onDeleteClose}
              ref={cancelDeleteRef}
              children="Cancel"
            />
            <Button
              colorScheme="danger"
              onPress={handleDeleteCartItem}
              children="Confirm Delete"
            />
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </Fragment>
  );
}
