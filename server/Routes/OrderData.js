const express = require("express");
const Orders = require("../models/Orders");
const router = express.Router();

router.post("/orderData", async (req, res) => {
  const { email, order_data, order_date } = req.body;

  try {
    // Check if the email exists in the database
    const existingOrder = await Orders.findOne({ email });

    if (existingOrder) {
      // If the email exists, update the order_data
      await Orders.findOneAndUpdate(
        { email },
        { $push: { order_data: { order_date, ...order_data } } }
      );
    } else {
      // If the email does not exist, create a new order
      await Orders.create({
        email,
        order_data: [{ order_date, ...order_data }],
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});
router.post("/myOrderData", async (req, res) => {
  try {
    let myData = await Orders.findOne({ email: req.body.email });
    res.json({ orderData: myData });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
