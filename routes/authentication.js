const  express = require('express');
const User = require('../models/User');
const  router  = express.Router();



router.post('/', (req, res)=>{

    // created a user using POST "/pai/authentication". it doesn't require authenticatication 
     const user = User(req.body);
     user.save();
     console.log(req.body)
    res.send(req.body);

});

module.exports = router