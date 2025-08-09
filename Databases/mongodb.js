import mongoose from 'mongoose';
import {DB_URI, NODE_ENV} from "../config/env";

if(!DB_URI){
    throw new Error('No DB URI found');
}

// Track the connection state
let isConnected = false;

const connectToDatabase = async () => {
    // If already connected, return without connecting again
    if (isConnected) {
        return;
    }

    try {
        // Set connection options
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };

        // Connect to the database
        await mongoose.connect(DB_URI, options);

        // Set the connection state to true
        isConnected = true;

        console.log(`Connected to database in ${NODE_ENV} mode`);
    } catch (error) {
        console.error('Error connecting to database: ', error);

        // Reset the connection state
        isConnected = false;

        process.exit(1);
    }
}

export default connectToDatabase;
