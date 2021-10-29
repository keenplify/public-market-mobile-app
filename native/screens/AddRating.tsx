import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Formik } from "formik";
import {
  Box,
  Button,
  Divider,
  Flex,
  ScrollView,
  Spinner,
  Text,
  Image,
  VStack,
  useToast,
} from "native-base";
import React, { Fragment, useState } from "react";
import { Rating } from "react-native-ratings";
import { useQuery } from "react-query";
import { FormikInput } from "../components/FormikInput";
import { ProductImageUploader } from "../components/ProductImageUploader";
import { serveImageURI } from "../helpers/string";
import { GetProductQuery } from "../queries/products/get";
import { Image as IImage, Product } from "../helpers/types";
import { CustomerTabParamList } from "./CustomerDashboard";
import { UpdateRatingQuery } from "../queries/ratings/update";
import { AddRatingsQuery } from "../queries/ratings/add";
import * as yup from "yup";

type Props = NativeStackScreenProps<
  CustomerTabParamList,
  "Add Rating" | "Edit Rating"
>;

const schema = yup.object().shape({
  text: yup.string().required(),
  rating: yup.number().required(),
});

export function AddRating({ navigation, route }: Props) {
  const [images, setImages] = useState<IImage[]>([]);
  const { data, isSuccess } = useQuery(
    ["product", route.params.product.id],
    async () => await GetProductQuery(route.params.product.id)
  );
  const toast = useToast();
  const [deletedImages, setDeletedImages] = useState<IImage[]>([]);

  const handleUpload = (image: IImage) => {
    console.log(image);
    setImages([...images, image]);
  };

  return (
    <ScrollView>
      <VStack bgColor="white" m={2} shadow={2}>
        {data && isSuccess ? (
          <Fragment>
            <Flex flexDirection="row" p={2}>
              <Flex>
                {route.params.product?.images &&
                route.params.product?.images[0] ? (
                  <Image
                    source={serveImageURI(data.data.product.images[0].url)}
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
              <Flex ml={2} alignItems="center" justifyContent="center">
                <Text fontWeight="bold">{data.data.product.name}</Text>
                <Text color="darkText" noOfLines={1} ellipsizeMode="tail">
                  {data.data.product.description}
                </Text>
              </Flex>
            </Flex>
            <Divider />
          </Fragment>
        ) : (
          <Spinner mt={2} />
        )}
        <Formik
          initialValues={{
            rating: 2.5,
            text: "",
          }}
          validationSchema={schema}
          onSubmit={async (values, status) => {
            const imageIds = images.map((image) => image.id);

            if (route?.name === "Edit Rating") {
              const imageIds2 = images
                .map((image) => {
                  if (!(deletedImages.indexOf(image) >= 0)) {
                    return image.id;
                  }
                })
                .filter((e) => e != undefined);

              try {
                const query = await UpdateRatingQuery({
                  ...values,
                  images: imageIds2,
                  ratingId: route.params.rating.id,
                });

                if (!query?.message.includes("Success"))
                  return status.setStatus("Unable to update rating.");

                return navigation.goBack();
              } catch (error) {
                return toast.show({
                  description:
                    "An error occured while updating the rating. Please try again.",
                });
              }
            } else {
              const query = await AddRatingsQuery({
                ...values,
                images: imageIds,
                productId: data.data.product.id,
              });

              if (!query?.message.includes("Success"))
                return status.setStatus("Unable to create rating.");

              //@ts-ignore
              return navigation.navigate("Home", {
                screen: "Product",
                params: { product: data.data.product, screen: "Ratings" },
              });
            }
          }}
        >
          {(formik) => (
            <Flex p={2}>
              <Flex my={2}>
                <Rating
                  fractions={1}
                  showRating
                  onFinishRating={(rate: number) =>
                    formik.setFieldValue("rating", rate)
                  }
                  startingValue={
                    route?.params?.rating
                      ? route?.params.rating.rating
                      : formik.values.rating
                  }
                />
              </Flex>
              <Flex>
                <ProductImageUploader onUpload={handleUpload} images={images} />
              </Flex>
              <Flex mt={2} p={2} w="100%">
                {images.map((image, key) => (
                  <Image
                    key={key}
                    source={serveImageURI(image.url)}
                    w={16}
                    style={{
                      aspectRatio: 1,
                      opacity: !!deletedImages.find(
                        (value) => value.id === image.id
                      )
                        ? 0.25
                        : undefined,
                    }}
                    alt="Rating"
                  />
                ))}
              </Flex>
              <Flex>
                <FormikInput
                  type="textarea"
                  name="text"
                  formik={formik}
                  label="Add Description"
                />
              </Flex>
              <Divider my={2} />
              <Flex>
                <Button
                  onPress={formik.submitForm}
                  disabled={formik.isSubmitting || !data}
                  isLoading={formik.isSubmitting || !data}
                  colorScheme="green"
                >
                  Submit
                </Button>
              </Flex>
            </Flex>
          )}
        </Formik>
      </VStack>
    </ScrollView>
  );
}
