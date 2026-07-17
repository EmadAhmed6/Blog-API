const { default: mongoose } = require("mongoose");

const connectToDB = async () => {
    try {
    await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected`);
    } catch(err) {
        console.error(`failed to connect to database ${err}`)
    }
}

module.exports = connectToDB;