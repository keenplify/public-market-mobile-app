import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";
import { useToast } from "native-base";
import { SERVER_API } from "../../helpers/string";
import { IImgBBUpload, Image } from "../../helpers/types";

interface AddImageResponse {
  message: string;
  error?: any;
  // imgbb: IImgBBUpload;
  image: Image;
}

interface Props {
  formData: FormData;
  toast: any;
  onUploadProgress?: (progressEvent: any) => void;
  productId?: number;
}

export const AddImageQuery = async ({
  formData,
  toast,
  onUploadProgress,
  productId,
}: Props) => {
  const asToken = await AsyncStorage.getItem("token");

  if (asToken === null || !asToken) return null;

  try {
    const response: AxiosResponse<AddImageResponse> = await axios.post(
      SERVER_API + "/api/images/add",
      formData,
      {
        params: {
          productId,
        },
        headers: {
          Authorization: "Bearer " + asToken,
          // "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
      }
    );

    return response.data;
  } catch (error) {
    toast.show({ description: "Unable to upload image!" });
  }
};
