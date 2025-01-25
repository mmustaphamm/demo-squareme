import { IConnection, IORMMapper, Iredis } from "./interface/db.interface"
import * as dotenv from "dotenv"
import { UserData } from "./../module/user/user.entity"
dotenv.config()

const defaultDB: string = process.env.DB_CONNECTION as string

const connection: IConnection = {
    mysql: {
        host: process.env.DB_HOST as string,
        user: process.env.DB_USERNAME as string,
        password: process.env.DB_PASSWORD as string,
        database: process.env.DB_DATABASE as string,
        connectionLimit: Number(process.env.DB_POOL_CONNECTION_LIMIT) as number
    },
    mongo: {
        url: process.env.MONGO_URL as string
    },
}

const mapper: IORMMapper = {
    typeorm: {
        type: "mysql",
        host: process.env.DB_HOST as string,
        port: Number(process.env.DB_PORT) as number,
        username: process.env.DB_USERNAME as string,
        password: process.env.DB_PASSWORD as string,
        database: process.env.DB_DATABASE as string,
        synchronize: false, // please never turn this to true
        logging: false,
        entities: [UserData],
        migrations: [],
        migrationsTableName: "migration_table",
        subscribers: [],
    },
}

const redisOptions: Iredis = {
    host: process.env.REDIS_HOST as string,
    port: Number(process.env.REDIS_PORT) as number,
    password: process.env.REDIS_PASSWORD as string,
    // connectTimeout: 2 // optional
    // tls: {}
}

export default {
    conn: connection[defaultDB],
    connection,
    defaultDB,
    mapper,
    redisOptions
}