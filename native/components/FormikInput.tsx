import { FormikProps } from "formik";
import {
  Badge,
  Box,
  FormControl,
  Icon,
  IInputProps,
  Input,
  Text,
  TextArea,
  WarningOutlineIcon,
} from "native-base";
import React, { RefAttributes } from "react";
import { capitalizeFirstLetter } from "../helpers/string";

interface Props {
  formik: FormikProps<any>;
  iconLeftElement?: JSX.Element;
  name: string;
  label?: string;
  type?: "input" | "number" | "password" | "textarea";
  _inputprops?: IInputProps & RefAttributes<unknown>;
  hideLabel?: boolean;
}

export function FormikInput({
  formik,
  iconLeftElement,
  name,
  label,
  _inputprops,
  hideLabel,
  type = "input",
}: Props) {
  const placeholder = label ? label : capitalizeFirstLetter(name);
  const handleChange = formik.handleChange(name);
  const handleBlur = formik.handleBlur(name);
  const value = formik.values[name];
  const error = formik.errors[name];

  return (
    <FormControl {...{ isInvalid: !!error }}>
      <FormControl.Label
        _text={{ fontWeight: "bold", display: hideLabel ? "none" : undefined }}
      >
        {placeholder}
      </FormControl.Label>
      {type === "input" || type === "password" ? (
        <Input
          placeholder={`Insert ${placeholder}`}
          onChangeText={handleChange}
          onBlur={handleBlur}
          value={value}
          InputLeftElement={
            iconLeftElement ? (
              <Icon as={iconLeftElement} size={5} ml={2} color="muted.500" />
            ) : undefined
          }
          type={type}
          bgColor="white"
          {..._inputprops}
        />
      ) : (
        type === "textarea" && (
          <TextArea
            placeholder={placeholder}
            onChangeText={handleChange}
            onBlur={handleBlur}
            value={value}
          />
        )
      )}

      {/* {formik.errors[name] && (
        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
          {capitalizeFirstLetter(formik.errors[name] + ".")}
        </FormControl.ErrorMessage>
      )} */}
      <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
        {error ? capitalizeFirstLetter(error?.toString()) : undefined}
      </FormControl.ErrorMessage>
    </FormControl>
  );
}
