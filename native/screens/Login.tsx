import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  HStack,
  Icon,
  Input,
  Text,
  useToast,
  VStack,
} from "native-base";
import { RootStackParamList } from "../App";
import { Formik } from "formik";
import { Ionicons } from "@expo/vector-icons";
import * as yup from "yup";
import { capitalizeFirstLetter } from "../helpers/string";
import { Badge, Heading } from "native-base";
import { LoginQuery } from "../queries/users/login";
import { useAuth } from "../helpers/auth";
import { Feather } from "@expo/vector-icons";

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
    <Flex flexGrow={1} alignItems="center" justifyContent="center">
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={async ({ email, password }, actions) => {
          toast.show({ description: "Logging in..." });
          const result = await LoginQuery(email, password);

          if (typeof result.token === "undefined")
            actions.setStatus(result.message);
          else {
            setToken(result.token);
            toast.show({ description: "Login Successful." });
            return props.navigation.replace("Splash");
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
          setFieldValue,
        }) => (
          <VStack
            flexGrow={1}
            alignItems="center"
            justifyContent="center"
            w="100%"
          >
            <Flex bgColor="white" w="90%" p={5} rounded={1} shadow={5}>
              <Heading textAlign="center" mb={4}>
                Login
              </Heading>

              <VStack mx={3} space={4}>
                {status && (
                  <Badge colorScheme="danger" px={4} _text={{ fontSize: 16 }}>
                    {capitalizeFirstLetter(status)}
                  </Badge>
                )}
                <FormControl>
                  <Input
                    placeholder="Email"
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                    fontSize={16}
                    InputLeftElement={
                      <Icon
                        as={<Feather name="user" size={24} color="black" />}
                        size={5}
                        ml={2}
                        color="muted.500"
                      />
                    }
                  />
                  {errors.email && (
                    <Badge colorScheme="danger">
                      {capitalizeFirstLetter(errors.email + ".")}
                    </Badge>
                  )}
                </FormControl>

                <FormControl>
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
                    InputLeftElement={
                      <Icon
                        as={<Feather name="lock" size={24} color="black" />}
                        size={5}
                        ml={2}
                        color="muted.500"
                      />
                    }
                  />

                  {errors.password && (
                    <Badge colorScheme="danger">
                      {capitalizeFirstLetter(errors.password + ".")}
                    </Badge>
                  )}
                </FormControl>
                <Button
                  onPress={() => handleSubmit()}
                  disabled={isSubmitting || !isValid}
                >
                  Submit
                </Button>
              </VStack>
            </Flex>
            <HStack mt={4}>
              <Center>
                <Text>Dont have an account?</Text>
              </Center>
              <Center ml={4}>
                <Button
                  onPress={() => props.navigation.navigate("Register")}
                  disabled={isSubmitting}
                  colorScheme="green"
                  px={5}
                  _text={{
                    fontWeight: "bold",
                  }}
                >
                  Register
                </Button>
              </Center>
            </HStack>
          </VStack>
        )}
      </Formik>
    </Flex>
  );
}
