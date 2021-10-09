import Constants from "expo-constants";

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const SERVER_API: string = Constants.manifest.extra.SERVER_API;
