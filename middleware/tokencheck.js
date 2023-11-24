var jwt = require('jsonwebtoken');

module.exports = function () {
    return async function (req, res, next) {
      try
      {
        if(req.headers.authorization == undefined || req.headers.authorization == 'undefined')
          return res.status(404).json({ success: false, data:{}, message: 'Please Enter Token',status:404});

        var decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        req.user = decoded;
        next();
      }catch (error) {
        console.log('<<<<<Token Invalid Error<<<<<', error);
        res.status(401).json({succeess:false, data:[], message: 'Token is not valid'});
      }
    }
  }