import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Formik } from "formik";
import {
  Box,
  Button,
  Container,
  Flex,
  IconButton,
  Image,
  ScrollView,
  Text,
  useToast,
  VStack,
  Alert,
} from "native-base";
import React, { Fragment, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FormikInput } from "../components/FormikInput";
import { SellerHomeStackParamsList } from "../seller-tabs/Home";
import {
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import * as yup from "yup";
import { ProductImageUploader } from "../components/ProductImageUploader";
import Carousel from "react-native-snap-carousel";
import { Image as IImage, Product } from "../helpers/types";
import { Dimensions } from "react-native";
import { AddProductQuery } from "../queries/products/add";
import { serveImageURI } from "../helpers/string";
import { ProductTabParamList } from "./Product";
import { DeleteProductButton } from "../components/DeleteProduct";
import { UpdateProductQuery } from "../queries/products/update";
import { DeleteImageQuery } from "../queries/images/delete";
import { fontSize } from "styled-system";

const { width: screenWidth } = Dimensions.get("window");

const schema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string().required(),
  price: yup.number().required(),
});

type Props =
  | NativeStackScreenProps<SellerHomeStackParamsList, "Add Product">
  | NativeStackScreenProps<ProductTabParamList, "Edit">;

export function AddProduct(props: Props) {
  const toast = useToast();
  const ___product = props?.route?.params?.product;
  const [images, setImages] = useState<IImage[]>(
    props.route.name === "Edit" ? ___product.images : []
  );
  const [deletedImages, setDeletedImages] = useState<IImage[]>([]);
  const handleUpload = (image: IImage) => {
    setImages([...images, image]);
  };

  const handleImageDelete = async (item: IImage) => {
    try {
      const res = await DeleteImageQuery(item.id);

      if (!(res.status === 200))
        return toast.show({ description: "Unable to delete image." });

      setDeletedImages([...deletedImages, item]);
      return toast.show({ description: "Image deleted successfully." });
    } catch (error) {
      return toast.show({
        description:
          "An error occured while deleting the image. Please try again.",
      });
    }
  };

  return (
    <Fragment>
      <Formik
        initialValues={{
          name: ___product ? ___product.name : "",
          description: ___product ? ___product.description : "",
          price: ___product ? ___product.price.toString() : "",
        }}
        onSubmit={async (values, status) => {
          const imageIds = images.map((image) => image.id);

          if (props.route.name === "Edit") {
            const imageIds2 = images
              .map((image) => {
                if (!(deletedImages.indexOf(image) >= 0)) {
                  return image.id;
                }
              })
              .filter((e) => e != undefined);

            try {
              console.log(imageIds2);
              const query = await UpdateProductQuery({
                ...values,
                images: imageIds2,
                productId: ___product.id,
              });

              if (!query?.message.includes("Success"))
                return status.setStatus("Unable to update product.");

              return props.navigation.goBack();
            } catch (error) {
              return toast.show({
                description:
                  "An error occured while updating the product. Please try again.",
              });
            }
          } else {
            const query = await AddProductQuery({
              ...values,
              images: imageIds,
            });

            if (!query?.message.includes("Success"))
              return status.setStatus("Unable to create product.");

            props.navigation.pop();
            //@ts-ignore
            return props.navigation.navigate("Product", {
              product: query.product,
            });
          }
        }}
        validationSchema={schema}
      >
        {(formik) => (
          <ScrollView>
            <Flex>
              {images.length > 0 && (
                <Carousel
                  data={images}
                  sliderWidth={screenWidth}
                  sliderHeight={screenWidth}
                  itemWidth={screenWidth - 60}
                  renderItem={({ item, index }) => {
                    const isDeleted = !!deletedImages.find(
                      (value) => value.id === item.id
                    );

                    return (
                      <Box shadow={3} bgColor="rgb(255,255,255)" key={index}>
                        <Image
                          source={serveImageURI(item.thumbUrl)}
                          alt="Preview"
                          w="100%"
                          style={{
                            aspectRatio: 1,
                            opacity: isDeleted ? 0.25 : undefined,
                          }}
                        />
                        <Box position="absolute" bottom={2} right={2}>
                          {isDeleted ? (
                            <Alert
                              status="info"
                              colorScheme="info"
                              borderRadius={4}
                              p={2}
                              shadow={5}
                              _text={{
                                fontWeight: "bold",
                                fontSize: "lg",
                              }}
                            >
                              This image is already deleted.
                            </Alert>
                          ) : (
                            <IconButton
                              icon={
                                <MaterialCommunityIcons
                                  name="trash-can"
                                  size={32}
                                  color="white"
                                />
                              }
                              p={2}
                              bgColor="#e11d48"
                              shadow={2}
                              onPress={async () =>
                                await handleImageDelete(item)
                              }
                            />
                          )}
                        </Box>
                      </Box>
                    );
                  }}
                />
              )}
            </Flex>
            <Flex>
              <VStack
                flexGrow={1}
                justifyContent="center"
                alignItems="center"
                space={4}
                mt={4}
              >
                <VStack
                  width="90%"
                  backgroundColor="white"
                  padding={8}
                  shadow={2}
                  space={2}
                >
                  <ProductImageUploader
                    onUpload={handleUpload}
                    images={images}
                  />
                  <FormikInput
                    formik={formik}
                    iconLeftElement={
                      <MaterialCommunityIcons
                        name="shopping-outline"
                        size={24}
                        color="black"
                      />
                    }
                    name="name"
                    label="Product Name"
                  />

                  <FormikInput
                    formik={formik}
                    iconLeftElement={
                      <MaterialCommunityIcons
                        name="shopping-outline"
                        size={24}
                        color="black"
                      />
                    }
                    name="description"
                    label="Product Description"
                    type="textarea"
                  />

                  <FormikInput
                    formik={formik}
                    iconLeftElement={
                      <Ionicons
                        name="pricetags-outline"
                        size={24}
                        color="black"
                      />
                    }
                    name="price"
                    label="Product Price (in Philippine Peso)"
                  />

                  <Button
                    onPress={() => formik.submitForm()}
                    disabled={formik.isSubmitting}
                    isLoading={formik.isSubmitting}
                    colorScheme="green"
                    leftIcon={
                      <MaterialIcons
                        name="file-upload"
                        size={24}
                        color="white"
                      />
                    }
                  >
                    Submit
                  </Button>
                  {props.route.name === "Edit" && (
                    <DeleteProductButton {...props} />
                  )}
                </VStack>
              </VStack>
            </Flex>
          </ScrollView>
        )}
      </Formik>
    </Fragment>
  );
}
