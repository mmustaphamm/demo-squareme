import "reflect-metadata"
import { DataSource, DataSourceOptions } from "typeorm"
import dbConfig from "./config/db";

export const AppDataSource = new DataSource(<DataSourceOptions>dbConfig.mapper.typeorm)