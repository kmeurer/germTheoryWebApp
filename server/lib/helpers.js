var jwt  = require('jwt-simple');

module.exports = {
  errorLogger: function(error, req, res, next) {
    // log the error then send it to the next middleware in
    // serverConfig.js

    console.error(error.stack);
    next(error);
  },

  errorHandler: function(error, req, res, next) {
    // send error message to client
    // message for gracefull error handling on app
    res.send(500, {error: error.message});
  },

  // return a 405 if the API does not support the desired function
  invalidMethodHandler: function(req, res, next) {
    res.send(405, { message: "Method not allowed" });
  },

  decode: function(req, res, next) {
    var token = req.headers['x-access-token'];
    var user;

    if (!token) {
      return res.send(403); // send forbidden if a token is not provided
    }

    try {
      // decode token and attach user to the request
      // for use inside our controllers
      user = jwt.decode(token, 'secret');
      req.user = user;
      next();
    } catch(error) {
      return next(error);
    }
  },

  isLoggedIn: function(req, res, next) {
    if (req.isAuthenticated()) {
      console.log('logged in');
      return next();
    } else {

    // if they aren't redirect them to the login page
    console.log('not logged in');
    res.redirect('/auth/login');
    }
  }
};