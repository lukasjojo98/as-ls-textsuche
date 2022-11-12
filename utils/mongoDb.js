import mongodb from 'mongodb';
import {dbConfig} from './config.js';
const {MongoClient} = mongodb;

let _db; //'_' private

const {CONNECTION_STRING, DB_NAME, COLLECTION_NAME} = dbConfig;

export const mongoConnect = function(cb) {
    MongoClient.connect( CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(client => {
            _db = client.db(DB_NAME).collection(COLLECTION_NAME);
            cb();
        })
        .catch( () => {
            throw new Error('DB connection failed...');
        });
};

export const getDB = () => {
    if (_db) {
        return _db;
    } else {
        throw new Error('DB connect failed');
    }
};
