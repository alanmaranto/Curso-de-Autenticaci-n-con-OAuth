const request = require("request");

function getUserPlaylists(accessToken, userId) {
  if (!accessToken || !userId) {
    return Promise.resolve(null);
  }

  const options = {
    url: `https://api.spotify.com/v1/users/${userId}/playlists`,
    headers: { Authorization: `Bearer ${accessToken}` },
    json: true,
  };

  return new Promise((resolve, reject) => {
    request.get(options, function (error, response, body) {
      if (error || response.statusCode !== 200) {
          console.log(error)
        reject(error);
      }

      resolve(body);
    });
  });
}

module.exports = {
  getUserPlaylists,
};
