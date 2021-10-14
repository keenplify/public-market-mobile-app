import { Button, HStack, Text, useToast, VStack } from "native-base";
import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";
import axios from "axios";
import { AddImageQuery } from "../queries/images/add";
import { b64toBlob } from "../helpers/file";
import { Image } from "../helpers/types";

interface Props {
  onUpload: (image: Image) => void;
  images: Image[];
}

export function ProductImageUploader({ onUpload }: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const toast = useToast();
  const askPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        toast.show({
          description:
            "Sorry, we need camera roll permissions to make this work!",
        });
      }
    }
  };

  useEffect(() => {
    askPermissions();
  }, []);

  const pickImage = async () => {
    setIsUploading(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (result.cancelled === true) {
      setIsUploading(false);
      return toast.show({ description: "Picking image is cancelled." });
    }
    const formData = new FormData();

    formData.append("image", {
      //@ts-ignore
      uri: result.uri,
      type: "image/jpeg",
      name: "photo.jpg",
    });
    const newImage = await AddImageQuery({ formData, toast });
    setIsUploading(false);

    if (!newImage?.message?.includes("Success"))
      return toast.show({ description: "Unable to upload image!" });

    onUpload(newImage.image);
  };

  return (
    <VStack>
      <HStack>
        <Text fontWeight="bold">Upload Images</Text>
      </HStack>
      <Button
        onPress={pickImage}
        disabled={isUploading}
        isLoading={isUploading}
      >
        Upload Image
      </Button>
    </VStack>
  );
}
