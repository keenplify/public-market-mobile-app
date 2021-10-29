import React from "react";
import {
  CheckIcon,
  FormControl,
  ISelectItemProps,
  Select,
  WarningOutlineIcon,
} from "native-base";
import { FormikProps } from "formik";
import { capitalizeFirstLetter } from "../helpers/string";

interface Props {
  formik: FormikProps<any>;
  name: string;
  label?: string;
  options: ISelectItemProps[];
}

export function FormikSelect({ formik, name, label, options }: Props) {
  const placeholder = label ? label : capitalizeFirstLetter(name);
  const handleChange = (itemValue: string) =>
    formik.setFieldValue(name, itemValue);
  const value = formik.values[name];
  const error = formik.errors[name];

  return (
    <FormControl {...{ isInvalid: !!error }}>
      <FormControl.Label _text={{ fontWeight: "bold" }}>
        {placeholder}
      </FormControl.Label>
      <Select
        selectedValue={value}
        minW="200"
        placeholder={`Select ${placeholder}`}
        _selectedItem={{
          bg: "teal.600",
          _text: {
            color: "white",
          },
          endIcon: <CheckIcon size="5" />,
        }}
        mt={1}
        onValueChange={handleChange}
        bg="white"
      >
        {options.map((opt, i) => (
          <Select.Item {...opt} key={i} />
        ))}
      </Select>

      <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
        {error ? capitalizeFirstLetter(error?.toString()) : undefined}
      </FormControl.ErrorMessage>
    </FormControl>
  );
}
