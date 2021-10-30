declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: "development" | "production" | "test";
      PORT?: number;
      JET_LOGGER_MODE?: string;
      JET_LOGGER_FILEPATH?: string;
      JET_LOGGER_TIMESTAMP?: boolean;
      JET_LOGGER_FORMAT?: string;
      JWT_SECRET?: string;
      JWT_ALGORITHM?: string;
      IMGBB_KEY?: string;

      FIH_KEY?: string;

      DATABASE_URL?: string;

      AWS_BUCKET_NAME?: string;
      AWS_BUCKET_REGION?: string;
      AWS_CREDENTIALS_ID?: string;
      AWS_CREDENTIALS_SECRET?: string;
    }
  }
}

export {};
