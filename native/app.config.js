export default {
  name: "Public Market",
  version: "1.0.1",
  extra: {
    SERVER_API: "https://pmma.herokuapp.com",
    SERVER_API_DEV: "http://192.168.254.100:3000",
    SERVER_SOCKET: "https://pmma.herokuapp.com",
    ENV: "PROD",
  },
  orientation: "portrait",
  android: {
    package: "com.m87.marketapp",
  },
  icon: "assets/adaptive-icon.png",
};
