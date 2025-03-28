import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import axios from "axios";
import SpotifyWebApi from "spotify-web-api-node";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Allow frontend requests with credentials
app.use(cookieParser());

const scopes = [
  "user-read-private",
  "user-read-email",
  "user-top-read",
  "user-read-recently-played",
  "user-library-read",
  "playlist-read-private"
];

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: "http://localhost:5173/callback",
});

/** ✅ 1️⃣ LOGIN ROUTE: Redirect user to Spotify OAuth **/
app.get("/login", (req, res) => {
  const authURL = spotifyApi.createAuthorizeURL(scopes);
  res.redirect(authURL);
});

/** ✅ 2️⃣ CALLBACK ROUTE: Get tokens & store them securely **/
app.get("/callback", async (req, res) => {
  const code = req.query.code;
  console.log("🔹 Step 1: Received Spotify callback. Code:", code);
  if (!code) return res.status(400).send("Authorization code is missing");

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token, expires_in } = data.body;

    // Set tokens in backend instance
    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);

    console.log("✅ Access Token:", access_token);
    console.log("🔄 Refresh Token:", refresh_token);

    // Store tokens in **secure HTTP-only cookies** (instead of URL)
    res.cookie("spotify_access_token", access_token, {
      httpOnly: true,
      secure: false, // Set to true in production
      maxAge: expires_in * 1000, // Expiration time
    });

    res.cookie("spotify_refresh_token", refresh_token, {
      httpOnly: true,
      secure: false,
    });

    // Redirect user to frontend dashboard (without tokens in URL)
    res.redirect("http://localhost:5173/spotify");

  } catch (error) {
    console.error("❌ Error getting tokens:", error);
    res.status(500).send("Error getting tokens");
  }
});

/** ✅ 3️⃣ REFRESH TOKEN ROUTE: Refresh access token when expired **/
app.post("/refresh_token", async (req, res) => {
  const refreshToken = req.cookies.spotify_refresh_token;
  if (!refreshToken) return res.status(400).json({ error: "Missing refresh token" });

  try {
    spotifyApi.setRefreshToken(refreshToken);
    const data = await spotifyApi.refreshAccessToken();
    const newAccessToken = data.body.access_token;

    // Update HTTP-only cookie with new access token
    res.cookie("spotify_access_token", newAccessToken, {
      httpOnly: true,
      secure: false,
      maxAge: data.body.expires_in * 1000,
    });

    console.log("🔄 New access token:", newAccessToken);
    res.json({ success: true });

  } catch (error) {
    console.error("❌ Error refreshing token:", error);
    res.status(500).json({ error: "Failed to refresh token" });
  }
});

/** ✅ 4️⃣ GET USER PROFILE & VERIFY SCOPES **/
app.get("/me", async (req, res) => {
  try {
    const accessToken = req.cookies.spotify_access_token;
    if (!accessToken) return res.status(401).json({ error: "Unauthorized" });

    spotifyApi.setAccessToken(accessToken);
    const response = await spotifyApi.getMe();
    res.json(response.body);
  } catch (error) {
    console.error("❌ Error fetching user profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

app.listen(7777, () => console.log("✅ Server running on http://localhost:7777"));