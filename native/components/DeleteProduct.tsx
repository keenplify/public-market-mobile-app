import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AlertDialog, Button, useToast } from "native-base";
import React, { Fragment, useRef, useState } from "react";
import { useProduct } from "../helpers/ProductContext";
import { DeleteProductQuery } from "../queries/products/delete";
import { MaterialIcons } from "@expo/vector-icons";

type Props = NativeStackScreenProps<any, any>;

export function DeleteProductButton({ navigation, route }: Props) {
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
    <Fragment>
      <Button
        onPress={() => setIsDeleteOpen(true)}
        colorScheme="danger"
        leftIcon={<MaterialIcons name="delete" size={24} color="white" />}
      >
        Delete Product
      </Button>

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
  );
}
