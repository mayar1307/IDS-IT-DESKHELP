function register(req, res) {
  res.json({
    message: "Register route working. Database connection will be added later.",
    receivedData: req.body
  });
}

function login(req, res) {
  res.json({
    message: "Login route working. JWT + database authentication will be added later.",
    receivedData: req.body
  });
}

function forgotPassword(req, res) {
  res.json({
    message: "Forgot password route working. Email/reset logic will be added later.",
    receivedData: req.body
  });
}

module.exports = {
  register,
  login,
  forgotPassword
};
