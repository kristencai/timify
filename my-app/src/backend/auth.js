import React, { useEffect, useState } from 'react';
import './backend.css';


export default function LogIn() {
    const CLIENT_ID = "9bd164afd63340c3a1522022a25e4442"
    const REDIRECT_URI = "http://localhost:3000"
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE = "token"

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

                    <input name="searchTxt" type="text" maxlength="512" id="searchTxt" class="searchField" placeholder='Enter a minute value'/>

                    <button className = "logout-button" onClick={logout}>
                        <p style = {{color: "#1DB954", fontWeight:500, outline: "#FFFFFF", margin: 0}}>Logout</p>
                    </button>
                </div>
                }
            </header>
        </div>
    );
}

