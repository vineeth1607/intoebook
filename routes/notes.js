const express = require("express");
const router  = express.Router();

router.get('/', (req, res)=>{

    // const object ={
    //     name : "VideoEncoder",
    //     number : 13234
    // };
    res.json(object);

})
 module.exports = router