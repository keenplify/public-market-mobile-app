import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";

export const SearchContext = createContext<string>("");

export const useSearchContext = useContext(SearchContext);
