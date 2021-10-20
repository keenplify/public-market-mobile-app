import React, { Dispatch, SetStateAction } from "react";
import { Product } from "./types";

const ProductContext = React.createContext<{
  product: Partial<Product>;
  isEditMode: boolean;
  setIsEditMode: Dispatch<SetStateAction<boolean>>;
}>({
  product: {},
  isEditMode: false,
  setIsEditMode: () => {},
});

export const useProduct = () => React.useContext(ProductContext);
export const ProductProvider = ProductContext.Provider;
