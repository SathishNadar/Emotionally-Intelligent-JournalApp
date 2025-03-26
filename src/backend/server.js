import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import axios from "axios";
import SpotifyWebApi from 'spotify-web-api-node'

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const scopes = [
  "user-read-private",
  "user-read-email",
  "user-top-read",
  "user-read-recently-played", 
  "user-library-read",
  "playlist-read-private"
];

var spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: 'http://localhost:5173/callback'
});

app.get('/login', (req, res) => {
  const authURL = spotifyApi.createAuthorizeURL(scopes);
  res.redirect(authURL);
});

app.get('/callback', (req, res) => {
  const code = req.query.code;
  console.log("🔹 Step 1: Received callback from Spotify. Code:", code);
  if (!code) {
    return res.status(400).send("Authorization code is missing");
  }

  spotifyApi.authorizationCodeGrant(code)
    .then(data => {
      const access_token = data.body['access_token'];
      const refresh_token = data.body['refresh_token'];
      const expires_in = data.body['expires_in'];

      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);

      console.log("Access token received:", access_token);
      console.log("Refresh token received:", refresh_token);

      const redirectURL = `http://localhost:5173/callback?access_token=${encodeURIComponent(access_token)}&refresh_token=${encodeURIComponent(refresh_token)}&expires_in=${expires_in}`;
      console.log("🔹 Redirecting to frontend with URL:", redirectURL);
      res.redirect(redirectURL);
      
      // Automatically refresh token before expiry
      const refreshAccessToken = async () => {
        try {
          const data = await spotifyApi.refreshAccessToken();
          console.log("🔄 Access token refreshed:", data.body['access_token']);
          spotifyApi.setAccessToken(data.body['access_token']);
        } catch (error) {
          console.error("❌ Error refreshing token:", error);
        }
      };
      setInterval(refreshAccessToken, expires_in / 2 * 1000);
    })
    .catch(error => {
      console.error("Error getting tokens:", error);
      res.status(500).send("Error getting tokens");
    });
});

app.post("/refresh_token", async (req, res) => {
  console.log("Received refresh token request:", req.body); // Debugging log

  const refreshToken = req.body.refresh_token;

  if (!refreshToken) {
    return res.status(400).json({ error: "Missing refresh token" });
  }

  try {
    spotifyApi.setRefreshToken(refreshToken);
    const data = await spotifyApi.refreshAccessToken();
    console.log("New access token:", data.body.access_token);

    res.json({
      access_token: data.body.access_token,
      expires_in: data.body.expires_in
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(500).json({ error: "Failed to refresh token" });
  }
});

app.listen(7777, () => console.log('HTTP Server up. Now go to http://localhost:7777/login in your browser.'))