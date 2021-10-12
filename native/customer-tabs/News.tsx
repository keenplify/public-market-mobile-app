import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { Box, ScrollView, Text } from "native-base";
import React from "react";
import { CustomerTabParamList } from "../screens/CustomerDashboard";

type Props = BottomTabScreenProps<CustomerTabParamList, "News">;

export function NewsTab(props: Props) {
  return (
    <ScrollView>
      <Box>
        <Text>News</Text>
      </Box>
    </ScrollView>
  );
}
