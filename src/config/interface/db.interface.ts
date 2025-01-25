export interface IConnection {
    mysql: {
        host: string
        user: string
        password: string
        database: string,
        connectionLimit?: number
    },
    mongo: {
        url: string
    }
}
interface mapper {
    type: string,
    host: string,
    port: number,
    username: string,
    password: string,
    database: string,
    synchronize: boolean,
    logging: boolean,
    entities: object,
    migrations: object,
    migrationsTableName: string
    subscribers: object,
}

export interface IORMMapper {
    typeorm: mapper
}

export interface Iredis {
    host: string,
    port: number,
    password: string
    // connectTimeout: 2, // optional
    // tls: object
}