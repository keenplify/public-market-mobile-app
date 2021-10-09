import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Box, Button, Input, Spacer, Text, useToast } from "native-base";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";
import { RootStackParamList } from "../App";
import { Formik } from "formik";
import { Ionicons } from "@expo/vector-icons";
import * as yup from "yup";
import { capitalizeFirstLetter } from "../helpers/string";
import { Badge } from "native-base";
import { LoginQuery } from "../queries/users/login";
import { useAuth } from "../helpers/auth";
type Props = NativeStackScreenProps<RootStackParamList, "Login">;

const schema = yup.object().shape({
  email: yup.string().required().email(),
  password: yup.string().required(),
});

export function LoginComponent(props: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const { setToken } = useAuth(props);
  const toast = useToast();

  return (
    <SafeAreaInsetsContext.Consumer>
      {(insets) => (
        <Box
          pt={insets.top}
          flex={1}
          alignItems="center"
          justifyContent="center"
        >
          <Text mb={3} fontSize={32} fontWeight="bold">
            Login
          </Text>
          <Formik
            initialValues={{ email: "", password: "" }}
            onSubmit={async ({ email, password }, actions) => {
              toast.show({ description: "Logging in..." });
              const result = await LoginQuery(email, password);

              if (!result.message?.includes("Success"))
                actions.setStatus(result.message);
              else {
                setToken(result.token);
                toast.show({ description: "Login Successful." });
                props.navigation.goBack();
              }
            }}
            validationSchema={schema}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              isSubmitting,
              isValid,
              errors,
              status,
            }) => (
              <Box w="80%">
                {status && (
                  <Badge colorScheme="danger" px={4} _text={{ fontSize: 16 }}>
                    {capitalizeFirstLetter(status)}
                  </Badge>
                )}
                <Input
                  placeholder="Email"
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  fontSize={16}
                />
                {errors.email && (
                  <Badge colorScheme="danger">
                    {capitalizeFirstLetter(errors.email + ".")}
                  </Badge>
                )}
                <Spacer mb={4} />
                <Input
                  placeholder="Password"
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  type={showPassword ? "text" : "password"}
                  fontSize={16}
                  InputRightElement={
                    <Button
                      roundedLeft={0}
                      onPress={() => setShowPassword(!showPassword)}
                      bg="rgba(255,255,255,0)"
                      _pressed={{
                        bg: "rgba(255,255,255,0)",
                      }}
                    >
                      {showPassword ? (
                        <Ionicons name="eye-off" size={24} color="black" />
                      ) : (
                        <Ionicons name="eye" size={24} color="black" />
                      )}
                    </Button>
                  }
                />

                {errors.password && (
                  <Badge colorScheme="danger">
                    {capitalizeFirstLetter(errors.password + ".")}
                  </Badge>
                )}
                <Spacer mb={4} />
                <Button
                  onPress={() => handleSubmit()}
                  disabled={isSubmitting || !isValid}
                >
                  Login
                </Button>
              </Box>
            )}
          </Formik>
        </Box>
      )}
    </SafeAreaInsetsContext.Consumer>
  );
}
