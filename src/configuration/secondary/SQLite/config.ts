import { DataSourceOptions } from "typeorm/browser";
import { SQLiteCategory } from "../../../adapters/secondaries/SQLite/category/category";
import { SQLiteExpense } from "../../../adapters/secondaries/SQLite/expense/expense";

const config: DataSourceOptions = {
  type: "react-native",
  database: "nest",
  location: "default",
  logging: [],
  synchronize: true,
  entities: [SQLiteCategory, SQLiteExpense],
};

export default config;
