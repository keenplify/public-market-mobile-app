import Constants from "expo-constants";

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getFirstLetters(string: string) {
  var matches = string.match(/\b(\w)/g);
  return matches.join("");
}

export const moneySign = "₱";

export const SERVER_API: string = Constants.manifest.extra.SERVER_API;

export function isValidHttpUrl(string: string) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(string);
}

export function serveImageURI(url: string) {
  if (isValidHttpUrl(url)) return { uri: url };

  return { uri: SERVER_API + "/" + url };
}

export const PRIMARY_COLOR = "#00B6D4";
