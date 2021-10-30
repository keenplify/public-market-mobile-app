import React from "react";
import { Avatar, Flex, Image, Text } from "native-base";
import { Rating as IRating } from "../helpers/types";
import {
  capitalizeFirstLetter,
  getFirstLetters,
  serveImageURI,
} from "../helpers/string";
import { Rating } from "react-native-ratings";

interface Props {
  rating: IRating;
  refetch: () => void;
}

export function RatingCard({ rating, refetch }: Props) {
  return (
    <Flex bgColor="white" p={1} m={1}>
      <Flex alignItems="flex-start" flexDirection="row">
        <Avatar
          children={capitalizeFirstLetter(
            getFirstLetters(rating.user.username)
          )}
        />
        <Flex ml={2} justifyContent="center">
          <Text fontWeight="bold">{rating.user.username}</Text>
          <Flex flexDirection="row">
            <Flex>
              <Rating
                startingValue={rating.rating}
                readonly
                imageSize={18}
                style={{ padding: 0 }}
              />
            </Flex>
            <Text ml={2}>
              <Text fontWeight="bold">{rating.rating}</Text>
              /5
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex my={1}>
        {typeof rating?.images === "object" &&
          typeof rating?.images[0] === "object" && (
            <Image
              source={serveImageURI(rating.images[0].id)}
              style={{ aspectRatio: 1, backgroundColor: "white" }}
              alt={`Rating review`}
              w={16}
              borderRadius={3}
              key={rating.id}
            />
          )}
      </Flex>
      {rating.text}
    </Flex>
  );
}
