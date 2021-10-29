import React, { Fragment, useEffect, useRef, useState } from "react";
import {
  AlertDialog,
  Box,
  Button,
  CheckIcon,
  Flex,
  Heading,
  HStack,
  ScrollView,
  Spinner,
  Text,
  VStack,
  useToast,
} from "native-base";
import { useQuery } from "react-query";
import { getAllCartItemsQuery } from "../queries/cartItems/getAll";
import { CartItem } from "../components/CartItem";
import { Feather } from "@expo/vector-icons";
import { PRIMARY_COLOR } from "../helpers/string";
import { RefreshControl } from "react-native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CustomerTabParamList } from "../screens/CustomerDashboard";
import { useFocusEffect } from "@react-navigation/native";
import { useRefetchOnFocus } from "../helpers/useRefetchOnFocus";
import { CheckoutOrderQuery } from "../queries/orders/checkout";
import { Select } from "native-base";
interface Props extends BottomTabScreenProps<CustomerTabParamList, "Cart"> {}

export type ModesOfPayment = "COD" | "GCASH" | "PAYMAYA";

export function Cart(props: Props) {
  const [mop, setMop] = useState<ModesOfPayment>("COD");
  const cancelCheckOutRef = useRef(null);
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false);
  const onCheckOutClose = () => setIsCheckOutOpen(false);

  const { data, refetch, isFetching } = useQuery(
    "cart",
    async () => await getAllCartItemsQuery()
  );
  const toast = useToast();
  useRefetchOnFocus(refetch);

  let totalPrice = 0;

  data?.cartItems?.forEach((item) => {
    const itemprice = item.quantity * item.product.price;
    totalPrice += itemprice;
  });

  return (
    <Fragment>
      <VStack flex={1}>
        <Flex flexGrow={1}>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={isFetching} onRefresh={refetch} />
            }
          >
            <Flex
              p={4}
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
              bgColor={PRIMARY_COLOR}
              shadow={2}
            >
              <Feather name="shopping-cart" size={24} color="white" />
              <Heading ml={4} color="white">
                Your Cart
              </Heading>
            </Flex>
            <VStack>
              {data?.cartItems ? (
                data.cartItems.map((item, key) => (
                  <CartItem
                    item={item}
                    key={key}
                    refetchList={refetch}
                    {...props}
                  />
                ))
              ) : (
                <Spinner />
              )}
            </VStack>
          </ScrollView>
        </Flex>

        <HStack bg="primary.700" py={2} px={6} shadow={2}>
          <Flex alignItems="center" flexDirection="row" flexGrow={1}>
            <Flex mr="auto">
              <Text color="white">Method of Payment</Text>
            </Flex>
            <Flex ml="auto" flexDirection="row">
              <Select
                w="175"
                accessibilityLabel="Choose Payment Option"
                placeholder="Choose Payment Option"
                defaultValue={mop}
                onValueChange={(val: ModesOfPayment) => setMop(val)}
                _selectedItem={{
                  bg: "primary.600",
                  _text: {
                    color: "white",
                  },
                  endIcon: <CheckIcon size={5} />,
                }}
                mt="1"
                bg="white"
              >
                <Select.Item label="Cash on Delivery (COD)" value="COD" />
                <Select.Item label="GCash" value="GCASH" />
                <Select.Item label="Paymaya" value="PAYMAYA" />
              </Select>
            </Flex>
          </Flex>
        </HStack>

        <HStack bg="primary.900" py={2} px={6} shadow={2} safeAreaBottom>
          <Flex alignItems="center">
            <Text color="white" fontWeight="bold">
              Total Price
            </Text>
            <Heading color="secondary.300">₱{totalPrice}</Heading>
          </Flex>
          <Flex ml="auto" justifyContent="center" alignItems="center">
            <Button
              colorScheme="green"
              shadow={5}
              onPress={() => setIsCheckOutOpen(true)}
              _text={{
                fontWeight: "bold",
                fontSize: "lg",
              }}
            >
              Check Out
            </Button>
          </Flex>
        </HStack>
      </VStack>

      <AlertDialog
        leastDestructiveRef={cancelCheckOutRef}
        isOpen={isCheckOutOpen}
        onClose={onCheckOutClose}
      >
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Notice</AlertDialog.Header>
          <AlertDialog.Body>
            {`Are you sure to checkout your cart?`}
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button
              variant="unstyled"
              colorScheme="coolGray"
              onPress={onCheckOutClose}
              ref={cancelCheckOutRef}
              children="Cancel"
            />
            <Button
              colorScheme="green"
              onPress={async () => {
                const query = await CheckoutOrderQuery(mop);

                if (!query.message.includes("Success")) {
                  return toast.show({ description: "Unable to checkout!" });
                }

                toast.show({ description: "Successfully checked out!" });
                props.navigation.navigate("Orders");
              }}
              children="Confirm"
            />
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </Fragment>
  );
}
