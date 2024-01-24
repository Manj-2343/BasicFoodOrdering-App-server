const express = require("express");
const router = express.Router();

router.post('/foodData',(req,res)=>{
    try{
res.send([global.food_item,global.food_category])
    }
    catch(error){
console.error(error.message);
res.send("server error")
    }
})
module.exports=router;