const mongoose = require("mongoose");
require('dotenv').config();

const mongoURL = process.env.mongoURL;

const mongoDb = async () => {
  try {
    await mongoose.connect(mongoURL);
    console.log("Database Connection Successfully");

    const fetchedData = await mongoose.connection.db.collection("food_item").find({}).toArray();
    global.food_item = fetchedData;

    const catData = await mongoose.connection.db.collection("food_category").find({}).toArray();
    global.food_category = catData;

    console.log("Data Fetched Successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
  }
};

module.exports = mongoDb;
