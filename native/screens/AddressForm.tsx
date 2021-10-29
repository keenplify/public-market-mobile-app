import React, { Fragment } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import {
  Divider,
  FlatList,
  Flex,
  HStack,
  ScrollView,
  Spinner,
  Text,
  VStack,
} from "native-base";
import { AntDesign } from "@expo/vector-icons";
import { AddressFormComponent } from "../components/AddressFormComponent";
import { PRIMARY_COLOR } from "../helpers/string";
import { useUserQuery } from "../helpers/auth";
import { Address } from "../helpers/types";

type Props = NativeStackScreenProps<RootStackParamList, "Address Form">;

interface RenderItemProps {
  item: Address;
}

export function AddressForm(props: Props) {
  const { data, isSuccess } = useUserQuery();

  return (
    <Fragment>
      <ScrollView>
        <VStack p={4}>
          <Flex
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            mb={2}
          >
            <AntDesign name="form" size={51} color={PRIMARY_COLOR} />
            <Text ml={4} width="75%">
              Before you are allowed to checkout, you need to add an address to
              be used for delivery. Please fill up the form below.
            </Text>
          </Flex>
          <Divider my={2} />
          {data && isSuccess ? (
            <AddressFormComponent {...props} address={data.user.address} />
          ) : (
            <Spinner />
          )}
        </VStack>
      </ScrollView>
    </Fragment>
  );
}
