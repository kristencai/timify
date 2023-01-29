import React, {useId,  useEffect, useState } from 'react';
import axios from 'axios';

import './backend.css';


export default function LogIn() {
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
                            console.log(tracks)
                            tracks.forEach((t) => {
                                const ref = t.track.href
                                const time = t.track.duration_ms
                                all_songs_ref.push(ref)
                                // all_songs_duration.push(time)
                            })
                            console.log(all_songs_ref)
                            // console.log(all_songs_duration)

                        })
                })
            })
            .catch(r => console.log(r.message))

        // setArtists(data.artists.items)
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
    const id = useId();
    const [input, setInput] = useState('');

    getSong: 

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

                    <input id={id} value={input} onInput={e => setInput(e.target.value)}/>
                    {console.log(input)}

                    {/* <a href={"https://open.spotify.com/playlist/" + playlist_id}> */}
                        <button className = "login-button">
                        <p style = {{color: "#FFFFFF", fontWeight:500, outline: "#FFFFFF", margin: 0}}>Generate Playlist</p>
                        </button>
                    {/* </a> */}

                    <button className = "logout-button" onClick={logout}>
                        <p style = {{color: "#1DB954", fontWeight:500, outline: "#FFFFFF", margin: 0}}>Logout</p>
                    </button>
                </div>
                }
            </header>
        </div>
    );
}

