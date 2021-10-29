import { Formik, FormikProps } from "formik";
import { Button, Divider, Toast, useToast, VStack } from "native-base";
import React, { Fragment, useEffect, useState } from "react";
import * as yup from "yup";
import { FormikInput } from "./FormikInput";
import { FormikSelect } from "./FormikSelect";
import { regions, provinces } from "psgc";
import { Municipality, Province } from "psgc/dist/PsgcInterface";
import { AddAddressQuery } from "../queries/address/add";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { useUserQuery } from "../helpers/auth";
import { Address } from "../helpers/types";

const schema = yup.object().shape({
  name: yup.string().required(),
  region: yup.string().required(),
  province: yup.string().required(),
  city: yup.string().required(),
  barangay: yup.string().required(),
  house: yup.string().required(),
  postalCode: yup
    .string()
    .required()
    .matches(/^[0-9]+$/, "Must be only digits"),
});

interface IProps extends NativeStackScreenProps<any, any> {
  address?: Address;
}

export function AddressFormComponent({ address, ...props }: IProps) {
  return (
    <Fragment>
      <Formik
        validationSchema={schema}
        initialValues={
          address || {
            name: "",
            region: "",
            province: "",
            city: "",
            barangay: "",
            house: "",
            postalCode: "",
          }
        }
        onSubmit={async (values, actions) => {
          const query = await AddAddressQuery(values);

          if (!query.message.includes("Success")) {
            return actions.setStatus(query.message);
          }
          actions.resetForm();
          Toast.show({ description: "Address Successfully added." });
          return props.navigation.navigate("Profile");
        }}
      >
        {(formik) => <_Formik {...formik} />}
      </Formik>
    </Fragment>
  );
}

export interface AddressFormValues {
  name: string;
  region: string;
  province: string;
  city: string;
  barangay: string;
  house: string;
  postalCode: string;
}

function _Formik(formik: FormikProps<AddressFormValues>) {
  const toast = useToast();
  const [mRegions] = useState(regions.all());
  const [mProvinces, setMProvinces] = useState<Province[]>([]);
  const [mCity, setMCity] = useState<Municipality[]>([]);

  useEffect(() => {
    if (formik.values.region === "") return;

    toast.show({ description: "Setting provinces..." });
    const _regions = regions
      .all()
      .filter((region) => region.designation === formik.values.region);

    if (_regions.length > 0) {
      setMProvinces(_regions[0].provinces);
    }
  }, [formik.values.region]);

  useEffect(() => {
    if (formik.values.province === "") return;

    toast.show({ description: "Setting municipalities..." });
    const _province = provinces.filter(formik.values.province);

    if (_province) {
      const result = _province.find((v) => v.region == formik.values.region);
      result && setMCity(result.municipalities);
    }
  }, [formik.values.province]);

  return (
    <VStack space={2}>
      <FormikInput formik={formik} name="name" label="Full Name" />

      <FormikSelect
        formik={formik}
        name="region"
        options={mRegions.map((v) => {
          return {
            label: v.name,
            value: v.designation,
          };
        })}
      />

      <FormikSelect
        formik={formik}
        name="province"
        options={mProvinces.map((v) => {
          return {
            label: v.name,
            value: v.name,
          };
        })}
      />

      <FormikSelect
        formik={formik}
        name="city"
        label="City / Municipality"
        options={mCity.map((v) => {
          return {
            label: v.name,
            value: v.name,
          };
        })}
      />
      {/* 
      <FormikSelect
        formik={formik}
        name="barangay"
        options={mBarangay.map((v) => {
          return {
            label: v.name,
            value: v.name,
          };
        })}
      /> */}

      <FormikInput formik={formik} name="barangay" />

      <FormikInput formik={formik} name="house" label="Street Address" />

      <FormikInput formik={formik} name="postalCode" label="Postal Code" />

      <Divider my={2} />
      <Button
        onPress={() => formik.submitForm()}
        disabled={formik.isSubmitting}
        isLoading={formik.isSubmitting}
        shadow={3}
      >
        Submit
      </Button>
    </VStack>
  );
}
