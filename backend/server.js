import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import axios from "axios";

import cookieParser from "cookie-parser";
import SpotifyWebApi from "spotify-web-api-node";

import chatbotAPI from "./chatbot.js"

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Allow frontend requests with credentials
app.use(cookieParser());

app.use("/api",chatbotAPI);

const scopes = [
  "user-read-private",
  "user-read-email",
  "user-top-read",
  "user-read-recently-played",
  "user-library-read",
  "playlist-read-private",
  "user-read-playback-state", 
  "user-modify-playback-state", 
  "streaming"
];

const spotifyApi = new SpotifyWebApi({
  // clientId: process.env.SPOTIFY_CLIENT_ID,
  clientId: "02b1b7cde28f4f32849dd0d6d8fa3cd2",
  // clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  clientSecret: "ab497121fd014e0ab01009fa6a355885",
  redirectUri: "http://localhost:7777/callback",
});

/* Redirects the user to SPOTIFY OAUTH login page along with CLIENT_ID, CLIENT_SECRET and REDIRECT_URI*/
app.get("/login", (req, res) => {
  const authURL = spotifyApi.createAuthorizeURL(scopes);
  console.log("🔹 Redirecting to Spotify:", authURL);
  res.redirect(authURL);
});

/*the AUTH code we get from login is attached with the URL and sent to get Access_token... http://localhost:7777/callback?code=YOUR_AUTH_CODE */
app.get("/callback", async (req, res) => {
  const error = req.query.error;
  const code = req.query.code;

  if (error) {
    console.error("❌ Callback Error:", error);
    return res.status(400).send(`Callback Error: ${error}`);
  }
  
  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    
    const accessToken = data.body["access_token"];
    const refreshToken = data.body["refresh_token"];
    const expiresIn = data.body["expires_in"];
    
    spotifyApi.setAccessToken(accessToken);
    spotifyApi.setRefreshToken(refreshToken);

    console.log("✅ Access Token:", accessToken);
    console.log("🔄 Refresh Token:", refreshToken);
    console.log(`🎵 Token expires in ${expiresIn} seconds.`);

    // Store the tokens in a secure HTTP-only cookie (for frontend use)
    res.cookie("spotify_access_token", accessToken, { httpOnly: true, secure: false, maxAge: expiresIn * 1000 });
    res.cookie("spotify_refresh_token", refreshToken, { httpOnly: true, secure: false });

    // Redirect user to /spotify
    res.redirect("http://localhost:5173/spotify");

    // **Automatic Token Refresh**
    setInterval(async () => {
      try {
        const refreshedData = await spotifyApi.refreshAccessToken();
        const newAccessToken = refreshedData.body["access_token"];
        console.log("🔄 The access token has been refreshed!");
        console.log("✅ New access token:", newAccessToken);
        spotifyApi.setAccessToken(newAccessToken);
      } catch (refreshError) {
        console.error("❌ Error refreshing token:", refreshError);
      }
    }, expiresIn / 2 * 1000);

  } catch (error) {
    console.error("❌ Error getting tokens:", error);
    res.status(500).send(`Error getting tokens: ${error}`);
  }
});

/* /callback backend route already handles the refresh_token when expires this route helps in manual Refresh of token upon ERROR */
app.post("/refresh_token", async (req, res) => {
  const refreshToken = req.cookies.spotify_refresh_token;
  if (!refreshToken) {
    return res.status(400).json({ error: "Missing refresh token" });
  }

  try {
    spotifyApi.setRefreshToken(refreshToken);
    const data = await spotifyApi.refreshAccessToken();
    const newAccessToken = data.body["access_token"];

    // Update the cookie with new access token
    res.cookie("spotify_access_token", newAccessToken, {
      httpOnly: true,
      secure: false,
      maxAge: data.body.expires_in * 1000,
    });

    console.log("✅ Refreshed Access Token:", newAccessToken);
    res.json({ success: true });

  } catch (error) {
    console.error("❌ Error refreshing token:", error);
    res.status(500).json({ error: "Failed to refresh token" });
  }
});


/* Helps Retrive all user scopes of the USER */
app.get("/api/spotify-data", async (req, res) => {
  try {
    const accessToken = req.cookies.spotify_access_token;
    if (!accessToken) {
      return res.status(302).json({ redirect: "/login" });
    }

    spotifyApi.setAccessToken(accessToken);
    
    // Fetch user data
    const userProfile = await spotifyApi.getMe();
    const recentlyPlayed = await spotifyApi.getMyRecentlyPlayedTracks();
    const topArtists = await spotifyApi.getMyTopArtists();
    const topTracks = await spotifyApi.getMyTopTracks();
    const savedTracks = await spotifyApi.getMySavedTracks();
    const playlists = await spotifyApi.getUserPlaylists();

    res.json({
      user: userProfile.body,
      recentlyPlayed: recentlyPlayed.body.items,
      topArtists: topArtists.body.items,
      topTracks: topTracks.body.items,
      savedTracks: savedTracks.body.items,
      playlists: playlists.body.items
    });

  } catch (error) {
    console.error("❌ Error fetching Spotify data:", error);
    res.status(500).json({ error: "Failed to fetch Spotify data" });
  }
});

/** ✅ 4️⃣ GET USER PROFILE & VERIFY SCOPES **/
app.get("/me", async (req, res) => {
  try {
    const accessToken = req.cookies.spotify_access_token;
    
    // If no access token, redirect to login instead of failing
    if (!accessToken) {
      return res.status(302).json({ redirect: "/login" }); // Frontend should handle this
    }

    spotifyApi.setAccessToken(accessToken);
    const response = await spotifyApi.getMe();
    res.json(response.body);
    
  } catch (error) {
    console.error("❌ Error fetching user profile:", error);

    // Handle token expiration - send user to login if token is invalid
    if (error.statusCode === 401) {
      return res.status(302).json({ redirect: "/login" });
    }

    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

app.post("/api/spotify/play", async (req, res) => {
  try {
    const accessToken = req.cookies.spotify_access_token;
    if (!accessToken) {
      return res.status(401).json({ error: "Unauthorized. Please log in." });
    }

    const { device_id } = req.body;
    if (!device_id) {
      return res.status(400).json({ error: "Device ID is required" });
    }

    spotifyApi.setAccessToken(accessToken);
    
    await axios.put(
      "https://api.spotify.com/v1/me/player",
      { device_ids: [device_id], play: true },
      { headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" } }
    );

    res.json({ success: true, message: "Playback started" });

  } catch (error) {
    console.error("❌ Error starting playback:", error);
    res.status(500).json({ error: "Failed to start playback" });
  }
});


app.listen(7777, () => console.log("✅ Server running on http://localhost:7777"));