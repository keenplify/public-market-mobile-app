import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Formik } from "formik";
import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Image,
  Input,
  ScrollView,
  Text,
  VStack,
} from "native-base";
import React from "react";
import { useProduct } from "../helpers/ProductContext";
import { ProductTabParamList } from "../screens/Product";
import { FormikInput } from "./FormikInput";
import { ProductCard } from "./ProductCard";
import * as yup from "yup";
import { PRIMARY_COLOR, serveImageURI } from "../helpers/string";
import { AddCartItemQuery } from "../queries/cartItems/add";
import { AntDesign } from "@expo/vector-icons";

const schema = yup.object().shape({
  quantity: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(1),
});

type Props = NativeStackScreenProps<ProductTabParamList, "Add to Cart">;

export function AddToCart(props: Props) {
  const { product } = useProduct();

  return (
    <ScrollView>
      <Flex alignItems="center" flexGrow={1} m={8}>
        <Heading my={2}>
          Add <Heading color={PRIMARY_COLOR}>{product.name}</Heading> to Cart
        </Heading>
        <Formik
          initialValues={{ quantity: "1" }}
          validationSchema={schema}
          onSubmit={async (values) => {
            const { message } = await AddCartItemQuery({
              product,
              quantity: Number.parseInt(values.quantity),
            });

            if (message.includes("Success"))
              //@ts-ignore
              return props.navigation.navigate("Cart");
          }}
        >
          {(formik) => (
            <VStack w="100%" space={4}>
              <Flex flex={1} flexDirection="row">
                <Flex flex={0.5}>
                  {product.images[0] ? (
                    <Image
                      source={serveImageURI(product.images[0].id)}
                      alt="Preview"
                      w="100%"
                      style={{ aspectRatio: 1 }}
                      borderRadius="md"
                    />
                  ) : (
                    <Flex
                      w="100%"
                      style={{ aspectRatio: 1 }}
                      borderRadius="md"
                      bgColor="primary.100"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <AntDesign name="question" size={64} color="black" />
                    </Flex>
                  )}
                </Flex>
                <Flex flexGrow={1} ml={4}>
                  <FormikInput
                    name="quantity"
                    formik={formik}
                    _inputprops={{
                      InputLeftElement: (
                        <Button
                          children="-"
                          onPress={() =>
                            Number.parseInt(formik.values.quantity) > 1 &&
                            formik.setFieldValue(
                              "quantity",
                              (
                                Number.parseInt(formik.values.quantity) - 1
                              ).toString()
                            )
                          }
                        />
                      ),
                      InputRightElement: (
                        <Button
                          children="+"
                          onPress={() =>
                            formik.setFieldValue(
                              "quantity",
                              (
                                Number.parseInt(formik.values.quantity) + 1
                              ).toString()
                            )
                          }
                        />
                      ),
                      textAlign: "center",
                    }}
                  />
                </Flex>
              </Flex>
              <Flex>
                <Heading>Price:</Heading>
                <Badge colorScheme="blue">
                  <Text fontWeight="bold" fontSize="xl">
                    ₱{product.price * Number.parseInt(formik.values.quantity)}
                  </Text>
                </Badge>
              </Flex>
              <Divider my={1} />
              <Flex>
                <Button
                  colorScheme="green"
                  onPress={() => formik.submitForm()}
                  disabled={formik.isSubmitting}
                  isLoading={formik.isSubmitting}
                >
                  Add to Cart
                </Button>
              </Flex>
            </VStack>
          )}
        </Formik>
      </Flex>
    </ScrollView>
  );
}
