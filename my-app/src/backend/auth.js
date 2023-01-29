import React, {useId,  useEffect, useState } from 'react';
import axios from 'axios';

import './backend.css';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';



export default function LogIn() {
    const [duration, setDuration] = useState("")
    const CLIENT_ID = "9bd164afd63340c3a1522022a25e4442"
    const REDIRECT_URI = "http://localhost:3000"
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE = "token"
    // const playlist_id = response.json()['id']

    const playlist_api = "https://api.spotify.com/v1/me/playlists"

    const all_songs_ref = []
    const all_songs_duration = []


    const getSongs = async (e) => {

        e.preventDefault()
        const songs = await axios
            .get(playlist_api, {
                headers: {
                    Authorization: "Bearer " + token
                }
            })
            .then(r => {
                const playlists = r.data.items
                playlists.forEach((p) => {
                    axios
                        .get(p.tracks.href, {
                            headers: {
                                Authorization: "Bearer " + token
                            }
                        })
                        .then(r => {
                            const tracks = r.data.items
                            // console.log(tracks)
                            tracks.forEach((t) => {
                                const ref = t.track.href
                                const time = t.track.duration_ms
                                all_songs_ref.push(ref)
                                // all_songs_duration.push(time)
                            })
                            console.log(all_songs_ref)
                            // console.log(all_songs_duration)

                        })
                        .then(r => {
                            filterSongs(value)
                            console.log("fajjae")
                        }
                    )
                })
            })
            .catch(r => console.log(r.message))

    }



    const getUserId = () => {
        let id = axios
            .get("https://api.spotify.com/v1/me", {
                headers: {
                    Authorization: "Bearer " + token
                }
            })
            .then(r => id = r)
        return id
    }

    const makePlaylist = () => {
        const userid = getUserId()
        const playlist = axios
            .post("https://api.spotify.com/v1/users/" + userid + "/playlists", {name: "Timeify"}, {
                headers: {
                    Authorization: "Bearer " + token
                }
            })
            .then(r => console.log(r))
    } 

    const [token, setToken] = useState("")
    
    const [value, setValue] = useState('');

    function MyControlledInput({ }) {
        const onChange = (event) => {
          setValue(event.target.value);
        };
        return (
          <>
            <input value={value} onChange={onChange} />
          </>
        );
      }
    const id = useId();
    const [input, setInput] = useState('');
    const [title, setTitle] = useState('')
    const [genre, setGenre] = useState('');



    useEffect(() => {
        const hash = window.location.hash
        let token = window.localStorage.getItem("token")

        if (!token && hash) {
            token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

            window.location.hash = ""
            window.localStorage.setItem("token", token)
        }

        setToken(token)

    }, [])

    const logout = () => {
        setToken("")
        window.localStorage.removeItem("token")
    }

    function filterSongs(minutes) {
        console.log("FILTERING")
        const playlist_refs = []
        all_songs_ref.forEach((ref) => {
            axios.get(ref, {
                headers: {
                    Authorization: "Bearer " + token
                }
            })
                .then(r => {
                    console.log(r.data.duration_ms)
                    const ms = r.data.duration_ms
                    if (ms < minutes) {
                        minutes = minutes - ms
                        if (minutes < 0) {
                            
                        }
                        playlist_refs.push(ref)
                    }
                })
        })
        console.log(playlist_refs)

        
        // all_songs_ref.sort(function (a, b) {
        //     let a_duration = 0
        //     let b_duration = 0
        //     axios.get(a, {
        //         headers: {
        //             Authorization: "Bearer " + token
        //         }
        //     })
        //         .then(r => {
        //             let a_duration = r.data.duration_ms
        //             axios.get(b, {
        //                 headers: {
        //                     Authorization: "Bearer " + token
        //                 }
        //             })
        //                 .then(r => { let b_duration = r.data.duration_ms })
                    
        //     }).then({return (a_duration - b_duration)})
        // })

    }

    // function handleSubmit() {
    //     getSongs()

        
    // }

    const darkTheme = createTheme({
        palette: {
          mode: 'dark',
        },
      });

      
    

    return (
        <div className="App">
            <header className="App-header">

            {!token ?
            // if the user is not logged in, render this portion
            <div>
                <h1 style = {{fontFamily: "'Montserrat'"}}>Spotify React</h1>
                <p className = "description"style = {{fontFamily: "'Montserrat'"}}>
                    Timify is an app that allows you to generate a random playlist with 
                    according to time and genre specifications.
                </p>
                <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>
                <button className = "login-button">
                    <p style = {{color: "#FFFFFF", fontWeight:500, outline: "#FFFFFF", margin: 0}}>Login to Spotify</p>
                </button>
                </a>
            </div>
                : 
                // if the user is logged in, render this
                <div className = "content-div">


                    {/* <input id={id} value={input} onInput={e => setInput(e.target.value)}/> */}
                    {console.log(input)}

                    <ThemeProvider theme={darkTheme}>
                    <CssBaseline />

                    <div className="surround">

                        <div className='field'>
                            <TextField id="outlined-number" label="Duration of playlist (minutes)" type="text" InputLabelProps={{shrink: true,}} style = {{width:350}} 
                            value = {input} onChange = {x => setInput(x.target.value)}/>
                        </div>
                        
                        <div className='field'>
                            <TextField id="outlined-basic" label="Playlist Name" variant="outlined" InputLabelProps={{shrink: true,}} style = {{width:350}} 
                            value = {title} onChange = {x => setTitle(x.target.value)}/>
                        </div>

                        <div className='field'>
                            <FormControl style = {{width:350}}>
                                <InputLabel id="demo-simple-select-label">Genre</InputLabel>
                                <Select labelId="demo-simple-select-label" id="demo-simple-select" value={genre} label="Genre"
                                onChange={x => setGenre(x.target.value)}>
                                <MenuItem value={1}>Pop</MenuItem>
                                <MenuItem value={2}>Rock</MenuItem>
                                <MenuItem value={3}>Jazz</MenuItem>
                                <MenuItem value={4}>Classical</MenuItem>
                                {console.log(genre)}
                                </Select>
                            </FormControl>
                        </div>
                        <div style = {{paddingBottom: "1rem",}}>
                            <button className = "login-button">
                                <p style = {{color: "#FFFFFF", fontWeight:500, outline: "#FFFFFF", margin: 0}}>Generate Playlist</p>
                            </button>
                        </div>
                        <div style = {{paddingTop: "1rem",}}>
                            <button className = "logout-button" onClick={logout}>
                                <p style = {{color: "#1DB954", fontWeight:500, outline: "#FFFFFF", margin: 0}}>Logout</p>
                            </button>
                        </div>

                    </div>
                    </ThemeProvider>



                    {/* <a href={"https://open.spotify.com/playlist/" + playlist_id}> */}
                        
                    {/* </a> */}

                    
                </div>
                }
            </header>
        </div>
    );
}

