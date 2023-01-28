import React, { useEffect, useState } from 'react';
import axios from 'axios';



export default function LogIn() {
    const CLIENT_ID = "9bd164afd63340c3a1522022a25e4442"
    const REDIRECT_URI = "http://localhost:3000"
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE = "token"

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
                <h1>Spotify React</h1>
                {!token ?
                    <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login
                        to Spotify</a>
                    : <div>
                         <form onSubmit={getSongs}>
                        <input type="text" /*onChange={e => setSearchKey(e.target.value)}*//>
                        <button type={"submit"}>Search</button>
                        </form> 
                        <button onClick={logout}>Logout</button>
                    </div> }
            </header>
        </div>
    );
}

