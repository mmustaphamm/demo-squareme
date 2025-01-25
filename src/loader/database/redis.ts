import { Redis } from 'ioredis'
import db from "../../config/db"
import app from '../../config/app';

const redis = app.server.env !== 'production' ? null : new Redis(db.redisOptions);

(async () => {
    if (!redis) {
        // throw new Error('Redis client does not exist!');
        // process.exit(1);
        console.log('Redis client does not exist on test!')
    }
    redis?.on('connect', () => {
        console.log('Redis client is initiating a connection to the server.');
    });

    redis?.on('ready', () => {
        console.log('Redis client successfully initiated connection to the server.');
    });

    redis?.on('reconnecting', () => {
        console.log('Redis client is trying to reconnect to the server...');
    });

    redis?.on('error', (err) => console.log('Redis Client Error', err));
    redis
})()

/**
 * https://www.npmjs.com/package/ioredis
 */
export class cache {

    static async get(key: string) {
        try {
            const cacheResults = await redis?.get(key);
            if (cacheResults && typeof cacheResults == 'string') {
                return JSON.parse(cacheResults);
            } else {
                return null
            }
        } catch (error) {
            console.error('redis get error', error);
            return null;
        }
    }

    /**
     * 
     * @param key 
     * @param value 
     * @param ttl expiry in seconds 60 * 60 * 24 is a day
     */
    static async set(key: string, value, ttl: number|null = null) {
        if (ttl) {
            await redis?.set(key, JSON.stringify(value), "EX", ttl); // await redis.expire(key, ttl)
            console.log(await redis?.ttl(key));
        } else {
            await redis?.set(key, JSON.stringify(value));
        }
    }

    static async delete(key) {
        await redis?.del(key);
        console.log(`${key} is deleted`)
    }

    static async getExpiry(key) {
        redis?.ttl(key, (err, result) => {
            if (err) {
                console.error(err);
            } else {
                console.log('TTL:', result);
            }
        });
    }
}

export default redis