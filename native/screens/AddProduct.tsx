import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Formik } from "formik";
import {
  Box,
  Button,
  Container,
  Flex,
  Image,
  ScrollView,
  Text,
  VStack,
} from "native-base";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FormikInput } from "../components/FormikInput";
import { SellerHomeStackParamsList } from "../seller-tabs/Home";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import * as yup from "yup";
import { ProductImageUploader } from "../components/ProductImageUploader";
import Carousel from "react-native-snap-carousel";
import { Image as IImage } from "../helpers/types";
import { Dimensions } from "react-native";
import { AddProductQuery } from "../queries/products/add";
import { serveImageURI } from "../helpers/string";

const { width: screenWidth } = Dimensions.get("window");

const schema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string().required(),
  price: yup.number().required(),
});

type Props = NativeStackScreenProps<SellerHomeStackParamsList, "Add Product">;

export function AddProduct(props: Props) {
  const [images, setImages] = useState<IImage[]>([]);

  const handleUpload = (image: IImage) => {
    setImages([...images, image]);
  };

  return (
    <Formik
      initialValues={{
        name: "",
        description: "",
        price: "",
      }}
      onSubmit={async (values, status) => {
        const imageIds = images.map((image) => image.id);
        const query = await AddProductQuery({ ...values, images: imageIds });

        if (!query?.message.includes("Success"))
          return status.setStatus("Unable to create product.");

        props.navigation.pop();
        return props.navigation.navigate("Product", { product: query.product });
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
                renderItem={({ item, index }) => (
                  <Box shadow={3} bgColor="rgb(255,255,255)" key={index}>
                    <Image
                      source={serveImageURI(item.thumbUrl)}
                      alt="Preview"
                      w="100%"
                      style={{ aspectRatio: 1 }}
                    />
                  </Box>
                )}
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
                <ProductImageUploader onUpload={handleUpload} images={images} />
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
                >
                  Submit
                </Button>
              </VStack>
            </VStack>
          </Flex>
        </ScrollView>
      )}
    </Formik>
  );
}
