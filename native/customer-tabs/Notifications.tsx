import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { Box, ScrollView, Text } from "native-base";
import React from "react";
import { CustomerTabParamList } from "../screens/CustomerDashboard";

type Props = BottomTabScreenProps<CustomerTabParamList, "Notifications">;

export function NotificationsTab(props: Props) {
  return (
    <ScrollView>
      <Box>
        <Text>Notifications</Text>
      </Box>
    </ScrollView>
  );
}
