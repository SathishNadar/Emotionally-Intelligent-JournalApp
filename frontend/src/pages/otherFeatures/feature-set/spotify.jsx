import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Spotify = () => {
  const navigate = useNavigate();
  const [spotifyData, setSpotifyData] = useState(null);
  const [error, setError] = useState(null);
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState(null);

  useEffect(() => {
    const fetchSpotifyData = async () => {
      try {
        const response = await fetch("http://localhost:7777/api/spotify-data", { 
          method: "GET",
          credentials: "include" });

        if (response.status === 302) {
          window.location.href = "/login"; // Redirect user to login if unauthorized
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setSpotifyData(data);
      } catch (error) {
        console.error("❌ Error fetching Spotify data:", error);
        setError("Failed to fetch Spotify data. Please try again.");
      }
    };

    fetchSpotifyData();
  }, [navigate]);

  // useEffect(() => {
  //   const script = document.createElement("script");
  //   script.src = "https://sdk.scdn.co/spotify-player.js";
  //   script.async = true;
  //   script.onload = () => {
  //     if (window.onSpotifyWebPlaybackSDKReady) {
  //       window.onSpotifyWebPlaybackSDKReady();
  //     }
  //   };
  //   document.head.appendChild(script);
  // }, []);

  // Initialize Spotify Web Playback SDK
  // useEffect(() => {
  //   if (!spotifyData) return;

  //   window.onSpotifyWebPlaybackSDKReady = () => {
  //     const token = spotifyData?.accessToken;
  //     if (!token) {
  //       console.error("⚠️ No access token available!");
  //       return;
  //     }

  //     const newPlayer = new window.Spotify.Player({
  //       name: "Web Player",
  //       getOAuthToken: cb => { cb(token); },
  //       volume: 0.5
  //     });

  //     newPlayer.addListener("ready", async ({ device_id }) => {
  //       console.log("✅ Ready with Device ID", device_id);
  //       setDeviceId(device_id);
  //       setPlayer(newPlayer);
  //       await startPlayback(device_id);
  //     });

  //     newPlayer.addListener("player_state_changed", (state) => {
  //       if (!state) return;
  //       document.getElementById("togglePlay").onclick = function () {
  //         newPlayer.togglePlay();
  //       };
  //     });

  //     newPlayer.addListener("not_ready", ({ device_id }) => {
  //       console.log("❌ Device ID has gone offline", device_id);
  //     });

  //     newPlayer.connect();
  //   };
  // }, [spotifyData]);

  // const handleNextTrack = () => {
  //   if (player) {
  //     player.nextTrack().then(() => {
  //       console.log("⏭️ Skipped to next track!");
  //     });
  //   }
  // };

  // const handlePreviousTrack = () => {
  //   if (player) {
  //     player.previousTrack().then(() => {
  //       console.log("⏮️ Set to previous track!");
  //     });
  //   }
  // };

  // async function startPlayback(device_id) {
  //   try {
  //     const response = await fetch("http://localhost:7777/api/spotify/play", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       credentials: "include",
  //       body: JSON.stringify({ device_id }),
  //     });

  //     const data = await response.json();
  //     if (data.success) {
  //       console.log("✅ Playback started successfully!");
  //     } else {
  //       console.error("❌ Error:", data.error);
  //     }
  //   } catch (error) {
  //     console.error("❌ Network error:", error);
  //   }
  // }

  return (
    <div>
      {error ? <h1>{error}</h1> : null}

      {spotifyData ? (
        <div>
          <h1>Welcome, {spotifyData.user.display_name}!</h1>
          <img src={spotifyData.user.images?.[0]?.url} alt="Profile" width="100" />

          <h2>🎶 Recently Played</h2>
          <ul>
            {spotifyData.recentlyPlayed.map(track => (
              <li key={track.track.id}>{track.track.name} - {track.track.artists[0].name}</li>
            ))}
          </ul>

          <h2>🔥 Top Artists</h2>
          <ul>
            {spotifyData.topArtists.map(artist => (
              <li key={artist.id}>{artist.name}</li>
            ))}
          </ul>

          <h2>⭐ Top Tracks</h2>
          <ul>
            {spotifyData.topTracks.map(track => (
              <li key={track.id}>{track.name} - {track.artists[0].name}</li>
            ))}
          </ul>

          <h2>💾 Saved Tracks</h2>
          <ul>
            {spotifyData.savedTracks.map(track => (
              <li key={track.track.id}>{track.track.name} - {track.track.artists[0].name}</li>
            ))}
          </ul>

          <h2>📁 Playlists</h2>
          <ul>
            {spotifyData.playlists.map(playlist => (
              <li key={playlist.id}>{playlist.name}</li>
            ))}
          </ul>

          {/* Spotify Web Player
          <div id="spotify-player">
          <button id="togglePlay">Toggle Play</button>
          <button onClick={handlePreviousTrack}>⏮️ Previous</button>
          <button onClick={handleNextTrack}>⏭️ Next</button>
          </div> */}
        </div>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
};

export default Spotify;