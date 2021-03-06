import { Flex, Text, Image, VStack, Heading, HStack } from "native-base";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Image as IImage, Product } from "../helpers/types";
import { AntDesign } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  capitalizeFirstLetter,
  isValidHttpUrl,
  moneySign,
  PRIMARY_COLOR,
  serveImageURI,
  SERVER_API,
} from "../helpers/string";
import { Rating } from "react-native-ratings";

interface Props extends NativeStackScreenProps<any> {
  product: Partial<Product>;
  disabled?: boolean;
  ratings?: number;
}

export function ProductCard({
  product,
  disabled = false,
  ratings,
  ...props
}: Props) {
  const sum = product.ratings.reduce((a, b) => a + b.rating, 0);
  const avg = sum / product.ratings.length || 0;

  return (
    <Flex
      rounded="lg"
      overflow="hidden"
      shadow={1}
      bgColor="white"
      p={3}
      m="1%"
      width="48%"
    >
      <TouchableOpacity
        onPress={() => props.navigation.navigate("Product", { product })}
        style={{
          flex: 1,
        }}
        disabled={disabled}
        onLongPress={() => console.log("Long Press")}
      >
        <VStack>
          <Flex
            alignItems="center"
            justifyContent="center"
            style={{ aspectRatio: 1 }}
            borderRadius={3}
            bgColor={PRIMARY_COLOR + "11"}
          >
            {typeof product?.images === "object" &&
            typeof product?.images[0] === "object" ? (
              <Image
                source={serveImageURI(product.images[0].id)}
                style={{ aspectRatio: 1, backgroundColor: "white" }}
                alt={`${product.name} preview`}
                w="100%"
                borderRadius={3}
                key={product.id}
              />
            ) : (
              <Flex>
                <AntDesign name="question" size={64} color="black" />
              </Flex>
            )}
          </Flex>
          <Heading fontSize="md" numberOfLines={1} ellipsizeMode="tail">
            {capitalizeFirstLetter(product.name)}
          </Heading>
          <Text color={PRIMARY_COLOR} bold>
            {moneySign}
            <Text color={PRIMARY_COLOR} bold fontSize="xl">
              {product.price}
            </Text>
          </Text>

          <Flex alignSelf="flex-end">
            <Rating
              ratingCount={5}
              imageSize={16}
              ratingColor={PRIMARY_COLOR}
              fractions={1}
              startingValue={avg}
              readonly
            />
          </Flex>
        </VStack>
      </TouchableOpacity>
    </Flex>
  );
}
