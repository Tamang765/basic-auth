const isProduction = process.env.NODE_ENV === "production";

type Config = {
  isProduction: boolean;
  port: number | string;
  jwt: {
    secret: string;

    expire: string;
  };
  apiPrefix: string;
  cors: {
    origin: string;
  };
  db: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
  };
  logging: boolean;
};

const config: Config = {
  isProduction,
  port: process.env.PORT || 5005,
  jwt: {
    secret: process.env.JWT_SECRET || "your-secret-key",
    expire: "6d" as const,
  },
  apiPrefix: process.env.API_PREFIX || "/v1/api",
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
  },
  db: {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "123456789",
    database: process.env.DB_NAME || "auth",
  },

  logging:
    process.env.DB_LOGGING === "true" || process.env.NODE_ENV === "development",
};

export default config;
