import { Box, Flex, HStack, Image, Spinner, VStack } from "native-base";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { Product } from "../helpers/types";
import { AntDesign } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

interface Props extends NativeStackScreenProps<any> {
  product: Product;
}

export function ProductCard({ product, ...props }: Props) {
  return (
    <Flex
      rounded="lg"
      overflow="hidden"
      shadow={1}
      bgColor="white"
      p={2}
      m="1%"
      width="48%"
    >
      <TouchableOpacity
        onPress={() => props.navigation.navigate("Product", { product })}
      >
        {product.images[0] ? (
          <Image
            source={{ uri: product.images[0].thumbUrl }}
            w="100%"
            style={{ aspectRatio: 1, backgroundColor: "white" }}
            alt={`${product.name} preview`}
          />
        ) : (
          <Flex alignItems="center" p={8}>
            <AntDesign name="question" size={64} color="black" />
          </Flex>
        )}

        <Text>{product.name}</Text>
        <Text>{product.id}</Text>
      </TouchableOpacity>
    </Flex>
  );
}
