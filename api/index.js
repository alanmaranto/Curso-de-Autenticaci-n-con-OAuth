const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { config } = require("./config");
const request = require("request");
const encodeBasic = require("./utils/encodeBasic");
const { getUserPlaylists } = require("./actions/userActions");

const app = express();

// prod only
/* const corsOptions = {
  origin: "http://yourclientside.con"
}

app.use(cors(corsOptions)); */

// middlewares
// app.use(bodyParser.json())
app.use(cors());
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

app.get("/api/playlists", async function (req, res, next) {
  const { userId } = req.query;

  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization: `Basic ${encodeBasic(
        config.spotifyClientId,
        config.spotifyClientSecret
      )}`,
    },
    form: {
      grant_type: "client_credentials",
    },
    json: true,
  };

  request.post(authOptions, async function (error, response, body) {
    if (error || response.statusCode !== 200) {
      next(error);
    }

    const accessToken = body.access_token;
    const userPlaylists = await getUserPlaylists(accessToken, userId);
    res.json({ playlists: userPlaylists });
  });
});

const server = app.listen(5000, () => {
  console.log(`Listening on port ${server.address().port}`);
});
