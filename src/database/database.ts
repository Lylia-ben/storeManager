import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = 'mongodb://localhost:27017/store'; // Replace with your MongoDB URI
    await mongoose.connect(mongoURI); // Options are no longer required
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
};

export default connectDB;
