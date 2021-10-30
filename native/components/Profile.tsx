import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  Circle,
  Flex,
  HStack,
  Icon,
  ScrollView,
  Spinner,
  Text,
  VStack,
} from "native-base";
import React, { useState } from "react";
import { useAuth, useUserQuery } from "../helpers/auth";
import { CustomerTabParamList } from "../screens/CustomerDashboard";
import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  useColorScheme,
} from "react-native";
import { UserCard } from "./UserCard";
import { PRIMARY_COLOR } from "../helpers/string";
import { SellerTabParamList } from "../screens/SellerDashboard";
import randomColor from "randomcolor";
import { RootStackParamList } from "../App";

type Props = BottomTabScreenProps<
  CustomerTabParamList & RootStackParamList,
  "Profile"
> &
  BottomTabScreenProps<SellerTabParamList, "Profile">;

export function ProfileTab(props: Props) {
  const [loggingOut, setLoggingOut] = useState(false);
  const { data } = useUserQuery();
  const { logout } = useAuth(props);
  const [color] = useState(randomColor({ luminosity: "light" }));
  return (
    <ScrollView>
      <VStack mx={2}>
        {data?.message?.includes("Success") ? (
          <Flex my={2}>
            <UserCard user={data.user} color={color} />
          </Flex>
        ) : (
          <HStack my={4} flex={1} alignItems="center" justifyContent="center">
            <Spinner size="lg" />
          </HStack>
        )}
        {data?.user?.type === "CUSTOMER" && (
          <ProductMenuButton
            onPress={() =>
              //@ts-ignore
              props.navigation.navigate("Address Form")
            }
            text="Address Manager"
            icon={<Entypo name="location" />}
            color={color}
          />
        )}

        <ProductMenuButton
          onPress={() => {
            props.navigation.navigate("Messages");
          }}
          text="Messages"
          icon={<MaterialCommunityIcons name="mail" />}
          color={color}
        />

        <ProductMenuButton
          onPress={() => {
            setLoggingOut(true);
            logout();
          }}
          disabled={loggingOut}
          text="Logout"
          icon={<MaterialCommunityIcons name="logout" />}
          color={color}
        />
      </VStack>
    </ScrollView>
  );
}

interface ProductMenuButtonProps extends TouchableOpacityProps {
  text: string;
  icon: React.ReactNode;
  color: string;
}

export function ProductMenuButton({
  icon,
  text,
  onPress,
  color,
  ...props
}: ProductMenuButtonProps) {
  return (
    <TouchableOpacity style={style.listButtons} onPress={onPress} {...props}>
      <HStack flex={1} alignItems="center" mx={2}>
        <Circle bg="black" size={12} borderRadius={32}>
          <Icon as={icon} color={color} size={22} />
        </Circle>
        <Text ml={4}>{text}</Text>
      </HStack>
    </TouchableOpacity>
  );
}

const style = StyleSheet.create({
  listButtons: {
    flex: 1,
    width: "100%",
    paddingVertical: 12,
    borderColor: "rgba(0,0,0,.5)",
    borderTopWidth: 1,
  },
});
