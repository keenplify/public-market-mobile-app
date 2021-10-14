import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Flex,
  Box,
  Text,
  ScrollView,
  Image,
  Heading,
  Badge,
} from "native-base";
import React from "react";
import { CustomerHomeStackParamsList } from "../customer-tabs/Home";
import Carousel, { ParallaxImage } from "react-native-snap-carousel";

import { AntDesign } from "@expo/vector-icons";
import { Dimensions, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { serveImageURI } from "../helpers/string";
import { useQuery } from "react-query";
import { GetProductQuery } from "../queries/products/get";

type Props = NativeStackScreenProps<CustomerHomeStackParamsList, "Product">;

const { width: screenWidth } = Dimensions.get("window");

export function ProductViewer(props: Props) {
  const __product = props.route.params.product;
  const { data, isFetching, refetch } = useQuery(
    ["product", __product.id],
    async () => await GetProductQuery(__product.id)
  );
  const product = data?.data?.product || __product;

  return (
    <SafeAreaView>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
      >
        <Flex alignItems="center" mt={2}>
          {product.images?.length > 0 && product?.images[0] ? (
            <Carousel
              data={product.images}
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
          ) : (
            <Flex alignItems="center" p={8}>
              <AntDesign name="question" size={64} color="black" />
            </Flex>
          )}
        </Flex>
        <Flex mx={4} mt={4}>
          <Flex flexDirection="row" alignItems="center">
            <Heading>{product.name}</Heading>
            <Badge colorScheme="info" ml={2}>
              <Text fontWeight="bold" fontSize="xl">
                ₱{product.price}
              </Text>
            </Badge>
          </Flex>
          <Flex>
            <Text>{product.description}</Text>
          </Flex>
        </Flex>
      </ScrollView>
    </SafeAreaView>
  );
}
