import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Flex,
  Box,
  Text,
  ScrollView,
  Heading,
  Badge,
  HStack,
  VStack,
  Input,
  Image,
  Spinner,
} from "native-base";
import React, { Fragment, useState } from "react";
import { CustomerHomeStackParamsList } from "../customer-tabs/Home";
import Carousel from "react-native-snap-carousel";

import { Dimensions, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PRIMARY_COLOR, serveImageURI } from "../helpers/string";
import { useQuery } from "react-query";
import { GetProductQuery } from "../queries/products/get";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  MaterialCommunityIcons,
  AntDesign,
  Feather,
  Ionicons,
} from "@expo/vector-icons";
import { ProductProvider, useProduct } from "../helpers/ProductContext";
import { UserCard } from "../components/UserCard";
import useTimeAgo from "@rooks/use-time-ago";
import { Rating } from "react-native-ratings";
import { useUserQuery } from "../helpers/auth";
import { Product_SellerMenu } from "../seller-tabs/Product_SellerMenu";
import { AddProduct } from "./AddProduct";
import { Image as IImage, Product } from "../helpers/types";
import { AddToCart } from "../components/AddToCartProduct";
import { ProductRatings } from "./ProductRatings";

const Tab = createBottomTabNavigator<ProductTabParamList>();

type Props = NativeStackScreenProps<CustomerHomeStackParamsList, "Product">;
export type MainProductTabProps = Props &
  NativeStackScreenProps<ProductTabParamList, "Main">;

const { width: screenWidth } = Dimensions.get("window");

export function ProductViewer(props: Props) {
  const { data } = useUserQuery();
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <ProductProvider
      value={{ product: props.route.params.product, isEditMode, setIsEditMode }}
    >
      <Tab.Navigator>
        <Tab.Screen
          name="Main"
          component={__ProductViewer}
          options={{
            title: "Product",
            headerShown: false,
            tabBarIcon: (props) => (
              <MaterialCommunityIcons
                name="shopping"
                size={24}
                color="black"
                {...props}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Ratings"
          component={ProductRatings}
          options={{
            headerShown: false,
            tabBarIcon: (props) => (
              <AntDesign name="star" size={24} color="black" {...props} />
            ),
          }}
        />
        {data?.user &&
        data.user.id === props.route.params?.product?.sellerId ? (
          <Tab.Screen
            name="Edit"
            component={AddProduct}
            options={{
              headerTitle: `Edit Product`,
              tabBarIcon: (props) => (
                <Feather name="edit" size={28} color="black" {...props} />
              ),
            }}
            initialParams={{ product: props.route.params.product }}
          />
        ) : (
          <Tab.Screen
            name="Add to Cart"
            component={AddToCart}
            options={{
              headerShown: false,
              tabBarIcon: (props) => (
                <MaterialCommunityIcons name="cart" size={24} {...props} />
              ),
              tabBarButton: !!data?.user?.address ? undefined : () => null,
            }}
          />
        )}
      </Tab.Navigator>
    </ProductProvider>
  );
}

export function __ProductViewer(props: MainProductTabProps) {
  const { product: __product, isEditMode } = useProduct();
  const { data, isFetching, refetch } = useQuery(
    ["product", __product.id],
    async () => await GetProductQuery(__product.id)
  );
  const product = data?.data?.product || __product;
  const timeAgo = useTimeAgo(product.createdAt, {
    intervalMs: 0,
    locale: "en-US",
    relativeDate: new Date(),
  });

  const sum = product?.ratings?.reduce((a, b) => a + b.rating, 0) || 0;
  const avg = sum / product?.ratings?.length || 0;

  return (
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
            renderItem={({ item }) => (
              <Box shadow={3} bgColor="rgb(255,255,255)" key={item.thumbUrl}>
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
            <Badge
              colorScheme="danger"
              children="No Product Image Found."
              _text={{
                fontWeight: "bold",
                fontSize: "lg",
              }}
              mr={2}
            />
          </Flex>
        )}
      </Flex>
      <Flex p={3} m={2} borderRadius="md" shadow={3} backgroundColor="white">
        <Flex flexDirection="row" alignItems="center" maxW="100%">
          <Heading ellipsizeMode="tail" flex={1} flexGrow={1}>
            {product.name}
          </Heading>
          <Badge colorScheme="green">
            <Text fontWeight="bold" fontSize="xl">
              ₱{product.price}
            </Text>
          </Badge>
        </Flex>
        <Flex>
          <HStack space={2} my={1} flex={1} alignItems="center">
            <Text color="#52525b">Ratings:</Text>
            <Rating
              ratingCount={5}
              imageSize={16}
              ratingColor={PRIMARY_COLOR}
              startingValue={avg}
              readonly
            />
            <Badge
              colorScheme="fuchsia"
              children={`Created ${timeAgo}`}
              variant="outline"
            />
          </HStack>
        </Flex>
        <Flex>
          <Text>{product.description}</Text>
        </Flex>
      </Flex>
      <Flex p={3} m={2} borderRadius="md" shadow={3} backgroundColor="white">
        <VStack>
          <Heading fontSize="lg">Seller Information</Heading>
          {product.seller ? (
            <UserCard user={product.seller} {...props} />
          ) : (
            <Flex alignItems="center" justifyContent="center" p={2}>
              <Spinner />
            </Flex>
          )}
        </VStack>
      </Flex>
    </ScrollView>
  );
}

export type ProductTabParamList = {
  Main: undefined;
  Ratings: undefined;
  "Add to Cart"?: undefined;
  "Seller Menu"?: undefined;
  Edit: {
    product: Product;
  };
};
