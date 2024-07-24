import { DataSource } from "typeorm";
import { config } from "dotenv";
import Application from "../models/application.js";
import Small_Application from "../models/small-application.js";

config({ path: ".env" }); //.env.prod
console.log(process.env.MYSQL_HOST);

const AppSource = new DataSource({
  type: "mysql", //type of database
  host: process.env.MYSQL_HOST,
  username: process.env.MYSQL_USERNAME,
  port: Number(process.env.MYSQL_PORT),
  database: process.env.MYSQL_DATABASE,
  password: process.env.MYSQL_PASSWORD,
  logging: true,
  // synchronize: true, // Set to false to prevent automatic table creation,  instructs TypeORM to automatically create database tables on every application launch according to the entities defined in your models.
  entities: [Application, Small_Application], //"../entities/*{.ts,.js}"
  // migrations: ["./migrations/*{.ts,.js}"],
  // migrationsTableName: "custom_migration_table",
}); //source where add ,get ,..//DataSource is a pre-defined connection configuration

export default AppSource;
