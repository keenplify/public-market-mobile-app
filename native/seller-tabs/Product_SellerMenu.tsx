import {
  AlertDialog,
  Flex,
  Heading,
  HStack,
  ScrollView,
  VStack,
  Text,
  Button,
  useToast,
  Switch,
} from "native-base";
import React, { Fragment, useRef, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProductTabParamList } from "../screens/Product";
import { DeleteProductQuery } from "../queries/products/delete";
import { useProduct } from "../helpers/ProductContext";

type Product_SellerMenuProps = NativeStackScreenProps<
  ProductTabParamList,
  "Seller Menu"
>;

export function Product_SellerMenu({
  navigation,
  route,
}: Product_SellerMenuProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const onDeleteClose = () => setIsDeleteOpen(false);
  const cancelDeleteRef = useRef(null);
  const toast = useToast();
  const { product } = useProduct();
  const handleDeleteProduct = async () => {
    onDeleteClose();
    try {
      const query = await DeleteProductQuery(product.id);

      if (!query?.data?.message?.includes("success")) {
        toast.show({ description: "Unable to delete the product!" });
      }

      toast.show({ description: "Product deleted successfully." });
      navigation.popToTop();
    } catch (error) {
      console.log(error);
      toast.show({
        description:
          "An error has occured while we are trying to delete the product. Please try again.",
      });
    }
  };

  return (
    <SafeAreaView>
      <Fragment>
        <ScrollView>
          <VStack p={2}>
            <Heading>Product {product.name} Options</Heading>
            <SellerListItem
              text="Edit Product"
              icon={<Feather name="edit" size={28} color="black" />}
              onPress={() => navigation.navigate("Edit")}
            />
            <SellerListItem
              text="Delete Product"
              icon={<MaterialIcons name="delete" size={28} color="black" />}
              onPress={() => setIsDeleteOpen(true)}
            />
          </VStack>
        </ScrollView>

        <AlertDialog
          leastDestructiveRef={cancelDeleteRef}
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
        >
          <AlertDialog.Content>
            <AlertDialog.CloseButton />
            <AlertDialog.Header>Delete Product</AlertDialog.Header>
            <AlertDialog.Body>
              This will delete the product, its images and its ratings. This
              action cannot be reversed. Are you sure to delete this product?
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
                onPress={handleDeleteProduct}
                children="Delete Product"
              />
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>
      </Fragment>
    </SafeAreaView>
  );
}

interface SellerListItemProps {
  text: string;
  icon: React.ReactNode;
  right?: React.ReactNode;
  onPress?: () => void;
}

function SellerListItem({ text, icon, onPress, right }: SellerListItemProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Flex borderBottomWidth={1} borderColor="coolGray.200" p={4} py={4}>
        <HStack flex={1} alignItems="center" flexGrow={1} flexDirection="row">
          <Flex mr={4}>{icon}</Flex>
          <Text>{text}</Text>
          <Flex ml="auto">{right}</Flex>
        </HStack>
      </Flex>
    </TouchableOpacity>
  );
}
