import "dotenv/config";
import { DataSource } from "typeorm";
import { ENV } from "./env.config";
import path from "path";

export const getDatabaseConfig = () => {
  const isProduction = ENV.NODE_ENV === "production";
  console.log(path.resolve(__dirname, "../database/db.sqlite"), "db");

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
