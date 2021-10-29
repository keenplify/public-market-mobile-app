import { Button, Flex, Icon, IconButton, Input, Text } from "native-base";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { PRIMARY_COLOR } from "../helpers/string";
import { SearchContext, useSearchContext } from "../helpers/SearchContext";

interface Props extends NativeStackHeaderProps {
  keyword: string;
  setKeyword: (keyword: string) => void;
}

export function CustomerHeader({ keyword, ...props }: Props) {
  // const [keyword, setKeyword] = useSearchContext;

  return (
    <SafeAreaView>
      <Flex
        flexDirection="row"
        py={2}
        width="100%"
        alignItems="center"
        justifyContent="center"
        px={2}
      >
        <Flex flexGrow={1} mx={2}>
          <Input
            placeholder="Search Public Market"
            variant="filled"
            bg="gray.100"
            borderRadius={10}
            py={1}
            px={2}
            placeholderTextColor="gray.800"
            _hover={{ bg: "gray.200", borderWidth: 0 }}
            borderWidth={0}
            onChangeText={(_keyword) => props.setKeyword(_keyword)}
            InputLeftElement={
              <Icon
                ml="2"
                size="5"
                as={<FontAwesome name="search" size={24} />}
              />
            }
            onBlur={() => props.navigation.navigate("Search")}
            onEndEditing={(e) => {
              props.navigation.navigate("Search");
            }}
          />
        </Flex>

        <IconButton
          onPress={() => props.navigation.navigate("Cart")}
          borderRadius={32}
          icon={<AntDesign name="shoppingcart" size={24} color="black" />}
        />
        <IconButton
          onPress={() => props.navigation.navigate("Messages")}
          borderRadius={32}
          icon={<Feather name="message-square" size={24} color="black" />}
        />
      </Flex>
    </SafeAreaView>
  );
}
