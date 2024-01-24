const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;
const mongoDb = require("./db.js");

// Enable CORS middleware
app.use(cors());

// Connect to MongoDB and set up routes after successful connection
mongoDb()
  .then(() => {
    // Middleware to parse JSON requests
    app.use(express.json());

    // Your routes
    app.get("/", (req, res) => {
      res.send("hello world!");
    });

    app.use("/api", require("./Routes/CreateUser.js"));
    app.use("/api", require("./Routes/DisplayData.js"));
    app.use("/api", require("./Routes/OrderData.js"));
    

    // Start the server
    app.listen(port, () => {
      console.log(`${port} is listening to the server`);
    });
  })
  .catch((error) => {
    console.error("Error starting server:", error.message);
  });
