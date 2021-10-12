import { Button, Flex, Icon, IconButton, Input, Text } from "native-base";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";

export function CustomerHeader(props: NativeStackHeaderProps) {
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
            InputLeftElement={
              <Icon
                ml="2"
                size="5"
                as={<FontAwesome name="search" size={24} />}
              />
            }
          />
        </Flex>

        <IconButton
          onPress={() => console.log("cart")}
          borderRadius={32}
          icon={<AntDesign name="shoppingcart" size={24} color="black" />}
        />
        <IconButton
          onPress={() => console.log("messages")}
          borderRadius={32}
          icon={<Feather name="message-square" size={24} color="black" />}
        />
      </Flex>
    </SafeAreaView>
  );
}
