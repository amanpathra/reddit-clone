import mongoose from 'mongoose';

const mongodbUri = 'mongodb://127.0.0.1:27017/reddit?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false';

const connectToMongo = () => {
    mongoose.connect(mongodbUri);
}

export default connectToMongo;