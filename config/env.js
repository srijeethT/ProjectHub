import {config} from 'dotenv';

config({path:`.env.local`});

export const{
    DB_URI,
    NODE_ENV,
    JWT_SECRET,JWT_EXPIRE,
}=process.env;