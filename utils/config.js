import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const {env} = process;
const {
    CONNECTION_STRING,
    DB_NAME,
    COLLECTION_NAME,
    PORT,
    WEB_BENUTZERNAME,
    WEB_PASSWORT,
} = env;

export const dbConfig = {
    CONNECTION_STRING,
    DB_NAME,
    COLLECTION_NAME,
}

export const serverConfig = {
    PORT,
    WEB_BENUTZERNAME,
    WEB_PASSWORT, 
}