import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Form, Formik } from "formik";
import {
  Badge,
  Button,
  Center,
  Flex,
  FormControl,
  Heading,
  HStack,
  Icon,
  Input,
  Radio,
  ScrollView,
  Text,
  Toast,
  useToast,
  VStack,
} from "native-base";
import React, { useState } from "react";
import { RootStackParamList } from "../App";
import * as yup from "yup";
import { capitalizeFirstLetter } from "../helpers/string";
import { Feather, Ionicons } from "@expo/vector-icons";
import { RegisterQuery } from "../queries/users/register";
import { useAuth } from "../helpers/auth";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

const schema = yup.object().shape({
  email: yup.string().required().email(),
  number: yup
    .string()
    .required()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(11, "Must be exactly 11 digits")
    .max(11, "Must be exactly 11 digits"),
  password: yup.string().required().min(6).max(20),
  username: yup.string().required().min(3).max(20),
  gender: yup.string().required().oneOf(["MALE", "FEMALE"]),
  type: yup.string().required().oneOf(["CUSTOMER", "SELLER"]),
});

export function RegisterComponent(props: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const { setToken } = useAuth(props);
  const toast = useToast();

  return (
    <ScrollView
      contentContainerStyle={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Formik
        initialValues={{
          email: "",
          number: "",
          password: "",
          username: "",
          gender: "",
          type: "",
        }}
        onSubmit={async (
          { email, number, username, password, gender, type },
          actions
        ) => {
          toast.show({ description: "Registering..." });

          const result = await RegisterQuery(
            email,
            number,
            username,
            password,
            gender,
            type
          );

          if (!result.message?.includes("Success")) {
            actions.setStatus("Unable to create account.");
          } else {
            setToken(result.token);
            toast.show({ description: "Register Successful." });
            props.navigation.goBack();
          }
        }}
        validationSchema={schema}
      >
        {(formik) => (
          <VStack
            flex={1}
            flexGrow={1}
            w="100%"
            alignItems="center"
            justifyContent="center"
            my={16}
          >
            <Flex bgColor="white" w="90%" px={5} py={10} rounded={1} shadow={5}>
              <Heading textAlign="center" mb={4}>
                Create an Account
              </Heading>
              <VStack mx={3} space={4}>
                {formik.status && (
                  <Badge colorScheme="danger" px={4} _text={{ fontSize: 16 }}>
                    {capitalizeFirstLetter(formik.status)}
                  </Badge>
                )}

                <FormControl>
                  <Input
                    placeholder="Email"
                    onChangeText={formik.handleChange("email")}
                    onBlur={formik.handleBlur("email")}
                    value={formik.values.email}
                    fontSize={16}
                    InputLeftElement={
                      <Icon
                        as={<Feather name="mail" size={24} color="black" />}
                        size={5}
                        ml={2}
                        color="muted.500"
                      />
                    }
                  />
                  {formik.errors.email && (
                    <Badge colorScheme="danger">
                      {capitalizeFirstLetter(formik.errors.email + ".")}
                    </Badge>
                  )}
                </FormControl>

                <FormControl>
                  <Input
                    placeholder="Phone Number (11 digit)"
                    onChangeText={formik.handleChange("number")}
                    onBlur={formik.handleBlur("number")}
                    value={formik.values.number}
                    fontSize={16}
                    InputLeftElement={
                      <Icon
                        as={<Feather name="phone" size={24} color="black" />}
                        size={5}
                        ml={2}
                        color="muted.500"
                      />
                    }
                  />

                  {formik.errors.number && (
                    <Badge colorScheme="danger">
                      {capitalizeFirstLetter(formik.errors.number + ".")}
                    </Badge>
                  )}
                </FormControl>

                <FormControl>
                  <Input
                    placeholder="Username"
                    onChangeText={formik.handleChange("username")}
                    onBlur={formik.handleBlur("username")}
                    value={formik.values.username}
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
                  {formik.errors.username && (
                    <Badge colorScheme="danger">
                      {capitalizeFirstLetter(formik.errors.username + ".")}
                    </Badge>
                  )}
                </FormControl>

                <FormControl>
                  <Input
                    placeholder="Password"
                    onChangeText={formik.handleChange("password")}
                    onBlur={formik.handleBlur("password")}
                    value={formik.values.password}
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
                  {formik.errors.password && (
                    <Badge colorScheme="danger">
                      {capitalizeFirstLetter(formik.errors.password + ".")}
                    </Badge>
                  )}
                </FormControl>

                <FormControl>
                  <FormControl.Label
                    _text={{
                      fontSize: "lg",
                      bold: true,
                    }}
                  >
                    Select Gender
                  </FormControl.Label>
                  <Radio.Group
                    name="gender"
                    value={formik.values.gender}
                    onChange={formik.handleChange("gender")}
                    width="auto"
                    height="auto"
                    display="flex"
                    flexWrap="nowrap"
                    flexDirection="row"
                  >
                    <Radio value="MALE" m={1}>
                      Male
                    </Radio>
                    <Radio value="FEMALE" m={1}>
                      Female
                    </Radio>
                  </Radio.Group>
                  {formik.errors.gender && (
                    <Badge colorScheme="danger">
                      {capitalizeFirstLetter(formik.errors.gender + ".")}
                    </Badge>
                  )}
                </FormControl>
                <FormControl>
                  <FormControl.Label
                    _text={{
                      fontSize: "lg",
                      bold: true,
                    }}
                  >
                    Select User Type
                  </FormControl.Label>
                  <Radio.Group
                    name="type"
                    value={formik.values.type}
                    onChange={formik.handleChange("type")}
                    width="auto"
                    height="auto"
                    display="flex"
                    flexWrap="nowrap"
                    flexDirection="row"
                  >
                    <Radio value="CUSTOMER" m={1}>
                      Customer
                    </Radio>
                    <Radio value="SELLER" m={1}>
                      Seller
                    </Radio>
                  </Radio.Group>
                  {formik.errors.type && (
                    <Badge colorScheme="danger">
                      {capitalizeFirstLetter(formik.errors.type + ".")}
                    </Badge>
                  )}
                </FormControl>

                <Button
                  onPress={() => formik.handleSubmit()}
                  disabled={formik.isSubmitting || !formik.isValid}
                >
                  Submit
                </Button>
              </VStack>
            </Flex>
            <HStack mt={4}>
              <Center>
                <Text color="muted.500">Already have an account?</Text>
              </Center>
              <Center ml={4}>
                <Button
                  onPress={() => props.navigation.goBack()}
                  disabled={formik.isSubmitting}
                  colorScheme="green"
                  px={5}
                  _text={{
                    fontWeight: "bold",
                  }}
                >
                  Login
                </Button>
              </Center>
            </HStack>
          </VStack>
        )}
      </Formik>
    </ScrollView>
  );
}
