import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // We use the dbName option to ensure it connects exactly to 'bookmyshow' regardless of the URI's default db or query parameters
        const conn = await mongoose.connect(process.env.MONGO_URI, { dbName: 'bookmyshow' });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
