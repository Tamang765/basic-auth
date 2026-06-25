import { DataSource } from "typeorm";
import config from "../config/config.js";
import { entities } from "../entities.js";

const appDataSource = new DataSource({
  type: "postgres",
  database: config.db.database,
  host: config.db.host,
  port: config.db.port || 5432,
  username: config.db.user,
  password: config.db.password,
  entities: entities,
  synchronize: true,
});

export default appDataSource;

const connectDatabase = async () => {
  try {
    await appDataSource.initialize();
    console.log("Database connection established successfully.");
  } catch (error: Error | any) {
    console.error("Error establishing database connection:", error.message);
    process.exit(1); // Exit the process with an error code
  }
};

export { appDataSource, connectDatabase };
