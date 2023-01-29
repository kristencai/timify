import React, { useId, useEffect, useState } from "react";
import axios from "axios";

import "./backend.css";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';



export default function LogIn() {
  // const [duration, setDuration] = useState("")
  const CLIENT_ID = "9bd164afd63340c3a1522022a25e4442";
  const REDIRECT_URI = "http://localhost:3000";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const SCOPE="playlist-modify-public%20playlist-modify-private"
  // const playlist_id = response.json()['id']

  const playlist_api = "https://api.spotify.com/v1/me/playlists";

  const all_songs_ref = [];
  const all_songs_duration = [];

  const getSongs = async (e) => {
    // console.log(all_songs_ref);
    console.log("getting...");

    e.preventDefault();
    const songs = await axios.get(playlist_api, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    console.log(songs);
    const playlists = songs.data.items;
    // await playlists.forEach();
    const cb = async (p) => {
      
    };

    for (const song of playlists) {
      const data_playlist_maybe = await axios.get(song.tracks.href, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const tracks = data_playlist_maybe.data.items;
      // console.log(tracks)
      for (const t of tracks) {
        const ref = t.track.href;
        const time = t.track.duration_ms;
        all_songs_ref.push(ref);
        // all_songs_duration.push(time)
      }
      // console.log(all_songs_ref)
      // console.log(all_songs_duration)
    }

    
    makePlaylist(await filterSongs(parseInt(input)))
    console.log(link)
  };

   const getUserId = async () => {
    const id = await axios
      .get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })

    return id.data.id;
  };

  const makePlaylist = async (songs) => {
    const userid = await getUserId()
    const playlist = await axios({
      method: 'post',
      url: "https://api.spotify.com/v1/users/" + userid + "/playlists",
      headers: {
        Authorization: "Bearer " + token,
      },
      data:
      {
        "name": title,
        // "description": "New playlist description",
        "public": false
      }
    })

    const playlist_id = playlist.data.id
    // console.log(playlist_id)
      
    console.log(playlist.data.external_urls.spotify)
    const url = playlist.data.external_urls.spotify
    setLink(url)
    console.log(url)
    // console.log(url)

    let uri_string = ""
    for (const uri of songs) {
      uri_string += uri + ","
    }


    const addSongs = await axios({
      method: 'post',
      url: "https://api.spotify.com/v1/playlists/" + playlist_id + "/tracks?uris=" + uri_string,
      headers: {
        Authorization: "Bearer " + token,
      },
    })

    console.log(addSongs)
  };

  const [token, setToken] = useState("");


  const id = useId();
  const [input, setInput] = useState("");
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");

  const [link, setLink] = useState("")

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }

    setToken(token);
  }, []);

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };

  async function filterSongs(minutes) {
    // console.log("FILTERING" + minutes);
    const playlist_refs = [];
    let index = 0;
    let limit = minutes;
    // console.log(all_songs_ref)

    while (limit > 0) {
      const r = await axios.get(all_songs_ref[index], {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const converted = r.data.duration_ms / 60000;
      // console.log(converted);
      if (converted < limit) {
        console.log("decrementing limit by " + converted);
        playlist_refs.push(r.data.uri);
      }
      index += 1;
      limit -= converted;
      // console.log("+1");
      // console.log(limit);
    }
    // console.log("FINAL PLAYLIST:");
    // playlist_refs.forEach((r) => console.log(r));
    // console.log(playlist_refs.length);
console.log(playlist_refs)
    return playlist_refs

  }



  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  return (
    <div className="App">
      <header className="App-header">
        {!token ? (
          // if the user is not logged in, render this portion
          <div>
            <h1 style={{ fontFamily: "'Montserrat'" }}>Spotify React</h1>
            <p className="description" style={{ fontFamily: "'Montserrat'" }}>
              Timify is an app that allows you to generate a random playlist
              with according to time and genre specifications.
            </p>
            <a
              href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}
            >
              <button className="login-button">
                <p
                  style={{
                    color: "#FFFFFF",
                    fontWeight: 500,
                    outline: "#FFFFFF",
                    margin: 0,
                  }}
                >
                  Login to Spotify
                </p>
              </button>
            </a>
          </div>
        ) : (
          // if the user is logged in, render this
          <div className="content-div">
            {/* <input id={id} value={input} onInput={e => setInput(e.target.value)}/> */}
            {console.log(input)}

            <ThemeProvider theme={darkTheme}>
              <CssBaseline />

              <div className="surround">
                <div className="field">
                  <TextField
                    id="outlined-number"
                    label="Duration of playlist (minutes)"
                    type="text"
                    InputLabelProps={{ shrink: true }}
                    style={{ width: 350 }}
                    value={input}
                    onChange={(x) => setInput(x.target.value)}
                  />
                </div>

                <div className="field">
                  <TextField
                    id="outlined-basic"
                    label="Playlist Name"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    style={{ width: 350 }}
                    value={title}
                    onChange={(x) => setTitle(x.target.value)}
                  />
                </div>

                <div className="field">
                  <FormControl style={{ width: 350 }}>
                    <InputLabel id="demo-simple-select-label">Genre</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={genre}
                      label="Genre"
                      onChange={(x) => setGenre(x.target.value)}
                    >
                      <MenuItem value={1}>Pop</MenuItem>
                      <MenuItem value={2}>Rock</MenuItem>
                      <MenuItem value={3}>Jazz</MenuItem>
                      <MenuItem value={4}>Classical</MenuItem>
                      {console.log(genre)}
                    </Select>
                  </FormControl>
                </div>
                <form onSubmit={getSongs}>
                  <div style={{ paddingBottom: "1rem" }}>
                    <button className="login-button">
                      <p
                        style={{
                          color: "#FFFFFF",
                          fontWeight: 500,
                          outline: "#FFFFFF",
                          margin: 0,
                        }}
                      >
                        Generate Playlist
                      </p>
                    </button>
                    </div>
                    
                    {
                        link !== "" ?

                          (
                          <a href={link}>
                            <input type="button" className="login-button2" value="Playlist Link" />
                          </a>
                          
                                
                            ) : (<p></p>)
                    }
                </form>

                <div style={{ paddingTop: "1rem" }}>
                  <button className="logout-button" onClick={logout}>
                    <p
                      style={{
                        color: "#1DB954",
                        fontWeight: 500,
                        outline: "#FFFFFF",
                        margin: 0,
                      }}
                    >
                      Logout
                    </p>
                  </button>
                </div>
              </div>
            </ThemeProvider>

            {/* <a href={"https://open.spotify.com/playlist/" + playlist_id}> */}

            {/* </a> */}
          </div>
        )}
      </header>
    </div>
  );
}
