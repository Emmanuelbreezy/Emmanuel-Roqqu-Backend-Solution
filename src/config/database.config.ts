import "dotenv/config";
import path from "path";
import { DataSource } from "typeorm";
import { ENV } from "./env.config";

export const getDatabaseConfig = () => {
  const isProduction = ENV.NODE_ENV === "production";

  return new DataSource({
    type: "sqlite",
    database: path.resolve(__dirname, "../database/db.sqlite"),
    entities: [
      path.resolve(
        __dirname,
        "..",
        "database",
        "entities",
        "**/*.entity.{ts,js}"
      ),
    ],
    migrations: [
      path.resolve(__dirname, "..", "database", "migrations", "**/*.{ts,js}"),
    ],
    synchronize: !isProduction,
    logging: ["error"],
  });
};

export const AppDataSource = getDatabaseConfig();
