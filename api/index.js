const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const { config } = require("./config");

const app = express();

// middlewares
// app.use(bodyParser.json())
app.use(express.json());

// endpoints
app.post("/api/auth/token", (req, res) => {
  const { email, username, name } = req.body;
  const token = jwt.sign({ sub: username, email, name }, config.authJwtSecret);
  res.json({ access_token: token });
});

app.get("/api/auth/verify", (req, res, next) => {
  const { access_token } = req.query;

  try {
    const decoded = jwt.verify(access_token, config.authJwtSecret);
    res.json({
      message: "the access token is valid",
      username: decoded.sub,
    });
  } catch (error) {
    next(error);
  }
});

const server = app.listen(5000, () => {
  console.log(`Listening on port ${server.address().port}`);
});
